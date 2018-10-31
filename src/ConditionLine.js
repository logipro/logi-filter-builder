import React from "react";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { operatorTypes } from "./Settings";
import ValueInput from "./ValueInput";

function ConditionLine(props) {
  var { classes, condition, index, handleChange, columns } = props;
  return (
    <React.Fragment>
      <FormControl className={classes.formControl}>
        <Select
          error={!(condition.column && condition.column.Header)}
          native
          value={
            condition.column && condition.column.Header
              ? condition.column.Header
              : "None"
          }
          onChange={e =>
            handleChange(condition, index, e.target.value, "column")
          }
          inputProps={{
            name: "column",
            id: "column-select"
          }}
        >
          <option value="None" key={"empty"}>
            None
          </option>
          {columns
            .filter(c => c.show === undefined || c.show === true)
            .map(c => (
              <option value={c.Header} key={c.accessor}>
                {c.Header}
              </option>
            ))}
        </Select>
      </FormControl>
      {condition.column ? (
        <FormControl className={classes.formControl}>
          <Select
            error={!(condition.operator && condition.operator.Label)}
            value={
              condition.operator && condition.operator.Label
                ? condition.operator.Label
                : "None"
            }
            onChange={e =>
              handleChange(condition, index, e.target.value, "operator")
            }
            inputProps={{
              name: "operator",
              id: "operator-select"
            }}
            native
          >
            <option value={"None"}>None</option>
            {condition.column && condition.column.dataType
              ? operatorTypes.get(condition.column.dataType).map(opt => (
                  <option value={opt.Label} key={opt.Label}>
                    {opt.Label}
                  </option>
                ))
              : null}
          </Select>
        </FormControl>
      ) : null}
      {condition.operator && condition.column.dataType ? (
        <ValueInput
          classes={classes}
          conditionColumn={condition}
          conditionColumnIndex={index}
          dataType={condition.column.dataType}
          handleChange={(
            selectedColumn,
            index,
            value,
            changeType,
            translateValue
          ) =>
            handleChange(
              selectedColumn,
              index,
              value,
              changeType,
              translateValue
            )
          }
        />
      ) : null}
    </React.Fragment>
  );
}

export default ConditionLine;
