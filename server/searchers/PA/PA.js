const axiosInstance = require('axios').create({});
var querystring = require('querystring');
const _ = require('lodash');

const htmlParse = require('node-html-parser');

module.exports.moduleID = "PA PLATECHECKER";
module.exports.metadata = {
    state: 'Pennsylvania',
    stateAbbr: 'PA'
};

module.exports.cookie = undefined;
module.exports.sessionData = {
    ni: null,
};

module.exports.constants = {};
module.exports.constants.COOKIE_RENEW_URL = "https://www.dot3e.penndot.gov/vehicle_services/vrvanity.jsp?navigation=true";
module.exports.constants.PLATE_SEARCH_URL = "https://www.dot3e.penndot.gov/vehicle_services/AmsServlet.jsp";

module.exports.constants.ENTRYPOINT_URL = "https://www.dot3e.penndot.gov/vehicle_services/vrvanity.jsp";

module.exports.checkAvailability = checkAvailability;
module.exports.renewCookie = renewCookie;

async function checkAvailability(plateID) {

    console.log(`[${this.moduleID}] Submitting an availability check for ${plateID}.`);

    const answerResponse = await axiosInstance.post(
        this.constants.PLATE_SEARCH_URL,
        querystring.stringify(this.computeRequestBody(plateID)),
        {
            headers: this.computeRequestHeaders(),
            validateStatus: (status) => status === 200
        }
    );



    rootNode = htmlParse.parse(answerResponse.data);

    let answerTexts = [
        rootNode.querySelector("#A strong"),
        rootNode.querySelector("#NA strong"),
        rootNode.querySelector("#UN strong"),
        rootNode.querySelector("#Invalid strong"),
        rootNode.querySelector("#Many strong")
    ];

    let answerTextParents = answerTexts.map(el => el.parentNode);

    let idxOfDisplayed = _.findIndex(answerTextParents, (item) => {
        let props = this.parseColonString(item.attributes.style || {});
        if(props.display && props.display === 'block')
            return true;
        return false;
    });

    let isAvailable = this.readResponse(answerTexts[idxOfDisplayed].text);

    return isAvailable;
}

async function renewCookie() {
    console.log(`[${this.moduleID}] Attempting to get a new cookie!`);
    try {
        // Wipe out the cookie.
        this.cookie = undefined;

        // Contact the entrypoint URL to get the base form. This contains a form with hidden inputs
        // that have set values. These values define the session and must be included in a subsequent
        // request.
        let entrypointResp = await axiosInstance.get(this.constants.ENTRYPOINT_URL);

        if(entrypointResp && entrypointResp.headers && entrypointResp.headers['set-cookie']) {
            console.log("Copying cookie from the entrypoint response.");
            this.cookie = entrypointResp.headers['set-cookie'].map(cookie => cookie.split(';')[0]).join('; ');
            this.cookie = this.cookie + ";";
            console.log(this.cookie);
        }

        console.log(this.computeRequestHeaders());
        entrypointResp = await axiosInstance.get(this.constants.ENTRYPOINT_URL,
            {
                headers: this.computeRequestHeaders()
            }
        );

        // Get the hardcoded values on these hidden input fields.
        let rootNode = htmlParse.parse(entrypointResp.data);
        let formData = {
            ni: rootNode.querySelector('input[name="ni"]')._attrs['VALUE'],
            vanityAction: rootNode.querySelector('input[name="vanityAction"]')._attrs['value'],
            id: rootNode.querySelector('input[name="id"]')._attrs['value'],
            plateType: "ST", // Select the STANDARD plate type.
            continueButton: "Continue"
        };

        // POST this extracted data and the set form values. This progresses the form to Step 2,
        // which offers links to vehicle types (Truck, Passenger, etc.). Each of these links have
        // unique NI values attached to them which must be used to continue with the session.
        const step2Resp = await axiosInstance.post(
            this.constants.PLATE_SEARCH_URL,
            querystring.stringify(formData),
            {
                headers: this.computeRequestHeaders(),
                validateStatus: (status) => status === 200
            }
        );
        
        // Parse the response and grab the container that holds the vehicle type links.
        rootNode = htmlParse.parse(step2Resp.data);
        let plateLinks = rootNode.querySelector('#plateLinks');
        
        // Find the link whose interior text is Passenger, then get the NI value attached to it.
        let passengerNode = _.find(plateLinks.childNodes, ['text', 'Passenger']);
        let ni = passengerNode.attributes['HREF'].split('=')[1];

        // Make a new request with the extracted NI value. This request opens the final step where
        // the user can enter a plate to search for. We have to load this page and get the NI value
        // again before we can start submitting our actual plate value requests.
        const step3Resp = await axiosInstance.get(
            this.constants.PLATE_SEARCH_URL + `?ni=${ni}`,
            {
                headers: this.computeRequestHeaders(),
                validateStatus: (status) => status === 200
            }
        );

        // Get the NI value and store it in session data for subsequent requests.
        this.sessionData.ni = this.retrieveNIValue(step3Resp.data);

        console.log("this.sessionData.ni = " + this.sessionData.ni);

    }
    catch(err) {
        console.log(err);
    }
}

