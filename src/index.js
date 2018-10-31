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
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import RemoveIcon from "@material-ui/icons/Remove";
import ValueInput from "./ValueInput";
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
      currentConditions: [
        {
          column: undefined,
          operator: undefined,
          value: undefined,
          operand: operandTypes.get("AND")
        }
      ]
    };
  }

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
          <div className={classes.root}>
            {this.state.currentConditions.map((condition, index) => (
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
                index + 1 < this.state.currentConditions.length ? (
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
          </div>
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
