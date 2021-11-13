import React from 'react';
import './App.css';
import axios from "axios";
import Accounts from "./components/Accounts/Accounts";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            accountNumbers: []
        }
    }

    componentDidMount() {
        axios.get('http://localhost:4245/file/read')
            .then(res => {
                this.setState({accountNumbers: res.data})
                console.log(res.data)
            })
    }

    render() {
        const {accountNumbers} = this.state;
        return (
            <div className="App">
                <Accounts accountNumbers={accountNumbers}/>
            </div>
        )
    }
}

export default App;
