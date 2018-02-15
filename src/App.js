import React, { Component } from "react";
import "./App.css";
import Dropzone from "react-dropzone";
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import axios from 'axios'
import neatCsv from './lib/neat-csv'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      readings: []
    };
  }

  onDrop(e) {
      const that = this
      axios.get(e[0].preview)
          .then(function (response) {
              neatCsv(response.data || "").then(data => {
                  if (data) {
                      that.setState({ readings: data })
                  }
              });
          })
          .catch(function (error) {
              console.log(error);
          })
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
                    accessor: "PM2%5"
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
