const ParseObject = (json, receiver = (key, value, context) => value) => {
    const applyReceiver = (key, value, context = {}) => receiver(key, value, context);
    const parseArray = (str, context) => {
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
                values.push(parseValue(buffer.trim(), values));
                buffer = "";
                continue;
            }

            buffer += char;
        }

        if (buffer.trim().length > 0) {
            values.push(parseValue(buffer.trim(), values));
        }

        return values.map((value, index) => applyReceiver(index, value, context));
    };

    const parseValue = (str, context) => {
        str = str.trim();

        if (str === "NaN") {
            return NaN;
        }

        if (str.startsWith('"') && str.endsWith('"')) {
            return str.slice(1, -1);
        }

        if (!isNaN(str)) {
            const num = parseFloat(str);
            return isNaN(num) ? 'NaN' : num;
        }

        if (str === "true") return true;
        if (str === "false") return false;

        if (str === "null") return null;

        if (str.startsWith("{") && str.endsWith("}")) return ParseObject(str, receiver);

        if (str.startsWith("[") && str.endsWith("]")) return parseArray(str, context);

        throw new Error(`Неизвестный формат значения: ${str}`);
    };

    if (json.startsWith("[") && json.endsWith("]")) {
        return parseArray(json);
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
                    tokens[currentKey] = applyReceiver(currentKey, parseValue(buffer, tokens), tokens);
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
                    tokens[currentKey] = applyReceiver(currentKey, parseArray(buffer, tokens), tokens);
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
            tokens[currentKey] = applyReceiver(currentKey, parseValue(buffer, tokens), tokens);
            currentKey = null;
            buffer = "";
            continue;
        }

        buffer += char;
    }

    return tokens;
};




module.exports = ParseObject;