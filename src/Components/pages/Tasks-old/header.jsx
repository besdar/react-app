import React from "react";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";

const Header = (props) => {
  return (
    <div className="p-grid">
      <div className="p-col-9">
        <h1 style={{ margin: "0px" }}>Задачи</h1>
      </div>
      <div className="p-col-3 head_buttons" style={{ textAlign: "right" }}>
        <Link to="/bids/NewBid">
          <Button icon="pi pi-plus" />
        </Link>
      </div>
    </div>
  );
};

export default Header;
