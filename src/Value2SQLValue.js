export const Value2SQLValue = new Map();

const DateTimeConverter = value => {
  var d = new Date(value);
  return `'${d.toISOString()}'`;
};

Value2SQLValue.set("Date", DateTimeConverter)
  .set("DateTime", DateTimeConverter)
  .set("Time", DateTimeConverter);

Value2SQLValue.set("Number", value => value);

Value2SQLValue.set("String", value => `'${value}'`);

Value2SQLValue.set("Boolean", value => (value ? 1 : 0));
