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

test('test on json that is actually array with other objects in it with custom receiver',() =>{
    let json = '[1,2,{"key":12,"value":"val"},3,4]';
    const receiver = (key,value,context)=>{
        if (context.type === "string") {
            return value.toUpperCase();
        }
        return value;
    }

    let obj = JSON.parse(json,receiver);

    expect(ParseObject(json,receiver)).toStrictEqual(obj);
})

test('test on json with nested objects and arrays with custom receiver',() =>{
    let json = '{"array":[1,2,3,4,12,2,[1,2,3,{"json":{"value":39,"key":123}, "name":"Andrei"}],4],' +
        '"json":{"name":"John", "age":30, "address":{"city":"New York","country":"USA"}},' +
        '"name":"John", "age":30,"address":{"city":"New York", "country":"USA"}}';
    const receiver = (key,value,context)=>{
        if (context.type === "string") {
            return value.toUpperCase();
        }
        else if(context.type ==="number")
            return value * 3;
        return value;
    }

    let obj = JSON.parse(json,receiver);

    expect(ParseObject(json,receiver)).toStrictEqual(obj);
})

test('test on json with nested object and custom receiver',() =>{
    let json = '{"nested_obj":{"key":"value","key2":123}}';
    const receiver = (key,value)=>{
        if (key === "nested_obj") {
            return {"another_objee":"hehe"};
        }
        return value;
    }

    let obj = JSON.parse(json,receiver);

    expect(ParseObject(json,receiver)).toStrictEqual(obj);
})