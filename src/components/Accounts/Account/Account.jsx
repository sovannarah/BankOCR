import React, {Component} from 'react';
import './Account.css';

class Account extends Component {
    render() {
        const {account} = this.props;
        const {lineMap, number, status, possibilities} = account;
        return (
            <div className={'account'}>
                {lineMap.map((line, i) => (
                    <div key={i} className={'line'}>
                        {line.map(char => char)}
                    </div>
                ))}
                <div className={'info__number'}>
                    <p>{number}</p>
                    <p>{status}</p>
                    {possibilities &&
                    <p>
                        [
                    {possibilities.slice(0, 3).map((possibility, index) => (
                         <span key={index}>{possibility},</span>
                        ))}
                        ...]
                    </p>
                    }
                </div>
            </div>
        );
    }
}

export default Account;