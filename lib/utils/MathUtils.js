/**
 * Mathematical Utility Functions
 * Shared math operations used across the tactile.js library
 */

/**
 * Matrix multiplication function
 * Handles both Matrix * Point and Matrix * Matrix operations
 * 
 * @param {Array|Object} A - First matrix (6-element array) or point object
 * @param {Array|Object} B - Second matrix (6-element array) or point object  
 * @returns {Array|Object} Result matrix array or point object
 */
export function mul(A, B) {
    if (B.hasOwnProperty('x')) {
        // Matrix * Point
        return { 
            x: A[0]*B.x + A[1]*B.y + A[2],
            y: A[3]*B.x + A[4]*B.y + A[5] 
        };
    } else {
        // Matrix * Matrix
        return [
            A[0]*B[0] + A[1]*B[3], 
            A[0]*B[1] + A[1]*B[4],
            A[0]*B[2] + A[1]*B[5] + A[2],
            A[3]*B[0] + A[4]*B[3], 
            A[3]*B[1] + A[4]*B[4],
            A[3]*B[2] + A[4]*B[5] + A[5]
        ];
    }
}

/**
 * Create a simple point object
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate  
 * @returns {Object} Point object with x,y properties
 */
export function createPoint(x, y) {
    return { x, y };
}

/**
 * Create a simple transformation matrix
 * @param {number} a - Matrix element [0]
 * @param {number} b - Matrix element [1]  
 * @param {number} c - Matrix element [2]
 * @param {number} d - Matrix element [3]
 * @param {number} e - Matrix element [4]
 * @param {number} f - Matrix element [5]
 * @returns {Array} 6-element transformation matrix
 */
export function createMatrix(a, b, c, d, e, f) {
    return [a, b, c, d, e, f];
}

/**
 * Match segment transformation
 * Creates a transformation matrix to match segment p-q
 * @param {Object} p - Start point with x,y properties
 * @param {Object} q - End point with x,y properties  
 * @returns {Array} 6-element transformation matrix
 */
export function matchSeg(p, q) {
    return [q.x-p.x, p.y-q.y, p.x, q.y-p.y, q.x-p.x, p.y];
}

export default { mul, createPoint, createMatrix, matchSeg };