module.exports.retrieveNIValue = function(htmlData) {
    let rootNode = htmlParse.parse(htmlData);
    let niInput = rootNode.querySelector('input[name="ni"]');
    
    if(typeof niInput === 'undefined' || niInput === null)
        return undefined;

    return niInput.attributes['value'] || niInput.attributes['VALUE'];
}

module.exports.parseColonString = function(string) {
    let definitions = string.split(';');

    let result = {};
    for(let definition of definitions) {
        let split = definition.split(':');
        let prop = split[0];
        let value = split[1];
        result[prop] = value;
    }

    return result;
}

module.exports.isSessionExpired = function(htmlData) {
    let parsed = htmlParse.parse(htmlData);

    let pageTitle = parsed.querySelector('.topNavTitle');

    if(pageTitle && pageTitle.text.trim() === 'ERROR 800 - Page Has Expired') {
        console.log("Session has expired! Need to get a new cookie!");
        return true;
    }

    return false;
}

module.exports.computeRequestHeaders = function() {
    return {
        "Host": "www.dot3e.penndot.gov",
        "Cookie": this.cookie || "",
        "Connection": "keep-alive",
        "Content-Type": "application/x-www-form-urlencoded",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-User": "?1",
        "Origin": "https://www.dot3e.penndot.gov",
        "Referer": "https://www.dot3e.penndot.gov/vehicle_services/vrvanity.jsp",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.193 Safari/537.36"
    }
}

module.exports.computeRequestBody = function(plateID) {
    return {
        "ni": this.sessionData.ni,
        "vanityAction": "CHECK_PLATE",
        "tagNum": plateID,
        "plateIndex": 4,
        "constLetters": "/",
        "stackPos": "/",
        "imsVanityResult": "",
        "vanityTagInd": "",
        "num": [
            plateID[0] || "",
            plateID[1] || "",
            plateID[2] || "",
            plateID[3] || "",
            plateID[4] || "",
            plateID[5] || "",
            plateID[6] || "",
            plateID[7] || "",
        ]
    };
}

module.exports.readResponse = function(decision) {
    // console.log(decision);

    switch(decision) {
        case 'Plate configuration requested is available.':
            return true;
        case 'The registration plate configuration you requested may be reserved or may be in violation of the Department\'s' +
             'guidelines for acceptable configurations. You are free to submit an application for a detailed review by the Department.':
            return false;
        case 'The registration plate configuration you requested is a configuration previously issued and therefore not available.':
            return false;
        case 'Invalid Character Used - Special characters may not be used for vanity license plates.':
            return false;
        case 'Too many characters in plate configuration, only 7 characters are allowed.':
            return false;
        default:
            throw 'The response message is not a known one.';
    }
}

axiosInstance.interceptors.response.use((response) => {
    if(response.config.url === this.constants.ENTRYPOINT_URL)
        return Promise.resolve(response);

    if(this.isSessionExpired(response.data) || response.headers['set-cookie'] != null) {

        // As of 11/16/2020 it seems a new cookie was added. This cookie is returned
        // for every request, even if that cookie has been set in the request headers.
        // This behavior breaks the "if any set-cookie is defined then retry" functionality
        // that's set up here. To fix this, skip the retry and cookie renew if _only_
        // the tautological set-cookie is seen.
        // if(response.headers['set-cookie'].length === 1) {
        //     if(response.headers['set-cookie'][0].indexOf("BIGipServerPOOL") >= 0) {
        //         console.log("Only the BIGipServerPOOL cookie is present.");
        //         return Promise.resolve(response);
        //     }
        // }

        console.log("Found set-cookie is this response");
        console.log(response.headers);
        return new Promise(async (res, rej) => {
            try {
                await this.renewCookie();
                let newConfig = { ...response.config };
                newConfig.headers["Cookie"] = this.cookie;

                if(newConfig.data) {
                    let parsedData = JSON.parse(JSON.stringify(querystring.parse(newConfig.data)));
                    console.log(parsedData);
                    console.log(parsedData.ni);

                    if(parsedData.ni.length === 0) {
                        parsedData.ni = this.sessionData.ni;
                        newConfig.data = querystring.stringify(parsedData);
                        console.log("Injecting NI value.");
                        console.log(newConfig.data);
                    }
                }
                //console.log(newConfig);

                //console.log("Making the follow-up request.")
                console.log(newConfig.headers["Cookie"]);
                let newResp = await axiosInstance.request(newConfig);
                // console.log(newResp.data);
                console.log("Done with the follow-up request.");
                res(newResp);
            }
            catch(err) {
                rej(err);
            }
        });
    }

    return Promise.resolve(response);
}, null);