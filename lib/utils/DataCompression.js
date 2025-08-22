/**
 * Data Compression Utilities
 * Optimizes repetitive data patterns in tiling definitions
 */

/**
 * Run-length encode boolean arrays
 * [false, false, true, true, false] -> "2F2T1F"
 */
export function compressBooleanArray(arr) {
    if (!arr || arr.length === 0) return '';
    
    let result = '';
    let current = arr[0];
    let count = 1;
    
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] === current) {
            count++;
        } else {
            result += count + (current ? 'T' : 'F');
            current = arr[i];
            count = 1;
        }
    }
    result += count + (current ? 'T' : 'F');
    return result;
}

/**
 * Decode run-length encoded boolean arrays
 */
export function decompressBooleanArray(encoded) {
    if (!encoded) return [];
    
    const result = [];
    const matches = encoded.match(/(\d+)([TF])/g);
    
    for (const match of matches) {
        const count = parseInt(match.slice(0, -1));
        const value = match.slice(-1) === 'T';
        for (let i = 0; i < count; i++) {
            result.push(value);
        }
    }
    return result;
}

/**
 * Compress numeric arrays with repeated values
 * [0, 0, 0, 1, 1, 2] -> {r: [[3,0], [2,1], [1,2]]}
 */
export function compressNumericArray(arr) {
    if (!arr || arr.length === 0) return { r: [] };
    
    const runs = [];
    let current = arr[0];
    let count = 1;
    
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] === current) {
            count++;
        } else {
            runs.push([count, current]);
            current = arr[i];
            count = 1;
        }
    }
    runs.push([count, current]);
    
    // Return original if compression doesn't help
    return runs.length < arr.length ? { r: runs } : arr;
}

/**
 * Decompress numeric arrays
 */
export function decompressNumericArray(data) {
    if (!data || !data.r) return data;
    
    const result = [];
    for (const [count, value] of data.r) {
        for (let i = 0; i < count; i++) {
            result.push(value);
        }
    }
    return result;
}

export default {
    compressBooleanArray,
    decompressBooleanArray,
    compressNumericArray,
    decompressNumericArray
};
