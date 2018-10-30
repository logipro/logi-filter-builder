import React, { Component } from "react";
import { render } from "react-dom";

import AdvancedFilter from "../../src";

class Demo extends Component {
  render() {
    const columns = [
      { Header: "String Column", accessor: "Task", dataType: "String" },
      {
        Header: "DateTime Column",
        accessor: "CreatedDateTime",
        dataType: "DateTime"
      },
      {
        Header: "Date Column",
        accessor: "TaskBeginTime",
        dataType: "Date"
      },
      { Header: "TaskEndTime", accessor: "TaskEndTime", dataType: "DateTime" },
      {
        Header: "Number Column",
        accessor: "TaskID",
        show: true,
        dataType: "Number"
      },
      //{ Header: "TaskTypeID", accessor: "TaskTypeID" }
      //{ Header: "Flag", accessor: "Flag" },
      //{ Header: "JobName", accessor: "JobName" },
      //{ Header: "Priority", accessor: "Priority" },
      //{ Header: "StatusID", accessor: "StatusID" },
      {
        Header: "Status",
        accessor: "Status",
        dataType: "String",
        Cell: row => (
          <span>
            <span
              style={{
                color:
                  row.value === "Waiting"
                    ? "#57d500"
                    : row.value === "Running"
                      ? "#ffbf00"
                      : row.value === "Failed"
                        ? "#ff2e00"
                        : "#ffbf00",
                transition: "all .3s ease"
              }}
            >
              &#x25cf;
            </span>{" "}
            {row.value}
          </span>
        )
      },
      { Header: "Task Type", accessor: "TaskType", dataType: "String" }
    ];

    return (
      <div>
        <h1>Logi-filter-builder Demo</h1>
        <AdvancedFilter
          columns={columns}
          getFilterStatement={filterStatement => {
            alert(filterStatement);
          }}
        />
      </div>
    );
  }
}

render(<Demo />, document.querySelector("#demo"));
