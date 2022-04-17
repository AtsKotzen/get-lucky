import React, { Component } from 'react';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
    state = {
        manager: '',
        players: [],
        balance: '',
        value: '1',
        message: ''
    };

    async componentDidMount() {
        const manager = await lottery.methods.manager().call();
        const players = await lottery.methods.getPlayers().call();
        const balance = await web3.eth.getBalance(lottery.options.address);

        this.setState({ manager, players, balance });
    }

    onSubmit = async (event) => {
        event.preventDefault();

        const accounts = await web3.eth.getAccounts();

        this.setState({ message: 'Waiting on transaction success...' });

        // enter player into lottery contract,
        // takes 15-30 secs
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei(this.state.value, 'ether')
        });

        this.setState({ message: 'You have been entered!' });
    };

    // pick a lottery winner
    onClick = async () => {
        const accounts = await web3.eth.getAccounts();

        this.setState({ message: 'Waiting on transaction success...' });

        await lottery.methods.pickWinner().send({
            from: accounts[0]
        });

        this.setState({ message: 'A winner has been picked!' });
    };

    render() {
        
        return (
            <div>
                <h2>Lottery Contract</h2>
                <p>
                    This contract is managed by { this.state.manager }.            
                </p>
                <p>
                    There are currently { this.state.players.length } people in this bet.             
                </p>
                <h1>Prize: { web3.utils.fromWei(this.state.balance, 'ether') } ETH</h1>
                <hr />

                <form onSubmit={this.onSubmit}>
                    <h4>Want to try your luck?</h4>
                    <div>
                        <label>Bet cost(ETH) </label>
                        <input 
                            disabled
                            placeholder='1'
                            value={this.state.value}
                            onChange={event => this.setState({ value: event.target.value })}
                        />
                    </div>
                    <button>Enter</button>
                </form>

                <hr />

                <h4>Ready to pick a winner?</h4>
                <button onClick={this.onClick}>Pick a winner!</button>

                <hr />

                <h1>{ this.state.message }</h1>
            </div>
        );
  }
}

export default App;

// const result = await new web3.eth.Contract(JSON.parse(interface))
//      .deploy({data: '0x' + bytecode }) // add 0x bytecode
//      .send({from: accounts[0]}); // remove 'gas'