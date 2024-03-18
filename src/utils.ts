/**
 *  Wrap a bearing to 0-360 degrees
 */
export const bearingWrap = (bearing: number) => {
  return bearing < 0 ? 360 + bearing : bearing;
};

/**
 * Calculate the offset between two bearings
 */
export const bearingOffset = (bearingOne: number, bearingTwo: number) => {
  const offset = bearingWrap(bearingTwo) - bearingWrap(bearingOne);
  return offset < 0 ? 360 + offset : offset;
};
