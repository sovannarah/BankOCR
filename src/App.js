import React from 'react';
import './App.css';
import axios from "axios";

class App extends React.Component {

  componentDidMount() {
    axios.get('http://localhost:4245/file/read')
        .then(res => {
            console.log(res.data)
        })
  }

  render() {
    return (
        <div className="App">
        </div>
    )
  }
}

export default App;
