const yup = require('yup');
const fs = require('fs');

module.exports = yup.object().shape({
    searchType: yup
        .string()
        .required("A search method is required.")
        .uppercase()
        .oneOf(
            [
                "BEGINS_WITH",
                "ENDS_WITH",
                "LIKE"
            ]
        ),

    searchValue: yup
        .string()
        .required("A search query is required.")
        .uppercase()
        .trim(),

    state: yup
        .string()
        .notRequired()
        .uppercase()
        .oneOf(
            fs.readdirSync(`${__dirname}/../searchers`).map(fname => fname.split('.')[0]),
            "State is not one of the supported states."
        ),

    available: yup
        .boolean()
        .transform(value => {
            if(typeof value === 'string') {
                if(value.length === 0) return undefined;
                if(value === 'true') return true;
                if(value === 'false') return false;
            }
            return value;
        })
        .nullable(true)
        .notRequired()
});