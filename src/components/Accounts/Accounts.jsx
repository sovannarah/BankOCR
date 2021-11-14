import React, {Component} from 'react';
import Account from "./Account/Account";

class Accounts extends Component {
    render() {
        const {accountNumbers} = this.props;
        return (

            <pre>
                {accountNumbers.map((account, index) => (
                    <Account  key={index} account={account}/>
                ))}
            </pre>

        );
    }
}

export default Accounts;