export const validatePositiveStock = (value, label = "Quantity") => {
  if (value === undefined || value === null)
    throw new Error(`${label} is required`);
  const num = Number(value);
  if (isNaN(num) || !Number.isInteger(num))
    throw new Error(`${label} must be a whole number`);
  if (num <= 0)
    throw new Error(`${label} must be greater than 0`);
  return num;
};

export const validateNonNegativeStock = (value, label = "Stock") => {
  if (value === undefined || value === null)
    throw new Error(`${label} is required`);
  const num = Number(value);
  if (isNaN(num) || !Number.isInteger(num))
    throw new Error(`${label} must be a whole number`);
  if (num < 0)
    throw new Error(`${label} cannot be negative`);
  return num;
};

export const validateThreshold = (value) => {
  if (value === undefined || value === null)
    throw new Error("Threshold is required");
  const num = Number(value);
  if (isNaN(num) || !Number.isInteger(num))
    throw new Error("Threshold must be a whole number");
  if (num < 1)
    throw new Error("Threshold must be at least 1");
  return num;
};