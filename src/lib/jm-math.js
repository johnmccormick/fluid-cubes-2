export function toRadians(degrees) {
    var radians = degrees * (Math.PI / 180)
    return radians;
}

export function map_range(value, lowIn, highIn, lowOut, highOut) {
    return lowOut + (highOut - lowOut) * (value - lowIn) / (highIn - lowIn);
}