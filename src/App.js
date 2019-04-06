import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import RecentLogs from "./components/RecentLogs";
import logo from "./logo.png";
// import Timer from "./components/Timer";

// import Analytics from "./components/Analytics";
import "./App.css";

class App extends Component {
  state = {
    log_running: false,
    is_paused: false,
    worked_hours: 0,
    worked_minutes: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };

  // start timer
  startLog = () => {
    this.setState({ log_running: true });
    // const log = {
    //   complete_date: new Date(),
    //   time_start: new Date().getTime(),
    //   time_end: ""
    // };

    // // get the logs array from localstorage
    // if (localStorage.getItem("logs") === null) {
    //   // create an emtpy array of logs
    //   localStorage.logs = JSON.stringify([]);
    // }

    // const current_logs = JSON.parse(localStorage.logs);

    // // add current log
    // current_logs.push(log);

    // // update localstorage
    // localStorage.logs = JSON.stringify(current_logs);

    // start timer
    this.timer = setInterval(() => {
      let seconds = this.state.seconds + 1; // update seconds
      let minutes = this.state.minutes;
      let hours = this.state.hours;
      let worked_hours = this.state.worked_hours;
      let worked_minutes = this.state.worked_minutes;

      // if one minute has passed
      if (seconds === 60) {
        // reset seconds
        seconds = 0;
        // increment minute
        minutes++;
        worked_minutes++;
        if (worked_minutes === 60) {
          worked_minutes = 0;
          worked_hours++;
        }
      }

      // if one minute has passed
      if (minutes === 60) {
        minutes = 0;
        hours++;
      }

      // update state
      this.setState({
        seconds,
        minutes,
        hours,
        worked_hours,
        worked_minutes
      });
    }, 1000);
  };

  // pause timer
  pauseLog = () => {
    this.setState({ is_paused: true });
    clearInterval(this.timer);
  };

  // resume timer
  resumeLog = () => {
    this.setState({ is_paused: false });
    this.startLog();
  };

  // stop timer
  stopLog = () => {
    clearInterval(this.timer);
    this.setState({
      is_paused: false,
      log_running: false,
      hours: 0,
      minutes: 0,
      seconds: 0
    });

    // Save time slot
    this.saveTimeSlot();
  };

  // Trigger page reload
  componentDidMount() {
    // when page is LOADED
    // get state from local storge
    let state = JSON.parse(
      localStorage.mstate === undefined ? "{}" : localStorage.mstate
    );

    // and update the current component state
    this.setState(state);
    this.saveTimeSlot();

    // when page is UNLOADED
    window.onbeforeunload = function() {
      // call this callback
      this.onUnload();
    }.bind(this);
  }

  onUnload = () => {
    // pause the timer if counter is running
    if (this.state.log_running) {
      this.setState({ is_paused: true });
    }

    // create a copy of current state in localstorage
    localStorage.mstate = JSON.stringify(this.state);

    // save time slot
    this.saveTimeSlot();
  };

  // save hours/minutes worked to localstorage along with date in time_slots array
  // returns [true/false] if todays found in time slots array
  saveTimeSlot = () => {
    // get todays date
    let today = this.getFormattedDate();

    // get current time slots
    let time_slots = JSON.parse(
      localStorage.time_slots === undefined ? "[]" : localStorage.time_slots
    );

    // check if there is a record for today
    // if so update that record
    let today_found = false;

    if (time_slots.length > 0) {
      time_slots.map(obj => {
        if (obj.date === today) {
          today_found = true;
          obj.hours_worked = this.state.worked_hours;
          obj.minutes_worked = this.state.worked_minutes;
          return obj;
        }
      });
    }

    // if there is no record for today
    // create a new one
    if (today_found === false) {
      const newTimeSlot = {
        date: today,
        hours_worked: 0,
        minutes_worked: 0
      };
      time_slots.push(newTimeSlot);

      let state = {
        log_running: false,
        is_paused: false,
        worked_hours: 0,
        worked_minutes: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      };
      this.setState(state);
      localStorage.mstate = JSON.stringify(state);
    }

    // update local storage timeslots (array)
    localStorage.time_slots = JSON.stringify(time_slots);

    return today_found;
  };

  getFormattedDate = () => {
    let today = new Date();
    let dd = today.getDate();

    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }

    if (mm < 10) {
      mm = "0" + mm;
    }

    return dd + "-" + mm + "-" + yyyy;
  };

  render() {
    const {
      log_running,
      is_paused,
      hours,
      minutes,
      seconds,
      worked_hours,
      worked_minutes
    } = this.state;

    return (
      <Router>
        <div className="container">
          <div className="col-md-12">
            <br />
            <h2>
              <img src={logo} width="80" className="unpadded_top" />{" "}
              <span className="padded_top">Work Time Counter</span>
            </h2>
            <div className="jumbotron">
              <div className="col-md-10 float-left">
                <div className="row">Working From</div>
                <div className="row">
                  <div className="col-md-4">
                    <h3>
                      {hours} <small>Hours</small>
                    </h3>
                  </div>
                  <div className="col-md-4">
                    <h3>
                      {minutes} <small>Minutes</small>
                    </h3>
                  </div>
                  <div className="col-md-4">
                    <h3>
                      {seconds} <small>Seconds</small>
                    </h3>
                  </div>
                </div>
                <br />
                <br />
                <div className="row">
                  <strong>Today Worked:</strong>
                  <strong>
                    {" "}
                    <code> {worked_hours} </code>
                  </strong>{" "}
                  Hours{" "}
                  <strong>
                    <code> {worked_minutes} </code>
                  </strong>{" "}
                  Minutes
                  <br />
                </div>
              </div>
              <div className="col-md-2 float-left padded_top">
                <div className="row">
                  <div className={log_running === true ? "hide-it" : ""}>
                    <button
                      onClick={this.startLog}
                      className="btn btn-info btn-rounded btn-lg btn-block"
                    >
                      Start
                    </button>
                  </div>
                  <div className={log_running === false ? "hide-it" : ""}>
                    <div className={is_paused === true ? "hide-it" : ""}>
                      <button
                        className="btn btn-warning btn-rounded btn-block btn-lg mbtn"
                        onClick={this.pauseLog}
                      >
                        Pause
                      </button>
                    </div>
                    <div className={is_paused === false ? "hide-it" : ""}>
                      <button
                        className="btn btn-info btn-rounded btn-block btn-lg mbtn"
                        onClick={this.resumeLog}
                      >
                        Resume
                      </button>
                    </div>
                    <button
                      className="btn btn-danger btn-block btn-rounded btn-lg mbtn"
                      onClick={this.stopLog}
                    >
                      Stop
                    </button>
                  </div>
                </div>
              </div>
              <div className="clearfix" />
            </div>

            {/* <Analytics /> */}
            <RecentLogs
              worked_hours={worked_hours}
              worked_minutes={worked_minutes}
            />
            <div className="row">
              <div className="footer">
                <p>
                  Developed with &#x2665; by{" "}
                  <Link to="/my-profile">Suleman khan</Link>
                  <Route
                    path="/my-profile"
                    component={() => {
                      window.location =
                        "https://www.linkedin.com/in/m-suleman-ibrahim-0a170013b/";
                      return null;
                    }}
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
