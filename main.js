let ParseObject = require("./ParseObject.js");
let stringify = require("./stringify.js");
let isValidJSON = require("./isValidJson")
const ValidateAndParse = (JSONstr) => {

    try{
        if(isValidJSON(JSONstr) == true)
            console.log(ParseObject(JSONstr));
        else {
            throw new Error("JSON is not valid JSON!");
        }
    }
    catch (ValueError) {
        console.log(ValueError.message);
    }
}