import React, { Component } from "react";

import LogiFilterBuilder from "../../src";

class Demo extends Component {
  render() {
    const columns = [
      { header: "String Column", accessor: "Task", dataType: "String" },
      {
        header: "DateTime Column",
        accessor: "CreatedDateTime",
        dataType: "DateTime"
      },
      {
        header: "Date Column",
        accessor: "TaskBeginTime",
        dataType: "Date"
      },
      { header: "TaskEndTime", accessor: "TaskEndTime", dataType: "DateTime" },
      {
        header: "Number Column",
        accessor: "TaskID",
        isHidden: true,
        dataType: "Number"
      },
      //{ header: "TaskTypeID", accessor: "TaskTypeID" }
      //{ header: "Flag", accessor: "Flag" },
      //{ header: "JobName", accessor: "JobName" },
      //{ header: "Priority", accessor: "Priority" },
      //{ header: "StatusID", accessor: "StatusID" },
      {
        header: "Status",
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
      { header: "Task Type", accessor: "TaskType", dataType: "String" },
      { header: "Boolean Sample", accessor: "BoolSample", dataType: "Boolean" }
    ];

    return (
      <div>
        <h1>Logi-filter-builder Demo</h1>
        <LogiFilterBuilder
          startExpanded={true}
          columns={columns}
          getFilterStatement={filterStatement => {
            alert(filterStatement);
          }}
        />
      </div>
    );
  }
}

export default Demo;
