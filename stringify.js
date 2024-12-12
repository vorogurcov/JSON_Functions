const stringifyObject = (obj) => {

    if (obj === null) return 'null';

    if (typeof obj === 'string') {
        return `"${obj.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
    }

    if (typeof obj === 'number' || typeof obj === 'boolean') {
        return String(obj);
    }

    if (typeof obj === 'object') {
        const keys = Object.keys(obj);
        const keyValuePairs = keys.map((key) => {

            if (obj[key] === undefined) return null;
            return `${stringifyObject(key)}:${stringifyObject(obj[key])}`;
        }).filter(pair => pair !== null);

        return `{${keyValuePairs.join(',')}}`;
    }


    throw new Error('Unsupported type');
};

module.exports = stringifyObject;