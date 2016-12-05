export function castValue(value) {
  if (process.env.TEST_NUMBER_VALUE) {
    return +value;
  }
  return String(value);
}
