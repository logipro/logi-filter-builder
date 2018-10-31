import React from "react";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";

function ValueInput(props) {
  var { classes, conditionColumn, conditionColumnIndex, handleChange } = props;

  switch (props.dataType) {
    case "Date":
      return (
        <FormControl className={classes.formControl}>
          <TextField
            id="standard-dense"
            type={"date"}
            className={classes.textField}
            error={!(conditionColumn.value && conditionColumn.value.value)}
            value={
              conditionColumn.value && conditionColumn.value.value
                ? conditionColumn.value.value
                : ""
            }
            onChange={e => {
              var d = new Date(Date.parse(e.target.value));
              var dateString =
                `'` +
                d.getFullYear() +
                "-" +
                ("0" + (d.getMonth() + 1)).slice(-2) +
                "-" +
                ("0" + d.getDate()).slice(-2) +
                " " +
                ("0" + d.getHours()).slice(-2) +
                ":" +
                ("0" + d.getMinutes()).slice(-2) +
                `'`;
              handleChange(
                conditionColumn,
                conditionColumnIndex,
                e.target.value,
                "value",
                dateString
              );
            }}
          />
        </FormControl>
      );
    case "DateTime":
    case "DateTime2":
      return (
        <FormControl className={classes.formControl}>
          <TextField
            id="standard-dense"
            type={"datetime-local"}
            className={classes.textField}
            error={!(conditionColumn.value && conditionColumn.value.value)}
            value={
              conditionColumn.value && conditionColumn.value.value
                ? conditionColumn.value.value
                : ""
            }
            onChange={e => {
              var d = new Date(Date.parse(e.target.value));
              var dateString =
                `'` +
                d.getFullYear() +
                "-" +
                ("0" + (d.getMonth() + 1)).slice(-2) +
                "-" +
                ("0" + d.getDate()).slice(-2) +
                " " +
                ("0" + d.getHours()).slice(-2) +
                ":" +
                ("0" + d.getMinutes()).slice(-2) +
                `'`;
              handleChange(
                conditionColumn,
                conditionColumnIndex,
                e.target.value,
                "value",
                dateString
              );
            }}
          />
        </FormControl>
      );
    case "Number":
      return (
        <FormControl className={classes.formControl}>
          <TextField
            id="standard-dense"
            type={"number"}
            className={classes.textField}
            error={!(conditionColumn.value && conditionColumn.value.value)}
            value={conditionColumn.value ? conditionColumn.value.value : ""}
            onChange={e =>
              handleChange(
                conditionColumn,
                conditionColumnIndex,
                e.target.value,
                "value",
                `'${e.target.value}'`
              )
            }
          />
        </FormControl>
      );
    default:
      return (
        <FormControl className={classes.formControl}>
          <TextField
            id="standard-dense"
            className={classes.textField}
            error={!(conditionColumn.value && conditionColumn.value.value)}
            value={conditionColumn.value ? conditionColumn.value.value : ""}
            onChange={e =>
              handleChange(
                conditionColumn,
                conditionColumnIndex,
                e.target.value,
                "value",
                `'${e.target.value}'`
              )
            }
          />
        </FormControl>
      );
  }
}

export default ValueInput;
