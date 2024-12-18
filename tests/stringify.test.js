let stringify = require("../stringify.js")

test('test stringify simple object',() =>{
    let obj = new Object();
    obj["key"] = "value";
    obj["data"] = 12;

    let json = JSON.stringify(obj);

    expect(stringify(obj)).toStrictEqual(json);
})

test('test stringify empty object',() =>{
    let obj = new Object();

    let json = JSON.stringify(obj);

    expect(stringify(obj)).toStrictEqual(json);
})

test('test stringify object with array',() =>{
    let obj = new Object();
    obj["array"] = [1,2,3,4];

    let json = JSON.stringify(obj);

    expect(stringify(obj)).toStrictEqual(json);
})

test('test stringify object with nested object',() =>{
    let obj = new Object();
    obj["object"] = {"nested_key":"nested_value", "data":13};

    let json = JSON.stringify(obj);

    expect(stringify(obj)).toStrictEqual(json);
})

test('test stringify object with nested objects and arrays',() =>{
    let obj = new Object();
    obj["object"] = {"nested_key":"nested_value","array":[1,2,3,4,5,{"super_key":"super_value"}] ,"data":13,"name":"IVAN"};

    let json = JSON.stringify(obj);

    expect(stringify(obj)).toStrictEqual(json);
})

test('test stringify array',() =>{
    let obj = [1,2,3,4,5];

    let json = JSON.stringify(obj);

    expect(stringify(obj)).toStrictEqual(json);
})

test('test stringify obj with function',() =>{
    let obj = new Object();
    obj["function"] = () => 1;

    let json = JSON.stringify(obj);

    expect(stringify(obj)).toStrictEqual(json);
})

test('test stringify obj with undefined value',() =>{
    let obj = new Object();
    obj["function"] = undefined;

    let json = JSON.stringify(obj);

    expect(stringify(obj)).toStrictEqual(json);
})

test('test stringify obj with null value',() =>{
    let obj = new Object();
    obj["function"] = null;

    let json = JSON.stringify(obj);

    expect(stringify(obj)).toStrictEqual(json);
})

test('',() =>{
    let obj = {
        name: "John",
        age: 30,
        isActive: true,
        array: [1,2,3,2,3,4, {"key":"value"},[123,2,1,2]],
        address: { city: "New York", country: "USA" },
        undefinedField: undefined,
        nullValue: null
    };
    let json = JSON.stringify(obj);

    expect(stringify(obj)).toStrictEqual(json);
})

test('test stringify with replacer function', () => {
    const obj = {
        key: 'value',
        ignoredKey: 'ignored'
    };

    const replacer = (key, value) => {
        if (key === 'ignoredKey') {
            return undefined;
        }
        return value;
    };

    const json = JSON.stringify(obj, replacer);

    expect(stringify(obj, replacer)).toStrictEqual(json);
});

test('test stringify with replacer array', () => {
    const obj = {
        key: 'value',
        ignoredKey: 'ignored'
    };

    const replacer = ['key'];

    const json = JSON.stringify(obj, replacer);

    expect(stringify(obj, replacer)).toStrictEqual(json);
});

test('test stringify with space parameter', () => {
    const obj = {
        key1: 'value1',
        key2: 'value2'
    };

    const json = JSON.stringify(obj, null, 2);

    expect(stringify(obj, null, 2)).toStrictEqual(json);
});

test('test stringify with replacer function and space', () => {
    const obj = {
        key1: 'value1',
        key2: 'value2',
        ignoredKey: 'ignored'
    };

    const replacer = (key, value) => {
        if (key === 'ignoredKey') {
            return undefined;
        }
        return value;
    };

    const json = JSON.stringify(obj, replacer);

    expect(stringify(obj, replacer)).toStrictEqual(json);
});

test('test stringify with array and space', () => {
    const arr = ['value1', 'value2', null, 42];

    const json = JSON.stringify(arr, null, 2);

    expect(stringify(arr, null, 2)).toStrictEqual(json);
});

test('test stringify with space parameter', () => {
    const obj = {
        key1: 'value1',
        key2: 'value2'
    };

    const json = JSON.stringify(obj, null, 122);

    expect(stringify(obj, null, 122)).toStrictEqual(json);
});

test('test stringify with space parameter as \'\n\'', () => {
    const obj = {
        key1: 'value1',
        key2: 'value2'
    };

    const json = JSON.stringify(obj, null, '\n\n');

    expect(stringify(obj, null, '\n\n')).toStrictEqual(json);
});
