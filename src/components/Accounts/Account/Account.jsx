import React, {Component} from 'react';

class Account extends Component {
    render() {
        const {account} =  this.props;
        const {lineMap, number} = account;
        return (
            <div className={'account'}>
                {lineMap.map((line, i) => (
                    <div key={i} className={'line'}>
                        {line.map(char => char)}
                    </div>
                ))}
                <p>{number}</p>
            </div>
        );
    }
}

export default Account;