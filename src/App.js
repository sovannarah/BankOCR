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


    onFileChange = event => {
        this.setState({ file: event.target.files[0] });
    };

    download = (filename) => {
        const url = 'http://localhost:4245/file/download/' + filename;
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'numberAccounts.txt');
        document.body.appendChild(link);
        link.click();
    }

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
                    this.setState(() => ({accountNumbers: res.data.data}));
                    this.download(res.data.filename);
                })
                .catch(err => console.error(err))
        }

    }


    render() {
        const {accountNumbers} = this.state;
        console.log(this.state)
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
