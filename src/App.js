import React, { Component } from "react";
import firebase from 'firebase'
import "./App.css";
import Dropzone from "react-dropzone";
import ReactTable from "react-table";
import "react-table/react-table.css";

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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        readings: [],
        dropzoneText: 'Dropping your csv file here, or click to select file to upload.',
        fileIncorrect: false
    };
  }

  componentDidMount() {
      firebase.database().ref('/readings').on('value', (snapshot) => {
          if (snapshot.val()) {
              console.log('values! ', snapshot.val())
              const readings = Object.values(snapshot.val())
              this.setState({ readings })
          }
      })
  }

  onDrop(e) {
    if (e[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        const csv = reader.result.replace(/\r/g,'')
        let lines = csv.split("\n");

        let headers = lines[0].split(",");

        if (headers.find((h) => h.includes('date') || h.includes('temperature'))) {

            for (let i = 1; i < lines.length; i++) {
                let obj = {};
                let currentline = lines[i].split(",");


                for (let j = 0; j < headers.length; j++) {
                    if (currentline[j] && headers[j]) {
                        obj[headers[j].replace(/\./g, '')] = currentline[j];
                    }
                }

                firebase.database().ref('/readings').push(obj)
            }
        } else {
            this.setState({ dropzoneText: 'Incorrect fields in file! Could not parse', fileIncorrect: true })
        }
      }

      reader.readAsBinaryString(e[0]);
    } else {
        this.setState({ dropzoneText: 'Incorrect file format!', fileIncorrect: true   })
    }
  }

  render() {
    return (
      <div>
        <div className="dropzone">
          <Dropzone onDrop={this.onDrop.bind(this)}>
            <p style={this.state.fileIncorrect ? { color: 'red' } : {}}>
                { this.state.dropzoneText }
            </p>
          </Dropzone>
        </div>

          <div className="instructions"><i>Click on headings to sort</i></div>

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
      </div>
    );
  }
}

export default App;
