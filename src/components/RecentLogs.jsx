import React, { Component } from "react";
import { Link } from "react-router-dom";

class RecentLogs extends Component {
  state = {
    time_slots: []
  };
  componentDidMount() {
    // get the time_slots array from localstorage
    if (localStorage.getItem("time_slots") === null) {
      // create an emtpy array of time_slots
      localStorage.time_slots = JSON.stringify([]);
    }

    const current_time_slots = JSON.parse(localStorage.time_slots);
    this.setState({ time_slots: current_time_slots });

    console.log(this.props);
  }
  render() {
    const { time_slots } = this.state;
    return (
      <div className="panel panel-default">
        <div className="panel-heading">Recent Logs</div>
        <div className="panel-body">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>S.NO</th>
                <th>Date</th>
                <th>Hours Worked</th>
                <th>Minutes Worked</th>
                {/* <th>Action</th> */}
              </tr>
            </thead>
            <tbody>
              {time_slots.map((slot, index) => (
                <tr key={index}>
                  <td>{index}</td>
                  <td>{slot.date}</td>
                  <td>
                    {index === 0 ? this.props.worked_hours : slot.hours_worked}
                  </td>
                  <td>
                    {index === 0
                      ? this.props.worked_minutes
                      : slot.minutes_worked}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default RecentLogs;
