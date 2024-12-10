let Parse = require("./Parse.js");
let stringify = require("./stringify.js");

let json = '{"name":"John", "age":30, "city":"New York"}'
let json2 = ' {"array":"IVA","json":{"name":"John", "age":30, "address":{"city":"New York", "country":"USA"}},"name":"John", "age":30, "address":{"city":"New York", "country":"USA"}}'

console.log(Parse(json2));