const isValidJSON = (input) => {
    if (typeof input !== "string" || input.trim() === "") return false;

    input = input.trim();
    const stack = [];
    let inString = false;
    let escaped = false;

    for (let i = 0; i < input.length; i++) {
        const char = input[i];

        if (escaped) {
            if (!['"', "\\", "/", "b", "f", "n", "r", "t", "u"].includes(char)) return false;
            escaped = false;
            continue;
        }

        if (char === "\\") {
            escaped = true;
            continue;
        }

        if (char === '"') {
            inString = !inString;
            if (!inString && stack[stack.length - 1] === '"') stack.pop();
            else stack.push('"');
            continue;
        }

        if (inString) continue;

        if (char === "{" || char === "[") {
            stack.push(char);
            continue;
        }

        if (char === "}" || char === "]") {
            const last = stack.pop();
            if ((char === "}" && last !== "{") || (char === "]" && last !== "[")) return false;
            continue;
        }

        if (char === ":") {
            if (stack[stack.length - 1] !== "{") return false;
            continue;
        }

        if (char === ",") {
            const last = stack[stack.length - 1];
            if (last !== "{" && last !== "[") return false;
            continue;
        }
    }

    return stack.length === 0 && !inString && !escaped;
};

module.exports = isValidJSON;