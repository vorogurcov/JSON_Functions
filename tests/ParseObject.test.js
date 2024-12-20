let ParseObject = require("../ParseObject.js")

test('test on simple json',() =>{
    let json = '{"key":12}';
    let obj = JSON.parse(json);

    expect(ParseObject(json)).toStrictEqual(obj);
})

test('test on json with array',() =>{
    let json = '{"array":[1,2,3,45,6]}';
    let obj = JSON.parse(json);

    expect(ParseObject(json)).toStrictEqual(obj);
})

test('test on json with nested object',() =>{
    let json = '{"nested_obj":{"key":"value","key2":123}}';
    let obj = JSON.parse(json);

    expect(ParseObject(json)).toStrictEqual(obj);
})

test('test on json with nested objects and arrays',() =>{
    let json = '{"array":[1,2,3,4,12,2,[1,2,3,{"json":{"value":39,"key":123}, "name":"Andrei"}],4],' +
        '"json":{"name":"John", "age":30, "address":{"city":"New York","country":"USA"}},' +
        '"name":"John", "age":30,"address":{"city":"New York", "country":"USA"}}';
    let obj = JSON.parse(json)

    expect(ParseObject(json)).toStrictEqual(obj);
})

test('test on json that is actually array',() =>{
    let json = '[1,2,3,4]';
    let obj = JSON.parse(json);

    expect(ParseObject(json)).toStrictEqual(obj);
})

test('test on json that is actually array with other objects in it',() =>{
    let json = '[1,2,{"key":12,"value":"val"},3,4]';
    let obj = JSON.parse(json);

    expect(ParseObject(json)).toStrictEqual(obj);
})

test('test on json that is actually array with other objects in it with custom reviver',() =>{
    let json = '[1,2,{"key":12,"value":"val"},3,4]';
    const reviver = (key,value)=>{
        if (this.type === "string") {
            return value.toUpperCase();
        }
        return value;
    }

    let obj = JSON.parse(json,reviver);

    expect(ParseObject(json,reviver)).toStrictEqual(obj);
})

test('test on json with nested objects and arrays with custom reviver',() =>{
    let json = '{"array":[1,2,3,4,12,2,[1,2,3,{"json":{"value":39,"key":123}, "name":"Andrei"}],4],' +
        '"json":{"name":"John", "age":30, "address":{"city":"New York","country":"USA"}},' +
        '"name":"John", "age":30,"address":{"city":"New York", "country":"USA"}}';
    const reviver = (key,value)=>{
        if (this.type === "string") {
            return value.toUpperCase();
        }
        else if(this.type ==="number")
            return value * 3;
        return value;
    }

    let obj = JSON.parse(json,reviver);

    expect(ParseObject(json,reviver)).toStrictEqual(obj);
})

test('test on json with nested object and custom reviver',() =>{
    let json = '{"nested_obj":{"key":"value","key2":123}}';
    const reviver = (key,value)=>{
        if (key === "nested_obj") {
            return {"another_objee":"hehe"};
        }
        return value;
    }

    let obj = JSON.parse(json,reviver);

    expect(ParseObject(json,reviver)).toStrictEqual(obj);
})

test('test with nested objects and array that covers parent context',() => {
    let json = '{"array":[1,2,3,4,12,2,[1,2,3,{"json":{"value":39,"key":123}, "name":"Andrei"}],4],' +
        '"json":{"name":"John", "age":30, "address":{"city":"New York","country":"USA"}},' +
        '"name":"John", "age":30,"address":{"city":"New York", "country":"USA"}}';
    let stackParse = [];
    let stack = [];
    const reviver = (key,value)=>{
        stackParse.push(String(key));
        return value;
    }
    JSON.parse(json,reviver);
    stack = stackParse;
    stackParse = [];
    ParseObject(json,reviver);
    
    expect(stack).toStrictEqual(stackParse);
});