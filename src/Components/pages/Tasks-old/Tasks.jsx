import React from "react";
import { TreeTable } from "primereact/treetable";
// import { ProgressSpinner } from 'primereact/progressspinner';
import { Column } from "primereact/column";

import "./Tasks.css";
import { NavLink } from "react-router-dom";

import Header from "./header";

let cols = [];
if (props.styleDisplayOfMessages == "none" && window.innerWidth > 1350) {
  cols = [
    { field: "status", header: "#", expander: false },
    { field: "label", header: "Описание", expander: true },
    { field: "number", header: "Номер", expander: false },
    { field: "implementer", header: "Исполнитель", expander: false },
    { field: "type", header: "Тип", expander: false },
    { field: "author", header: "Автор", expander: false },
    { field: "customer", header: "Заказчик", expander: false },
    { field: "project", header: "Проект", expander: false },
  ];
} else {
  cols = [
    { field: "status", header: "#", expander: false },
    { field: "label", header: "Описание", expander: true },
    { field: "number", header: "Номер", expander: false },
    { field: "implementer", header: "Исполнитель", expander: false }
  ];
}

let TasksTreeTableColumns = cols.map((col) => {
  if (col.field == "number") {
    return (
      <Column
        key={col.field}
        field={col.field}
        expander={col.expander}
        header={col.header}
        body={(node) => {
          if (isNaN(node.data.number)) {
            return node.data.number;
          } else {
            return (
              <NavLink to={"/tasks/" + node.data.number}>
                {node.data.number}
              </NavLink>
            );
          }
        }}
      />
    );
  } else {
    return (
      <Column
        key={col.field}
        field={col.field}
        expander={col.expander}
        header={col.header}
      />
    );
  }
});

const Tasks = (props) => {
  if (!props.tasksList.length) {
    return (
      <div className="progressDiv"
        style={{ height: window.innerHeight + "px" }}>
        <img src={window.location.origin + "/assets/loader.gif"}></img>
      </div>
    );
  }

  return (
    <React.Fragment>
      <Header />
      <div className="p-col">
        <TreeTable value={props.tasksList} autoLayout={true}>
          {TasksTreeTableColumns}
        </TreeTable>
      </div>
    </React.Fragment>
  );
};

export default Tasks;
