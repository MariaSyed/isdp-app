import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Dropzone from "react-dropzone";
import csv from "csv";
import ReactTable from 'react-table'
import 'react-table/react-table.css'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      readings: []
    };
  }

  onDrop(e) {
    const reader = new FileReader();
    reader.onload = () => {
      csv.parse(reader.result, (err, data) => {
        console.log(data);
        if (data) {
          this.convertToReadingsArray(data);
        } else {
            window.alert('CSV in wrong format!')
        }
      });
    };

    reader.readAsBinaryString(e[0]);
  }

  convertToReadingsArray(data) {
    const titles = data[0]; // assuming first array is always the titles
    const entries = data.slice(1); // assuming everything other than first row are entries
    const readings = [];
    entries.forEach(entry => {
      let newReading = {};
      for (let i = 0; i < titles.length; i++) {
          const key = titles[i].includes(".") ? titles[i].replace(/\./g , "") : titles[i]
        Object.assign(newReading, { [key]: entry[i] || "" });
      }
      if (Object.keys(newReading).length === titles.length) {
        readings.push(newReading);
      }
    });
    console.log("READINGS: ", readings);
    this.setState({ readings });
  }

  render() {
    return (
      <div>
        <div className="dropzone">
          <Dropzone onDrop={this.onDrop.bind(this)}>
            <p>
              Dropping your csv file here, or click to select file to upload.
            </p>
          </Dropzone>
        </div>

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
            defaultPageSize={10}
            className="-striped -highlight"
          />
          <br />
        </div>
      </div>
    );
  }
}

export default App;
