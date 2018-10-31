import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  withStyles,
  Button,
  Divider,
  ExpansionPanelActions
} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import RemoveIcon from "@material-ui/icons/Remove";
import { operatorTypes, operandTypes } from "./Settings";
import ConditionLine from "./ConditionLine";

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
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      conditions: [
        {
          type: "Simple",
          column: undefined,
          operator: undefined,
          value: undefined,
          operand: operandTypes.get("AND")
        }
      ]
    };
  }

  addNewCondition() {
    let conditions = [...this.state.conditions];
    conditions.push({
      type: "Simple",
      column: undefined,
      operator: undefined,
      value: undefined,
      operand: operandTypes.get("AND")
    });
    this.validateAndCreate(conditions);
  }

  removeCondition(conditionIndex) {
    let conditions = [...this.state.conditions];
    conditions.splice(conditionIndex, 1);
    if (conditions.length > 0) {
      this.validateAndCreate(conditions);
    } //case user remove the last condition => we'll add one empty condition
    else {
      this.validateAndCreate([
        {
          type: "Simple",
          column: undefined,
          operator: undefined,
          value: undefined,
          operand: operandTypes.get("AND")
        }
      ]);
    }
  }

  handleChange(
    selectedColumn,
    index,
    value,
    changeType,
    translateValue = null
  ) {
    let conditions = [...this.state.conditions];
    let condition;
    if (changeType === "column")
      condition = {
        ...selectedColumn,
        column: this.props.columns.filter(c => c.Header === value)[0]
      };
    else if (changeType === "operator")
      condition = {
        ...selectedColumn,
        operator: operatorTypes
          .get(selectedColumn.column.dataType)
          .filter(opt => opt.Label === value)[0]
      };
    else if (changeType === "value")
      condition = {
        ...selectedColumn,
        value: { value: value, translateValue: translateValue }
      };
    else if (changeType === "operand")
      condition = {
        ...selectedColumn,
        operand: operandTypes.get(value)
      };
    conditions[index] = condition;
    this.validateAndCreate(conditions);
  }

  validateAndCreate(conditions) {
    //validate
    if (
      conditions.filter(
        c =>
          !(
            c.column &&
            c.column.accessor &&
            c.operator &&
            c.operator.TranslateTo &&
            c.value &&
            c.value.translateValue &&
            c.value.value !== ""
          )
      ).length > 0
    ) {
      this.setState({
        Error: "Please fix errors highlighted red and try again",
        conditions,
        filterStatement: undefined
      });
      return;
    }
    //create filter
    var filter = conditions
      .map((condition, index) => {
        return `${condition.column.accessor} ${
          condition.operator.TranslateTo
        } ${condition.value.translateValue} ${
          index + 1 < conditions.length ? condition.operand.TranslateTo : ""
        }`;
      })
      .join(" ");
    //---
    this.setState({
      Error: undefined,
      conditions,
      filterStatement: filter
    });
  }

  render() {
    var { classes, columns } = this.props;

    return (
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>
            {this.state.Error
              ? this.state.Error
              : this.state.filterStatement
                ? this.state.filterStatement
                : "Create Filter"}
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div className={classes.root}>
            {this.state.conditions.map((condition, index) => {
              if (condition.type === "Simple") {
                return (
                  <section key={index}>
                    <ConditionLine
                      key={index}
                      classes={classes}
                      condition={condition}
                      index={index}
                      handleChange={this.handleChange}
                      columns={columns}
                    />
                    {condition.operator &&
                    index + 1 < this.state.conditions.length ? (
                      <FormControl className={classes.formControl}>
                        <Select
                          value={
                            condition.operand.Label //default must be AND
                          }
                          onChange={e =>
                            this.handleChange(
                              condition,
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
                    <Button
                      variant={"outlined"}
                      aria-label="Remove"
                      className={classes.button}
                      onClick={() => {
                        this.removeCondition(index);
                      }}
                    >
                      {"-"}
                    </Button>
                  </section>
                );
              }
            })}
          </div>
        </ExpansionPanelDetails>
        <Divider />
        <ExpansionPanelActions>
          <Button
            variant={"outlined"}
            aria-label="AddNested"
            className={classes.button}
            onClick={() => {
              this.addNewCondition();
            }}
          >
            {"+()"}
          </Button>
          <Button
            variant={"outlined"}
            aria-label="Add"
            className={classes.button}
            onClick={() => {
              this.addNewCondition();
            }}
          >
            {"+"}
          </Button>
          <Button
            onClick={() =>
              this.props.getFilterStatement(this.state.filterStatement)
            }
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
