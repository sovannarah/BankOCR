import React from 'react';
import './App.css';
import axios from "axios";

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
                <pre>
                {accountNumbers.map(({number, lineMap}, index) => (
                    <div key={index} className={'account'}>
                        {lineMap.map((line, i) => (
                            <div key={i} className={'line'}>
                                {line.map(char => char)}
                            </div>
                        ))}
                        <p>{number}</p>
                    </div>
                ))}
                    </pre>
            </div>
        )
    }
}

export default App;
