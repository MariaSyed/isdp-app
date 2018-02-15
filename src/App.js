import React, { Component } from "react";
import "./App.css";
import Dropzone from "react-dropzone";
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
          const csv = reader.result
          var lines=csv.split("\n");

          var result = [];

          var headers=lines[0].split(",");

          for(var i=1;i<lines.length;i++){

              var obj = {};
              var currentline=lines[i].split(",");

              for(var j=0;j<headers.length;j++){
                  obj[headers[j].replace(/\./g, '')] = currentline[j];
              }

              result.push(obj);

          }

          this.setState({ readings: result })
      };

      reader.readAsBinaryString(e[0]);
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
