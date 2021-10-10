const yup = require('yup');
const fs = require('fs');

/* eslint no-undef: "off" */
module.exports = yup.object().shape({
    plates: yup
        .array()
        .of(
            yup.string().uppercase()
        )
        .required("A list of plate IDs to search is required."),
    /* eslint no-undef: "off" */
    state: yup
        .string()
        .required("A state to search within is required.")
        .uppercase()
        /* eslint no-undef: "off" */
        .oneOf(
            /* eslint no-undef: "off" */
            fs.readdirSync(`${__dirname}/../searchers`).map(fname => fname.split('.')[0]),
            "State is not one of the supported states."
        ),
});