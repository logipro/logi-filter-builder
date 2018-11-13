import React from "react";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import { TimePicker } from "material-ui-pickers";
import { DatePicker } from "material-ui-pickers";
import { DateTimePicker } from "material-ui-pickers";
import Checkbox from "@material-ui/core/Checkbox";
import ArrowForward from "@material-ui/icons/ArrowForward";
import ArrowBack from "@material-ui/icons/ArrowBack";
import { Value2SQLValue } from "./Value2SQLValue";

function ValueInput(props) {
  var { classes, conditionColumn, conditionColumnIndex, handleChange } = props;
  const onDateInputChange = date =>
    props.handleChange(
      conditionColumn,
      conditionColumnIndex,
      date,
      "value",
      Value2SQLValue.get(props.dataType)(date)
    );
  switch (props.dataType) {
    case "Date":
      return (
        <FormControl className={classes.formControl}>
          <DatePicker
            error={!(conditionColumn.value && conditionColumn.value.value)}
            autoOk={true}
            value={
              conditionColumn.value && conditionColumn.value.value
                ? conditionColumn.value.value
                : new Date()
            }
            onChange={onDateInputChange}
            rightArrowIcon={<ArrowForward />}
            leftArrowIcon={<ArrowBack />}
          />
        </FormControl>
      );
    case "DateTime":
      return (
        <FormControl className={classes.formControl}>
          <DateTimePicker
            error={!(conditionColumn.value && conditionColumn.value.value)}
            autoOk={true}
            value={
              conditionColumn.value && conditionColumn.value.value
                ? conditionColumn.value.value
                : new Date()
            }
            onChange={onDateInputChange}
            rightArrowIcon={<ArrowForward />}
            leftArrowIcon={<ArrowBack />}
          />
        </FormControl>
      );
    case "Time":
      return (
        <FormControl className={classes.formControl}>
          <TimePicker
            error={!(conditionColumn.value && conditionColumn.value.value)}
            autoOk={true}
            value={
              conditionColumn.value && conditionColumn.value.value
                ? conditionColumn.value.value
                : new Date()
            }
            onChange={onDateInputChange}
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
                Value2SQLValue.get(props.dataType)(e.target.value)
              )
            }
          />
        </FormControl>
      );
    case "Boolean":
      return (
        <FormControl className={classes.formControl}>
          <Checkbox
            onChange={e =>
              handleChange(
                conditionColumn,
                conditionColumnIndex,
                e.target.checked,
                "value",
                Value2SQLValue.get(props.dataType)(e.target.checked)
              )
            }
            checked={conditionColumn.value ? conditionColumn.value.value : ""}
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
                Value2SQLValue.get(props.dataType)(e.target.value)
              )
            }
          />
        </FormControl>
      );
  }
}

export default ValueInput;
