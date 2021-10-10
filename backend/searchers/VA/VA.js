var axiosInstance = require('axios');
var querystring = require('querystring');
var htmlParser = require('node-html-parser');
const logger = require('../../config/logging');

module.exports.moduleID = "VA PLATECHECKER";
module.exports.metadata = {
    state: 'Virginia',
    stateAbbr: 'VA'
};

module.exports.cookie = undefined;
module.exports.constants = {};
module.exports.constants.DMV_BASE_URL = "https://www.dmv.virginia.gov";
module.exports.constants.COOKIE_RENEW_URL = "https://www.dmv.virginia.gov/dmvnet/plate_purchase/select_plate.asp";
module.exports.constants.PLATE_SEARCH_URL = "https://www.dmv.virginia.gov/dmvnet/common/router.asp";

module.exports.checkAvailability = checkAvailability;
module.exports.renewCookie = renewCookie;

async function checkAvailability(plateID) {

    logger.info({
        label: this.moduleID,
        message: `Submitting an availability check for ${plateID}.`
    });

    try {
        // Make the request for an availability statement for this plate.
        // A redirect to a different endpoint will be provided where the decision
        // is provided.
        const routerResp = await axiosInstance.post(this.constants.PLATE_SEARCH_URL,
            querystring.stringify(this.computeRequestBody(plateID)),
            {
                headers: this.computeRequestHeaders(),
                maxRedirects: 0,
                validateStatus: (status) => status === 302
            }
        );

        logger.info({
            label: this.moduleID,
            message: `Received a router response for ${plateID}. Looking up route.`
        });

        // Retrieve the availability statement.
        const checkResp = await axiosInstance.get(
            this.constants.DMV_BASE_URL + routerResp.headers.location,
            { headers: this.computeRequestHeaders() }
        );

        logger.info({
            label: this.moduleID,
            message: `Found route response for ${plateID}.`
        });

        let isAvailable = this.readResponse(checkResp.data);

        logger.info({
            label: this.moduleID,
            message: `Read response for ${plateID}. Is available? ${isAvailable}`
        });

        return isAvailable;
    }
    catch(error) {
        console.log("*************Caught an error!")
        throw error;
    }
}

async function renewCookie() {
    logger.info({
        label: this.moduleID,
        message: 'Attempting to get a new cookie.'
    });

    try {
        const response = await axiosInstance.get(
            this.constants.COOKIE_RENEW_URL,
            {
                maxRedirects: 0,
                validateStatus: (status) => status >= 200 && status < 400
            }
        );

        if(response && response.headers && response.headers['set-cookie']) {
            this.cookie = response.headers['set-cookie'].map(cookie => cookie.split(';')[0]).join('; ');
            this.cookie = this.cookie + ";";
        }

    }
    catch(err) {
        logger.error({
            label: this.moduleID,
            message: err.message
        });
    }
}

module.exports.computeRequestHeaders = function() {
    return {
        "Host": "www.dmv.virginia.gov",
        "Cookie": this.cookie || "",
        "Connection": "keep-alive",
        "Content-Type": "application/x-www-form-urlencoded",
        "Sec-Fetch-Dest": "frame",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-User": "?1",
        "Origin": "https://www.dmv.virginia.gov",
        "Referer": "https://www.dmv.virginia.gov/dmvnet/plate_purchase/s2end.asp?dt=81693119",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36"
    }
}

module.exports.computeRequestBody = function(plateID) {
    return {
        "TransType": "INQ",
        "TransID": "RESINQ",
        "ReturnPage": "/dmvnet/plate_purchase/s2end.asp",
        "HelpPage": "",
        "Choice": "A",
        "PltNo": plateID,
        "HoldISA": "N",
        "HoldSavePltNo": "",
        "HoldCallHost": "",
        "NumCharsInt": "8",
        "CurrentTrans": "plate_purchase_reserve",
        "PltType": "IGWT",
        "PersonalMsg": "Y",
        "Let1": plateID[0] || "",
        "Let2": plateID[1] || "",
        "Let3": plateID[2] || "",
        "Let4": plateID[3] || "",
        "Let5": plateID[4] || "",
        "Let6": plateID[5] || "",
        "Let7": plateID[6] || "",
        "Let8": plateID[7] || ""
    };
}

module.exports.readResponse = function(htmlBody) {
    htmlBody = htmlBody.replace("<!-- Begin Script", "");
    htmlBody = htmlBody.replace("SCRIPT", "script");

    let result = htmlParser.parse(htmlBody).querySelector("html td font").innerHTML;

    if(result) {
        logger.info({
            label: this.moduleID,
            message: `Found a response in the body.\n${result}`
        });

        if(result === "Personalized message already taken.  You can only purchase it if you  already reserved this message or it is on a vehicle you own.")
            return false;
        if(result === "Personalized message requested is not available.  Please try another message.")
            return false;
        if(result === "Congratulations.  The message you requested is available.")
            return true;

        if(result.includes("Plate number exceeded maximum allowable characters for plate type entered"))
            throw new Error("The requested plate does not meet character count criteria.");
        
        throw new Error("The response message is not a known one.");
    }
    else {
        throw new Error("An availability statement could not be found in the response.");
    }
}

axiosInstance.interceptors.response.use((response) => {
    if(response.config.url === this.constants.COOKIE_RENEW_URL)
        return Promise.resolve(response);

    if(response.headers['set-cookie'] != null) {

        // As of 11/16/2020 it seems a new cookie was added. This cookie is returned
        // for every request, even if that cookie has been set in the request headers.
        // This behavior breaks the "if any set-cookie is defined then retry" functionality
        // that's set up here. To fix this, skip the retry and cookie renew if _only_
        // the tautological set-cookie is seen.
        if(response.headers['set-cookie'].length === 1) {
            if(response.headers['set-cookie'][0].indexOf("BIGipServerPOOL") >= 0) {
                logger.info({
                    label: this.moduleID,
                    message: `Only the 'BIGipServerPOOL' cookie is present. Completing interception.`
                });
                return Promise.resolve(response);
            }
        }

        logger.info({
            label: this.moduleID,
            message: `Found the 'set-cookie' header in the response.`
        });
        return new Promise(async (res, rej) => {
            try {
                await this.renewCookie();
                let newConfig = { ...response.config };
                newConfig.headers["Cookie"] = this.cookie;
                let newResp = await axiosInstance.request(newConfig);
                logger.info({ label: this.moduleID, message: `Done with the follow-up request.` });
                res(newResp);
            }
            catch(err) {
                rej(err);
            }
        });
    }

    return Promise.resolve(response);
}, null);