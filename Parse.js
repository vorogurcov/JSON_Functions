const isValidJSON = (input) => {
    if (typeof input !== "string" || input.trim() === "") return false;

    const validateString = (str) => {
        return /^"([^"\\]|\\["/\\bfnrt]|\\u[0-9a-fA-F]{4})*"$/.test(str);
    };

    const validateNumber = (num) => {
        return /^-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?$/.test(num);
    };

    const validateValue = (value) => {
        value = value.trim();
        if (value === "null" || value === "true" || value === "false") return true;
        if (validateString(value)) return true;
        if (validateNumber(value)) return true;
        if (value.startsWith("{") && value.endsWith("}")) return validateObject(value);
        if (value.startsWith("[") && value.endsWith("]")) return validateArray(value);
        return false;
    };

    const validateObject = (obj) => {
        obj = obj.trim().slice(1, -1).trim();
        if (!obj) return true;
        const pairs = obj.split(/,(?![^{}]*})/);
        return pairs.every((pair) => {
            const colonIndex = pair.indexOf(":");
            if (colonIndex === -1) return false;
            const key = pair.slice(0, colonIndex).trim();
            const value = pair.slice(colonIndex + 1).trim();
            return validateString(key) && validateValue(value);
        });
    };

    input = input.trim();
    if (input.startsWith("{") && input.endsWith("}")) return validateObject(input);
    return false;
};

const ParseObject = (json) => {
    const parseArray = (str) => {
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
                values.push(parseValue(buffer.trim()));
                buffer = "";
                continue;
            }

            buffer += char;
        }

        if (buffer.trim().length > 0) {
            values.push(parseValue(buffer.trim()));
        }

        return values;
    };

    const parseValue = (str) => {
        str = str.trim();

        if (str.startsWith('"') && str.endsWith('"')) {
            return str.slice(1, -1);
        }

        if (!isNaN(str)) {
            return parseFloat(str);
        }

        if (str === "true") return true;
        if (str === "false") return false;

        if (str === "null") return null;

        if (str.startsWith("{") && str.endsWith("}")) return ParseObject(str);

        if (str.startsWith("[") && str.endsWith("]")) return parseArray(str);

        throw new Error(`Неизвестный формат значения: ${str}`);
    };

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
                    tokens[currentKey] = parseValue(buffer);
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
                    tokens[currentKey] = parseArray(buffer);
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
            tokens[currentKey] = parseValue(buffer);
            currentKey = null;
            buffer = "";
            continue;
        }

        buffer += char;
    }

    return tokens;
};


module.exports = {ParseObject, isValidJSON};