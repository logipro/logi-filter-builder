import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Accordion from "@material-ui/core/Accordion";
import AccordionActions from "@material-ui/core/AccordionActions";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { MuiPickersUtilsProvider } from "material-ui-pickers";
import DateFnsUtils from "@date-io/date-fns";
import ConditionLine from "./ConditionLine";
import { operandTypes, operatorTypes } from "./Settings";

const styles = (theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column",
  },
  conditionSection: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    // margin: theme.spacing(0.5),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
});

const getDefaultSimpleCondition = () => ({
  type: "Simple",
  column: undefined,
  operator: undefined,
  value: undefined,
  operand: operandTypes.get("AND"),
});

function LogiFilterBuilder(props) {
  const {
    classes,
    columns,
    preLoadConditions,
    startExpanded,
    header,
    onChange,
    getFilterStatement,
    isNested,
  } = props;

  const [conditions, setConditions] = useState(
    preLoadConditions
      ? preLoadConditions
      : [getDefaultSimpleCondition()]
  );
  const [error, setError] = useState(false);
  const [filterStatement, setFilterStatement] = useState("");

  const validate = useCallback((conds) => {
    let isValid = true;
    let filter = "";
    conds.forEach((c, idx) => {
      if (c.type === "Simple") {
        const valid =
          c.column &&
          c.column.accessor &&
          c.operator &&
          c.operator.TranslateTo &&
          c.value &&
          c.value.translateValue !== undefined &&
          c.value.value !== undefined &&
          c.value.value !== "";
        isValid = isValid && valid;
        if (valid) {
          filter += `${c.column.accessor} ${c.operator.TranslateTo} ${
            c.value.translateValue
          }${
            idx + 1 < conds.length ? " " + c.operand.TranslateTo : ""
          }`;
        }
      } else if (c.type === "Nested") {
        const nested = validate(c.conditions);
        isValid = isValid && nested.isValid;
        filter += ` ( ${nested.filter} ) ${
          idx + 1 < conds.length ? c.operand.TranslateTo : ""
        }`;
      }
    });
    return { isValid, filter };
  }, []);

  const validateAndCreate = useCallback(
    (newConds) => {
      const { isValid, filter } = validate(newConds);
      setError(!isValid);
      setConditions(newConds);
      setFilterStatement(filter);
      if (onChange) onChange(newConds);
    },
    [validate, onChange]
  );

  const handleChange = useCallback(
    (selectedColumn, idx, value, changeType, translateValue = null) => {
      const newConds = [...conditions];
      let condition = { ...selectedColumn };
      if (changeType === "column") {
        condition.column = columns.find((c) => c.header === value);
        condition.operator = undefined;
        condition.value = undefined;
      } else if (changeType === "operator") {
        condition.operator = operatorTypes
          .get(condition.column.dataType)
          .find((opt) => opt.Label === value);
        condition.value = undefined;
      } else if (changeType === "value") {
        condition.value = { value, translateValue };
      } else if (changeType === "operand") {
        condition.operand = operandTypes.get(value);
      }
      newConds[idx] = condition;
      validateAndCreate(newConds);
    },
    [columns, conditions, validateAndCreate]
  );

  const addNewCondition = useCallback(() => {
    validateAndCreate([...conditions, getDefaultSimpleCondition()]);
  }, [conditions, validateAndCreate]);

  const addNewNestedCondition = useCallback(() => {
    validateAndCreate([
      ...conditions,
      {
        type: "Nested",
        conditions: [getDefaultSimpleCondition()],
        operand: operandTypes.get("AND"),
      },
    ]);
  }, [conditions, validateAndCreate]);

  const removeCondition = useCallback(
    (idx) => {
      let newConds = [...conditions];
      newConds.splice(idx, 1);
      if (newConds.length === 0) {
        newConds = [getDefaultSimpleCondition()];
      }
      validateAndCreate(newConds);
    },
    [conditions, validateAndCreate]
  );

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Accordion defaultExpanded={startExpanded}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>
            {error
              ? "Please fix errors"
              : filterStatement
              ? filterStatement
              : header
              ? header
              : "Create Filter"}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className={classes.root}>
            {conditions.map((condition, idx) => (
              <section key={idx} className={classes.conditionSection}>
                {condition.type === "Simple" ? (
                  <>
                    <ConditionLine
                      key={idx}
                      classes={classes}
                      condition={condition}
                      index={idx}
                      handleChange={handleChange}
                      columns={columns}
                    />
                    {condition.operator && idx + 1 < conditions.length && (
                      <FormControl className={classes.formControl}>
                        <Select
                          value={condition.operand.Label}
                          onChange={(e) =>
                            handleChange(
                              condition,
                              idx,
                              e.target.value,
                              "operand"
                            )
                          }
                          inputProps={{
                            name: "operand",
                            id: "operand-select",
                          }}
                          native
                        >
                          {Array.from(operandTypes.values()).map((operand) => (
                            <option value={operand.Label} key={operand.Label}>
                              {operand.Label}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  </>
                ) : (
                  <>
                    <LogiFilterBuilder
                      columns={columns}
                      classes={classes}
                      preLoadConditions={condition.conditions}
                      onChange={(newInnerConds) => {
                        const newConds = [...conditions];
                        newConds[idx].conditions = newInnerConds;
                        validateAndCreate(newConds);
                      }}
                      isNested={true}
                      header={"Nested Condition"}
                    />
                    {idx + 1 < conditions.length && (
                      <FormControl className={classes.formControl}>
                        <Select
                          value={condition.operand.Label}
                          onChange={(e) =>
                            handleChange(
                              condition,
                              idx,
                              e.target.value,
                              "operand"
                            )
                          }
                          inputProps={{
                            name: "operand",
                            id: "operand-select",
                          }}
                          native
                        >
                          {Array.from(operandTypes.values()).map((operand) => (
                            <option value={operand.Label} key={operand.Label}>
                              {operand.Label}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  </>
                )}

                <Button
                  variant="outlined"
                  aria-label="Remove"
                  className={classes.button}
                  onClick={() => removeCondition(idx)}
                >
                  {"-"}
                </Button>
              </section>
            ))}
          </div>
        </AccordionDetails>
        <Divider />
        <AccordionActions>
          <Button
            variant="outlined"
            aria-label="AddNested"
            className={classes.button}
            onClick={addNewNestedCondition}
          >
            {"+()"}
          </Button>
          <Button
            variant="outlined"
            aria-label="Add"
            className={classes.button}
            onClick={addNewCondition}
          >
            {"+"}
          </Button>
          {!isNested && (
            <Button
              disabled={error}
              variant="outlined"
              onClick={() => getFilterStatement && getFilterStatement(filterStatement)}
              size="small"
              color="primary"
            >
              Apply
            </Button>
          )}
        </AccordionActions>
      </Accordion>
    </MuiPickersUtilsProvider>
  );
}

LogiFilterBuilder.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
      dataType: PropTypes.oneOf([
        "String",
        "Number",
        "Date",
        "DateTime",
        "Time",
        "Boolean",
      ]),
      isHidden: PropTypes.bool,
    })
  ).isRequired,
  header: PropTypes.string,
  getFilterStatement: PropTypes.func,
  startExpanded: PropTypes.bool,
  isNested: PropTypes.bool,
  preLoadConditions: PropTypes.array,
  onChange: PropTypes.func,
  classes: PropTypes.object,
};

LogiFilterBuilder.defaultProps = {
  startExpanded: false,
  isNested: false,
};

// Export with styles
export default withStyles(styles, { withTheme: true })(LogiFilterBuilder);
