const isValidJSON = require('../isValidJson');

test('test on simple valid JSON', () => {
    let json = '{"key":12}';

    expect(isValidJSON(json)).toBe(true);
});

test('test on JSON with array', () =>{
    let json = '{"array":[1,2,3,4],"name":"John", "age":30, "city":"New York"}';

    expect(isValidJSON(json)).toBe(true);
})

test('test on JSON with nested object', () =>{
    let json = '{"json":{"value":39,"key":123}, "name":"Andrei"}'

    expect(isValidJSON(json)).toBe(true);
})

test('test on JSON with nested objects and arrays', () =>{
    let json = '{"array":[1,2,3,4,12,2,[1,2,3,{"json":{"value":39,"key":123}, "name":"Andrei"}],4],"json":{"name":"John", "age":30, "address":{"city":"New York","country":"USA"}},"name":"John", "age":30,"address":{"city":"New York", "country":"USA"}}';

    expect(isValidJSON(json)).toBe(true);
})

test('test on empty JSON', () =>{
    let json = '{}'

    expect(isValidJSON(json)).toBe(true);
})

test('test on JSON with missed closing parentheses while nesting', () =>{
    let json = '{"json":{"value":39,"key":123, "name":"Andrei"}'

    expect(isValidJSON(json)).toBe(false);
})

test('test on JSON with missed closing parentheses in array', () =>{
    let json = '{"array":[1,2,3,4,5, "key":"value"}'

    expect(isValidJSON(json)).toBe(false);
})

test('test on JSON with missed " symbol in key', () =>{
    let json = '{"array":[1,2,3,4,5], key":"value"}'

    expect(isValidJSON(json)).toBe(false);
})
