const stringifyObject = (obj, replacer = null, space = 0) => {
    if (obj === null) return 'null';

    if (typeof obj === 'string') {
        return `"${obj.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
    }

    if (typeof obj === 'number' || typeof obj === 'boolean') {
        return String(obj);
    }

    if (Array.isArray(obj)) {
        const values = obj.map((item) => {
            if (item === undefined || typeof item === 'function' || typeof item === 'symbol') return 'null';
            return stringifyObject(item, replacer, space);
        });

        if (typeof space === 'number' && space > 0) {
            const indent = ' '.repeat(Math.min(space, 10));
            return `[\n${values.map(item => `${indent}${item}`).join(`,\n`)}\n]`;
        }

        if (typeof space === 'string') {
            const indent = space.length > 10 ? space.slice(0, 10) : space; 
            return `[\n${values.map(item => `${indent}${item}`).join(`,\n`)}\n]`;
        }

        return `[${values.join(',')}]`;
    }

    if (typeof obj === 'object') {
        const keys = Object.keys(obj);

        if (replacer) {
            if (typeof replacer === 'function') {
                keys.forEach((key) => {
                    const newValue = replacer(key, obj[key]);
                    if (newValue === undefined || typeof newValue === 'function' || typeof newValue === 'symbol') {
                        delete obj[key];
                    } else {
                        obj[key] = newValue;
                    }
                });
            } else if (Array.isArray(replacer)) {
                keys.forEach((key) => {
                    if (!replacer.includes(key)) {
                        delete obj[key];
                    }
                });
            }
        }

        const keyValuePairs = keys.map((key) => {
            const value = obj[key];
            if (value === undefined || typeof value === 'function' || typeof value === 'symbol') return null;

            const spaceAfterColon = (typeof space === 'number' && space > 0) || (typeof space === 'string' && space.length > 0) ? ' ' : '';
            return `${stringifyObject(key, replacer, space)}:${spaceAfterColon}${stringifyObject(value, replacer, space)}`;
        }).filter(pair => pair !== null);

        if (typeof space === 'number' && space > 0) {
            const indent = ' '.repeat(Math.min(space, 10));
            return `{\n${keyValuePairs.map(pair => `${indent}${pair}`).join(`,\n`)}\n}`;
        }

        if (typeof space === 'string') {
            const indent = space.length > 10 ? space.slice(0, 10) : space;
            return `{\n${keyValuePairs.map(pair => `${indent}${pair}`).join(`,\n`)}\n}`;
        }

        return `{${keyValuePairs.join(',')}}`;
    }

    throw new Error('Unsupported type');
};


module.exports = stringifyObject;