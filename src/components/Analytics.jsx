import React, { Component } from "react";

class Analytics extends Component {
  state = {};
  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">Analytics</div>
        <div className="panel-body">
          <div
            id="container"
            style={{
              minWidth: "310px",
              height: "400px",
              margin: "0 auto"
            }}
          />
        </div>
      </div>
    );
  }
}

export default Analytics;
