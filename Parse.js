const ParseObject = (json) => {
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

        //TODO: ParseArray

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

        if (char === ":" && nestingLevel === 1) {
            currentKey = buffer.trim().slice(1, -1);
            buffer = "";
            continue;
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

module.exports = ParseObject;