/**
 * [setAttribute description]
 * @param {[type]} parent [description]
 * @param {[type]} name   [description]
 * @param {[type]} value  [description]
 */
export function setAttribute(parent, name, value) {
    const arr = name.split('.');
    let i = 0;
    for (const len = arr.length - 1; i < len; i++) {
        if (parent[arr[i]] == void 0) {
            parent[arr[i]] = {};
        }
        parent = parent[arr[i]];
    }
    parent[arr[i]] = value;
}

/**
 * [getAttribute description]
 * @param  {[type]} parent [description]
 * @param  {[type]} name   [description]
 * @return {[type]}        [description]
 */
export function getAttribute(parent, name) {
    const arr = name.split(".");
    let i = 0;
    for (const len = arr.length - 1; i < len; i++) {
        if (parent[arr[i]] == void 0) {
            return null;
        }
        parent = parent[arr[i]];
    }
    return parent[arr[i]] || null;
}