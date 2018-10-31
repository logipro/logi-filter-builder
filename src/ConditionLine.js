import React from "react";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { operatorTypes, operandTypes } from "./Consts";
import ValueInput from "./ValueInput";
import IconButton from "@material-ui/core/IconButton";
import RemoveIcon from "@material-ui/icons/Remove";

function ConditionLine(props) {
  var { classes, cc, index, handleChange, columns } = props;
  return (
    <React.Fragment>
      <FormControl className={classes.formControl}>
        <Select
          error={!(cc.column && cc.column.Header)}
          native
          value={cc.column && cc.column.Header ? cc.column.Header : "None"}
          onChange={e => handleChange(cc, index, e.target.value, "column")}
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
      {cc.column ? (
        <FormControl className={classes.formControl}>
          <Select
            error={!(cc.operator && cc.operator.Label)}
            value={
              cc.operator && cc.operator.Label ? cc.operator.Label : "None"
            }
            onChange={e => handleChange(cc, index, e.target.value, "operator")}
            inputProps={{
              name: "operator",
              id: "operator-select"
            }}
            native
          >
            <option value={"None"}>None</option>
            {cc.column && cc.column.dataType
              ? operatorTypes.get(cc.column.dataType).map(opt => (
                  <option value={opt.Label} key={opt.Label}>
                    {opt.Label}
                  </option>
                ))
              : null}
          </Select>
        </FormControl>
      ) : null}
      {cc.operator && cc.column.dataType ? (
        <ValueInput
          classes={classes}
          conditionColumn={cc}
          conditionColumnIndex={index}
          dataType={cc.column.dataType}
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
