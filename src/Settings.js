export const operatorTypes = new Map();
operatorTypes
  .set("Number", [
    { Label: "<", TranslateTo: " < " },
    { Label: "<=", TranslateTo: " <= " },
    { Label: "=", TranslateTo: " = " },
    { Label: ">", TranslateTo: " > " },
    { Label: ">=", TranslateTo: " >= " }
  ])
  .set("DateTime", [
    { Label: "<", TranslateTo: " < " },
    { Label: "<=", TranslateTo: " <= " },
    { Label: "=", TranslateTo: " = " },
    { Label: ">", TranslateTo: " > " },
    { Label: ">=", TranslateTo: " >= " }
  ])
  .set("Date", [
    { Label: "<", TranslateTo: " < " },
    { Label: "<=", TranslateTo: " <= " },
    { Label: "=", TranslateTo: " = " },
    { Label: ">", TranslateTo: " > " },
    { Label: ">=", TranslateTo: " >= " }
  ])
  .set("String", [
    { Label: "Like", TranslateTo: " Like " },
    { Label: "Not Like", TranslateTo: " Not Like " },
    { Label: "=", TranslateTo: " = " },
    { Label: "!=", TranslateTo: " != " }
  ])
  .set("Boolean", [
    { Label: "=", TranslateTo: " = " },
    { Label: "!=", TranslateTo: " != " }
  ]);

export const operandTypes = new Map();
operandTypes
  .set("AND", { Label: "AND", TranslateTo: " AND " })
  .set("OR", { Label: "OR", TranslateTo: " OR " });
