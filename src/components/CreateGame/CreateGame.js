import React, { Component } from 'react';
import './CreateGame.css'

import axios from 'axios';

import { connect } from 'react-redux';
import { createAlertMessage } from '../../redux/reducer';

import { Link } from 'react-router-dom';

class CreateGame extends Component {
    constructor() {
        super();
        this.state = {
            gameName: '',
            gameDescription: '',
            mapWidth: '1',
            mapHeight: '1'
        }
        this.createNewGame = this.createNewGame.bind(this);
    }
    updateFields(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }
    createNewGame() {
        let { gameName, gameDescription, mapWidth, mapHeight } = this.state;
        gameName = gameName.trim();
        gameDescription = gameDescription.trim();
        if (gameName.length < 4)
            return this.props.createAlertMessage('Game name must be between 4 and 40 characters.')
        axios.post('/games/createNewGame', { gameName, gameDescription, mapWidth, mapHeight }).then(res => {
            this.props.createAlertMessage('New game created.');
            this.props.history.push('/MyGames');
        }).catch(err => {if (err.response) this.props.createAlertMessage(err.response.data)});
    }
    render() {
        return (
            <div className="CreateGame">
                <h2>Create New Game</h2>
                {this.props.isAuthenticated ?
                    <div className="new-game-fields">
                        <div>Game Name:<br />(4 - 40 Characters)</div>
                        <div><input type="text" maxLength="40" name="gameName" onChange={e => this.updateFields(e)} value={this.state.gameName} /></div>
                        <div>Game Description:<br />(Max 400 Characters)</div>
                        <div><textarea maxLength="400" name="gameDescription" onChange={e => this.updateFields(e)} value={this.state.gameDescription}></textarea></div>
                        <div>Map Width:</div>
                        <div>
                            <select name="mapWidth" value={this.state.mapWidth} onChange={e => this.updateFields(e)}>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                                <option value="11">11</option>
                                <option value="12">12</option>
                                <option value="13">13</option>
                                <option value="14">14</option>
                                <option value="15">15</option>
                            </select>
                        </div>
                        <div>Map Height:</div>
                        <div>
                            <select name="mapHeight" value={this.state.mapHeight} onChange={e => this.updateFields(e)}>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                                <option value="11">11</option>
                                <option value="12">12</option>
                                <option value="13">13</option>
                                <option value="14">14</option>
                                <option value="15">15</option>
                            </select>
                        </div>
                        <div></div>
                        <div>
                            <button onClick={this.createNewGame}>Create New Game</button>
                        </div>
                    </div>
                :
                    <div>You must be logged in to create a new game. Please log in, or click <Link to="/register">here</Link> to register a new account.</div>
                }
            </div>
        )
    }
}

const mapStateToProps = state => {
    const { isAuthenticated } = state;
    return {
        isAuthenticated
    }
}

export default connect(mapStateToProps, { createAlertMessage })(CreateGame);