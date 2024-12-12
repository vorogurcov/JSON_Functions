let Parser = require("./Parse.js");
let stringify = require("./stringify.js");
const ValidateAndParse = (JSONstr) => {

    try{
        if(Parser.isValidJSON(JSONstr) == true)
            console.log( Parser.ParseObject(JSONstr));
        else {
            throw new Error("JSON is not valid JSON!");
        }
    }
    catch (ValueError) {
        console.log(ValueError.message);
    }
}


let json1 = '{"name":"John", "age":30, "city":"New York","array":"arr"}';
console.log(Parser.ParseObject(json1),"\n");
ValidateAndParse(json1);

console.log("--------------------------------------------");
let json2 = '{"json":{"value":39,"key":123}, "name":"Andrei"}'
console.log(Parser.ParseObject(json2),"\n");
ValidateAndParse(json2);

console.log("--------------------------------------------");
let json3 = "{\"array\":\"IVA\",\"json\":{\"name\":\"John\", \"age\":30, \"address\":{\"city\":\"New York\",\"country\":\"USA\"}},\"name\":\"John\", \"age\":30,\"address\":{\"city\":\"New York\", \"country\":\"USA\"}}";
console.log(Parser.ParseObject(json3),"\n");
ValidateAndParse(json3);

console.log("--------------------------------------------");
let obj1 = {
    name: "John",
    age: 30,
    isActive: true,
    address: { city: "New York", country: "USA" },
    undefinedField: undefined,
    nullValue: null
};
let JSONobj1
console.log(JSONobj1 = stringify(obj1));
ValidateAndParse(JSONobj1);

