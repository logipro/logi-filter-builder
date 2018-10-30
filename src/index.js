import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  withStyles,
  Button,
  IconButton,
  Divider,
  ExpansionPanelActions
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import RemoveIcon from "@material-ui/icons/Remove";

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column"
  },
  button: {
    //margin: theme.spacing.unit / 2
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  heading: {
    fontSize: theme.typography.pxToRem(15)
  }
});

const operatorTypes = new Map();
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
  .set("String", [
    { Label: "Like", TranslateTo: " Like " },
    { Label: "Not Like", TranslateTo: " Not Like " },
    { Label: "=", TranslateTo: " = " },
    { Label: "!=", TranslateTo: " != " }
  ]);

const operandTypes = new Map();
operandTypes
  .set("AND", { Label: "AND", TranslateTo: " AND " })
  .set("OR", { Label: "OR", TranslateTo: " OR " });

class AdvancedFilter extends Component {
  state = {
    currentConditions: [
      {
        column: undefined,
        operator: undefined,
        value: undefined,
        operand: operandTypes.get("AND")
      }
    ]
  };

  addNewCondition() {
    let currentConditions = [...this.state.currentConditions];
    currentConditions.push({
      column: undefined,
      operator: undefined,
      value: undefined,
      operand: operandTypes.get("AND")
    });
    this.setState({ currentConditions });
  }

  removeCondition(conditionIndex) {
    let currentConditions = [...this.state.currentConditions];
    currentConditions.splice(conditionIndex, 1);
    if (currentConditions.length > 0) {
      this.setState({ currentConditions });
    } //case user remove the last condition => we'll add one empty condition
    else {
      this.setState({
        currentConditions: [
          {
            column: undefined,
            operator: undefined,
            value: undefined,
            operand: operandTypes.get("AND")
          }
        ]
      });
    }
  }

  handleChange(
    selectedColumn,
    index,
    value,
    changeType,
    translateValue = null
  ) {
    let currentConditions = [...this.state.currentConditions];
    let currentCondition;
    if (changeType === "column")
      currentCondition = {
        ...selectedColumn,
        column: this.props.columns.filter(c => c.Header === value)[0]
      };
    else if (changeType === "operator")
      currentCondition = {
        ...selectedColumn,
        operator: operatorTypes
          .get(selectedColumn.column.dataType)
          .filter(opt => opt.Label === value)[0]
      };
    else if (changeType === "value")
      currentCondition = {
        ...selectedColumn,
        value: { value: value, translateValue: translateValue }
      };
    else if (changeType === "operand")
      currentCondition = {
        ...selectedColumn,
        operand: operandTypes.get(value)
      };
    currentConditions[index] = currentCondition;
    this.setState({ currentConditions });
  }

  validateAndCreate() {
    //validate
    if (
      this.state.currentConditions.filter(
        c =>
          !(
            c.column &&
            c.column.accessor &&
            c.operator &&
            c.operator.TranslateTo &&
            c.value &&
            c.value.translateValue
          )
      ).length > 0
    ) {
      this.setState({
        Error: "Please fix errors highlighted red and try again"
      });
      return;
    }
    //create filter
    this.setState({ Error: undefined });
    var filter = this.state.currentConditions
      .map((condition, index) => {
        return `${condition.column.accessor} ${
          condition.operator.TranslateTo
        } ${condition.value.translateValue} ${
          index + 1 < this.state.currentConditions.length
            ? condition.operand.TranslateTo
            : ""
        }`;
      })
      .join(" ");
    this.props.getFilterStatement(filter);
  }

  render() {
    var { classes, columns } = this.props;

    return (
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>
            {this.state.Error ? this.state.Error : "Create Filter"}
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <form className={classes.root} autoComplete="off">
            {this.state.currentConditions.map((cc, index) => (
              <section key={index}>
                <FormControl className={classes.formControl}>
                  <Select
                    error={!(cc.column && cc.column.Header)}
                    native
                    value={
                      cc.column && cc.column.Header ? cc.column.Header : "None"
                    }
                    onChange={e =>
                      this.handleChange(cc, index, e.target.value, "column")
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
                {cc.column ? (
                  <FormControl className={classes.formControl}>
                    <Select
                      error={!(cc.operator && cc.operator.Label)}
                      value={
                        cc.operator && cc.operator.Label
                          ? cc.operator.Label
                          : "None"
                      }
                      onChange={e =>
                        this.handleChange(cc, index, e.target.value, "operator")
                      }
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
                      this.handleChange(
                        selectedColumn,
                        index,
                        value,
                        changeType,
                        translateValue
                      )
                    }
                  />
                ) : null}
                {cc.operator &&
                index + 1 < this.state.currentConditions.length ? (
                  <FormControl className={classes.formControl}>
                    <Select
                      value={
                        cc.operand.Label //default must be AND
                      }
                      onChange={e =>
                        this.handleChange(cc, index, e.target.value, "operand")
                      }
                      inputProps={{
                        name: "operand",
                        id: "operand-select"
                      }}
                      native
                    >
                      {Array.from(operandTypes.values()).map(operand => {
                        return (
                          <option value={operand.Label} key={operand.Label}>
                            {operand.Label}
                          </option>
                        );
                      })}
                    </Select>
                  </FormControl>
                ) : null}
                <IconButton
                  aria-label="Remove"
                  className={classes.button}
                  onClick={() => {
                    this.removeCondition(index);
                  }}
                >
                  <RemoveIcon fontSize={"small"} />
                </IconButton>
              </section>
            ))}
          </form>
        </ExpansionPanelDetails>
        <IconButton
          aria-label="Add"
          className={classes.button}
          onClick={() => {
            this.addNewCondition();
          }}
        >
          <AddIcon fontSize={"small"} />
        </IconButton>
        <Divider />
        <ExpansionPanelActions>
          <Button
            onClick={() => this.validateAndCreate()}
            size="small"
            color="primary"
          >
            Apply
          </Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
    );
  }
}

AdvancedFilter.propTypes = {
  columns: PropTypes.array.isRequired
};

export default withStyles(styles, { withTheme: true })(AdvancedFilter);

function ValueInput(props) {
  var { classes, conditionColumn, conditionColumnIndex, handleChange } = props;

  switch (props.dataType) {
    case "DateTime":
    case "Date":
    case "Time":
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
                : null
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
