const ParseObject = (json, reviver = (key, value) => value, parentContext = null) => {
    const applyReviver = (key, value) => {
        if (key !== undefined) {
            return reviver(key, value);
        }
        else
            return reviver("",value)
        return value;
    };

    const parseArray = (str, parentContext) => {
        const values = [];
        let buffer = "";
        let inString = false;
        let nestingLevel = 0;

        for (let i = 1; i < str.length - 1; i++) {
            const char = str[i];

            if (char === '"' && str[i - 1] !== "\\") {
                inString = !inString;
            }

            if (inString) {
                buffer += char;
                continue;
            }

            if (char === "[" || char === "{") {
                nestingLevel++;
            }

            if (char === "]" || char === "}") {
                nestingLevel--;
            }

            if (char === "," && nestingLevel === 0) {
                values.push(parseValue(buffer.trim(), { parent: parentContext, key: values.length, type: "array" }));
                buffer = "";
                continue;
            }

            buffer += char;
        }

        if (buffer.trim().length > 0) {
            values.push(parseValue(buffer.trim(), { parent: parentContext, key: values.length, type: "array" }));
        }

        return applyReviver(parentContext?.key, values);
    };

    const parseValue = (str, parentContext) => {
        str = str.trim();

        if (str === "NaN") {
            return applyReviver(parentContext?.key, NaN);
        }

        if (str.startsWith('"') && str.endsWith('"')) {
            return applyReviver(parentContext?.key, str.slice(1, -1));
        }

        if (!isNaN(str)) {
            const num = parseFloat(str);
            return applyReviver(parentContext?.key, isNaN(num) ? "NaN" : num);
        }

        if (str === "true" || str === "false") {
            return applyReviver(parentContext?.key, str === "true");
        }

        if (str === "null") {
            return applyReviver(parentContext?.key, null);
        }

        if (str.startsWith("{") && str.endsWith("}")) {
            return ParseObject(str, reviver, { parent: parentContext, type: "object", key: parentContext?.key });
        }

        if (str.startsWith("[") && str.endsWith("]")) {
            return parseArray(str, { parent: parentContext, type: "array", key: parentContext?.key });
        }

        throw new Error(`Unknown value format: ${str}`);
    };

    if (json.startsWith("[") && json.endsWith("]")) {
        return parseArray(json,null);
    }

    const tokens = {};
    let currentKey = null;
    let buffer = "";
    let inString = false;
    let nestingLevel = 0;

    for (let i = 0; i < json.length; i++) {
        const char = json[i];

        if (char === '"' && json[i - 1] !== "\\") {
            inString = !inString;
        }

        if (inString) {
            buffer += char;
            continue;
        }

        if (char === "{") {
            if (nestingLevel > 0) {
                buffer += char;
            }
            nestingLevel++;
            continue;
        }

        if (char === "}") {
            nestingLevel--;
            if (nestingLevel === 0) {
                if (currentKey !== null) {
                    tokens[currentKey] = parseValue(buffer.trim(), { parent: tokens, key: currentKey, type: "object" });
                    currentKey = null;
                    buffer = "";
                }
            } else {
                buffer += char;
            }
            continue;
        }

        if (char === "[") {
            if (nestingLevel > 0) {
                buffer += char;
            }
            nestingLevel++;
            continue;
        }

        if (char === "]") {
            nestingLevel--;
            if (nestingLevel === 0) {
                if (currentKey !== null) {
                    tokens[currentKey] = parseArray(buffer.trim(), { parent: tokens, key: currentKey });
                    currentKey = null;
                    buffer = "";
                }
            } else {
                buffer += char;
            }
            continue;
        }

        if (char === ":") {
            if (nestingLevel === 1 && currentKey === null) {
                currentKey = buffer.trim().slice(1, -1);
                buffer = "";
                continue;
            }
        }

        if (char === "," && nestingLevel === 1) {
            tokens[currentKey] = parseValue(buffer.trim(), { parent: tokens, key: currentKey, type: "object" });
            currentKey = null;
            buffer = "";
            continue;
        }

        buffer += char;
    }

    return applyReviver(parentContext?.key, tokens);
};

module.exports = ParseObject;