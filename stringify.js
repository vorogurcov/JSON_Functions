const stringifyObject = (obj) => {

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
            return stringifyObject(item);
        });
        return `[${values.join(',')}]`;
    }

    if (typeof obj === 'object') {
        const keys = Object.keys(obj);
        const keyValuePairs = keys.map((key) => {
            const value = obj[key];
            if (value === undefined || typeof value === 'function' || typeof value === 'symbol') return null;
            return `${stringifyObject(key)}:${stringifyObject(value)}`;
        }).filter(pair => pair !== null);

        return `{${keyValuePairs.join(',')}}`;
    }

    throw new Error('Unsupported type');
};

module.exports = stringifyObject;