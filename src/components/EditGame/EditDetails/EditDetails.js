import React, { Component } from 'react';
import './EditDetails.css'

import { connect } from 'react-redux';
import { setGame, createAlertMessage } from '../../../redux/reducer';

import axios from 'axios';

class EditDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editName: false,
            editDescription: false,
            newName: props.currentGame.game_name,
            newDescription: props.currentGame.game_description,
            newMapWidth: props.currentGame.map_width,
            newMapHeight: props.currentGame.map_height
        }
        this.saveChanges = this.saveChanges.bind(this);
        this.cancelChanges = this.cancelChanges.bind(this);
    }
    saveChanges() {
        let { newName, newDescription, newMapWidth, newMapHeight } = this.state;
        newName = newName.trim();
        newDescription = newDescription.trim();
        if (newName.length < 4)
            return this.props.createAlertMessage('Game name must be between 4 and 40 characters.')
        axios.post('/editGames/editGameDetails', { newName, newDescription, newMapWidth, newMapHeight, gameId: this.props.currentGame.game_id }).then(res => {
            this.props.setGame(res.data);
            this.props.createAlertMessage('Game details successfully updated.');
        }).catch(err => {if (err.response) this.props.createAlertMessage(err.response.data)});
    }
    cancelChanges() {
        this.setState({
            newName: this.props.currentGame.game_name,
            newDescription: this.props.currentGame.game_description,
            newMapWidth: this.props.currentGame.map_width,
            newMapHeight: this.props.currentGame.map_height
        })
    }
    updateFields(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }
    render() {
        return (
            <div className="EditDetails">
                <h2>Edit Details</h2>
                <div className="edit-fields">
                    <div>Game Name:<br />(4 - 40 Characters)</div>
                    {this.state.editName ?
                        <div className="edit-name-field">
                            <input type="text" value={this.state.newName} name="newName" maxLength="40" onChange={e => this.updateFields(e)} />
                        </div>
                        :
                        <div className="edit-name-field">
                            <div>{this.state.newName}</div>
                        </div>
                    }
                    <div>
                        {this.state.editName ?
                            <i className="fas fa-save" onClick={e => this.setState({ editName: false })}></i>
                            :
                            <i className="fas fa-edit" onClick={e => this.setState({ editName: true })}></i>
                        }
                    </div>
                    <div>Game Description:<br />(Max 400 Characters)</div>
                    {this.state.editDescription ?
                        <div className="edit-description-field">
                            <textarea maxLength="400" name="newDescription" onChange={e => this.updateFields(e)} value={this.state.newDescription}></textarea>
                        </div>
                        :
                        <div className="edit-description-field">
                            <div>{this.state.newDescription}</div>
                        </div>
                    }
                    <div>
                        {!this.state.editDescription ?
                            <i className="fas fa-edit" onClick={e => this.setState({ editDescription: true })}></i>
                            :
                            <i className="fas fa-save" onClick={e => this.setState({ editDescription: false })}></i>
                        }
                    </div>
                    <div>Map Width:</div>
                    <div>
                        <select name="newMapWidth" value={this.state.newMapWidth} onChange={e => this.updateFields(e)}>
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
                    <div>Map Height:</div>
                    <div>
                        <select name="newMapHeight" value={this.state.newMapHeight} onChange={e => this.updateFields(e)}>
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
                    <div></div>
                    <div className="edit-buttons">
                        <button onClick={this.saveChanges}>Save Changes</button>
                        <button onClick={this.cancelChanges}>Cancel Changes</button>
                    </div>
                    <div></div>
                </div>
                <div>Note: Be exceptionally careful when changing map dimensions. Existing rooms outside the new values will be automatically deleted!</div>

            </div>
        )
    }
}

const mapStateToProps = state => {
    const { currentGame } = state;
    return {
        currentGame
    }
}

export default connect(mapStateToProps, { setGame, createAlertMessage })(EditDetails);