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
import RemoveIcon from "@material-ui/icons/Remove";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { operatorTypes, operandTypes } from "./Consts";
import ConditionLine from "./ConditionLine";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

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

class AdvancedFilter extends Component {
  constructor(props) {
    super(props);
    if (props.passedConditions) {
      this.state = {
        currentConditions: this.props.passedConditions,
        error: undefined
      };
    } else {
      this.state = {
        currentConditions: [
          {
            column: undefined,
            operator: undefined,
            value: undefined,
            operand: operandTypes.get("AND")
          }
        ],
        error: undefined
      };
    }
    this.handleChange = this.handleChange.bind(this);
    this.validate = this.validate.bind(this);
    this.validateAndCreate = this.validateAndCreate.bind(this);
  }

  addNewCondition() {
    let currentConditions = [...this.state.currentConditions];
    currentConditions.push({
      column: undefined,
      operator: undefined,
      value: undefined,
      operand: operandTypes.get("AND")
    });

    this.validate(currentConditions);
  }

  addNestedCondition() {
    let nestedConditionRef = React.createRef();
    let currentCondition = {
      type: "NestedCondition",
      ref: nestedConditionRef,
      conditions: {
        column: undefined,
        operator: undefined,
        value: undefined,
        operand: operandTypes.get("AND")
      }
    };
    let currentConditions = [...this.state.currentConditions];
    currentConditions.push(currentCondition);
    this.validate(currentConditions);
  }

  removeCondition(conditionIndex) {
    let currentConditions = [...this.state.currentConditions];
    currentConditions.splice(conditionIndex, 1);
    if (currentConditions.length > 0) {
      this.validate(currentConditions);
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
        ],
        error: undefined
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

    this.validate(currentConditions);
  }

  validate(conditions) {
    var errorObj = undefined;
    var filterStatement = "";
    var index = 0;
    conditions.forEach(condition => {
      if (!(condition.type || condition.type === "Condition")) {
        if (
          !(
            condition.column &&
            condition.column.accessor &&
            condition.operator &&
            condition.operator.TranslateTo &&
            condition.value &&
            condition.value.translateValue &&
            condition.value.value !== ""
          )
        ) {
          errorObj = new Error(
            "Error evaluating the filter, please fix the marked error(s)"
          );
        } else {
          filterStatement =
            filterStatement +
            `${condition.column.accessor} ${condition.operator.TranslateTo} ${
              condition.value.translateValue
            } ${
              index + 1 < this.state.currentConditions.length
                ? condition.operand.TranslateTo
                : ""
            }`;
        }
      }
      //validate Nested conditions (recursive)
      else {
        if (!condition.ref.current) {
          if (this.props.onError) {
            errorObj = new Error("No Access to nested condition yet");
          }
        } else if (condition.ref.current.state.error) {
          errorObj = new Error("Error in Nested condition");
        } else {
          filterStatement =
            filterStatement +
            "( " +
            condition.ref.current.state.filterStatement +
            " )";
        }
      }
      index++;
    });

    //---in case parent needs to be notified of change
    if (this.props.onError) {
      this.props.onError(errorObj);
    }
    this.setState({
      currentConditions: conditions,
      error: errorObj,
      filterStatement: filterStatement
    });
  }

  validateAndCreate() {
    var filterStatement = "";
    var index = 0;

    this.state.currentConditions.forEach(condition => {
      if (condition.type && condition.type === "NestedCondition") {
        //nested
        filterStatement =
          filterStatement + condition.ref.current.props.getFilterStatement();
      } //normal condition
      else {
        filterStatement =
          filterStatement +
          `${condition.column.accessor} ${condition.operator.TranslateTo} ${
            condition.value.translateValue
          } ${
            index + 1 < this.state.currentConditions.length
              ? condition.operand.TranslateTo
              : ""
          }`;
      }
      index++;
    });
    //create filter
    this.setState({ Error: undefined });
    /*var filter = this.state.currentConditions
      .map((condition, index) => {
        return `${condition.column.accessor} ${
          condition.operator.TranslateTo
        } ${condition.value.translateValue} ${
          index + 1 < this.state.currentConditions.length
            ? condition.operand.TranslateTo
            : ""
        }`;
      })
      .join(" ");*/
    this.props.getFilterStatement(filterStatement);
  }

  render() {
    var { classes, columns } = this.props;

    return (
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>
            {this.state.error
              ? this.state.error.message
              : this.state.filterStatement}
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div className={classes.root}>
            {this.state.currentConditions.map(
              (cc, index) =>
                !(cc.type || cc.type === "Condition") ? (
                  <section key={index}>
                    <ConditionLine
                      key={index}
                      classes={classes}
                      cc={cc}
                      index={index}
                      handleChange={this.handleChange}
                      columns={columns}
                    />
                    {cc.operator &&
                    index + 1 < this.state.currentConditions.length ? (
                      <FormControl className={classes.formControl}>
                        <Select
                          value={
                            cc.operand.Label //default must be AND
                          }
                          onChange={e =>
                            this.handleChange(
                              cc,
                              index,
                              e.target.value,
                              "operand"
                            )
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
                ) : (
                  <section key={index}>
                    <AdvancedFilter
                      key={index}
                      columns={this.props.columns}
                      classes={classes}
                      getFilterStatement={f => {
                        return f;
                      }}
                      ref={cc.ref}
                      onError={error => error && this.setState({ error })}
                      passedConditions={cc.conditions}
                    />
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
                )
            )}
          </div>
        </ExpansionPanelDetails>
        <Divider />
        <ExpansionPanelActions>
          <IconButton
            aria-label="Add"
            className={classes.button}
            onClick={() => {
              this.addNewCondition();
            }}
          >
            <AddIcon fontSize={"small"} />
          </IconButton>
          <Button onClick={() => this.addNestedCondition()}>{"+()"}</Button>
          <Button onClick={this.validateAndCreate} size="small" color="primary">
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
