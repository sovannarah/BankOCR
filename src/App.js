import React from 'react';
import './App.css';
import axios from "axios";
import Accounts from "./components/Accounts/Accounts";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            accountNumbers: [],
            file: null
        }
    }

    componentDidMount() {
        // axios.get('http://localhost:4245/file/read')
        //     .then(res => {
        //         this.setState({accountNumbers: res.data})
        //         console.log(res.data)
        //     })
    }

    onFileChange = event => {
        this.setState({ file: event.target.files[0] });
    };

    upload = () => {
        const {file} = this.state;
        const formData = new FormData();
        if(file) {
            formData.append(
                "file",
                file,
                file.name
            );

            axios.post('http://localhost:4245/file/read', formData)
                .then(res => {
                    this.setState({accountNumbers: res.data})
                    console.log(res.data)
                })
        }

    }

    render() {
        const {accountNumbers} = this.state;
        return (
            <div className="App">
                <input type="file" onChange={this.onFileChange} />
                <button onClick={this.upload}>Upload</button>
                <Accounts accountNumbers={accountNumbers}/>
            </div>
        )
    }
}

export default App;
