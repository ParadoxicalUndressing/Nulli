
export const MathHelpers = {
    isCloseTo(x1, x2, y1, y2, tolerance = 0.1) {
        return Math.abs(x1 - x2) < tolerance && Math.abs(y1 - y2) < tolerance;
    }
}