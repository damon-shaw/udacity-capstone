const yup = require('yup');
const fs = require('fs');

module.exports = yup.object().shape({
    id: yup
        .string()
        .uppercase()
        .required("A plate ID is required."),
    state: yup
        .string()
        .required("A state to search within is required.")
        .uppercase()
        .oneOf(
            /* eslint no-undef: "off" */
            fs.readdirSync(`${__dirname}/../searchers`).map(fname => fname.split('.')[0]),
            "State is not one of the supported states."
        ),
});