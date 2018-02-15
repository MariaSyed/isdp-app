import React, { Component } from "react";
import firebase from "firebase";
import "./App.css";
import Dropzone from "react-dropzone";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { Line as LineChart } from 'react-chartjs'

var config = {
  apiKey: "AIzaSyBCvx1WFPYOutNvj8Hfmu_jTuxoWEQvPHc",
  authDomain: "isdp-954b3.firebaseapp.com",
  databaseURL: "https://isdp-954b3.firebaseio.com",
  projectId: "isdp-954b3",
  storageBucket: "isdp-954b3.appspot.com",
  messagingSenderId: "195263147810"
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(config);
}

const constructData = (labels, data1, data2) => {
    return {
        labels: labels,
        datasets: [
            {
                label: "PM2.5",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: data1
            },
            {
                label: "PM10",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: data2
            }
        ]
    }
}

const makeChartData = (readings) => {
    const PM25Data = []
    const PM10Data = []
    const timeLabels = []
    readings.forEach((reading) => {
        PM25Data.push(reading.PM25)
        PM10Data.push(reading.PM10)
        timeLabels.push(reading.time)
    })

    if (timeLabels.length > 0) {
        const data = constructData(timeLabels, PM25Data, PM10Data)
        return data
    } else {
        const data = constructData([], [], [])
        return data
    }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      readings: [],
      dropzoneText:
        "Dropping your csv file here, or click to select file to upload.",
      fileIncorrect: false
    };

    this.readingsRef = firebase.database().ref('readings')
  }

  componentWillMount() {
   this.readingsRef
      .on("value", snapshot => {
        if (snapshot.val()) {
          const readings = Object.values(snapshot.val());
          this.setState({ readings });
        }
      });
  }

  onDrop(e) {
    if (e[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        const csv = reader.result.replace(/\r/g, "");
        let lines = csv.split("\n");

        let headers = lines[0].split(",");

        if (
          headers.find(h => h.includes("date") || h.includes("temperature"))
        ) {
          for (let i = 1; i < lines.length; i++) {
            let obj = {};
            let currentline = lines[i].split(",");

            for (let j = 0; j < headers.length; j++) {
              if (currentline[j] && headers[j]) {
                obj[headers[j].replace(/\./g, "")] = currentline[j];
              }
            }

              this.readingsRef.push(obj);
          }
        } else {
          this.setState({
            dropzoneText: "Incorrect fields in file! Could not parse",
            fileIncorrect: true
          });
        }
      };

      reader.readAsBinaryString(e[0]);
    } else {
      this.setState({
        dropzoneText: "Incorrect file format!",
        fileIncorrect: true
      });
    }
  }

  deleteAllData() {
      if (window.confirm('Do you really want to delete all data?')) {
          this.readingsRef.set(null)
      }
  }

  render() {
      makeChartData(this.state.readings)
    return (
      <div>
        <div className="dropzone">
          <Dropzone onDrop={this.onDrop.bind(this)}>
            <p style={this.state.fileIncorrect ? { color: "red" } : {}}>
              {this.state.dropzoneText}
            </p>
          </Dropzone>
        </div>

        <div className="instructions">
          <i>Click on headings to sort</i>
        </div>

          {/*<button className="reset-btn" onClick={this.deleteAllData}>*/}
              {/*Click here to remove all data*/}
          {/*</button>*/}

        <div>
          <ReactTable
            data={this.state.readings}
            columns={[
              {
                Header: "Date",
                accessor: "date"
              },
              {
                Header: "Time",
                accessor: "time"
              },
              {
                Header: "Longitude",
                accessor: "longitude"
              },
              {
                Header: "Latitude",
                accessor: "latitude"
              },
              {
                Header: "Pressure",
                accessor: "pressure"
              },
              {
                Header: "Temperature",
                accessor: "temperature"
              },
              {
                Header: "PM2.5",
                accessor: "PM25"
              },
              {
                Header: "PM10",
                accessor: "PM10"
              }
            ]}
            defaultPageSize={20}
            className="-striped -highlight"
          />
          <br />
        </div>

          <LineChart data={makeChartData(this.state.readings)} width="1200" height="600"/>
      </div>
    );
  }
}

export default App;
