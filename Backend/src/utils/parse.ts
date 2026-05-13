export const parseId = (value: string) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

export const parseOptionalId = (value: unknown) => {
  if (typeof value !== 'string' || value.length === 0) {
    return undefined;
  }
  return parseId(value);
};