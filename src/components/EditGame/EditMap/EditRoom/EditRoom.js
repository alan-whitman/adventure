import React, { Component } from 'react';
import './EditRoom.css';

import { connect } from 'react-redux';
import { createAlertMessage } from '../../../../redux/reducer';

import axios from 'axios';

class EditRoom extends Component {
    constructor() {
        super();
        this.state = {
            newName: '',
            newDescription: '',
            existingName: '',
            existingDescription: '',
            editName: '',
            editDescription: ''
        }
        this.cancelChanges = this.cancelChanges.bind(this);
    }
    componentDidMount() {
        const { game_id } = this.props.currentGame;
        const { roomId } = this.props.match.params;
        axios.post('/editGames/getRoom', { gameId: game_id, roomId }).then(res => {
            const room = res.data;
            this.setState({
                newName: room.room_name,
                existingName: room.room_name,
                newDescription: room.room_description,
                existingDescription: room.room_description
            });
        }).catch(err => { if (err.response) this.props.createAlertMessage(err.response.data) });
    }
    saveChanges() {

    }
    cancelChanges() {
        const { existingDescription, existingName } = this.state
        this.setState({
            newName: existingName,
            newDescription: existingDescription,
            editName: false,
            editDescription: false
        })
    }
    updateFields(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }
    render() {
        return (
            <div className="EditRoom">
                <h2>Edit Room</h2>

                <div className="edit-fields">
                    <div>Room Name:<br />(4 - 40 Characters)</div>
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
                    <div>Room Description:<br />(Max 400 Characters)</div>
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
                    <div></div>
                    <div className="edit-buttons">
                        <button onClick={this.saveChanges}>Save Changes</button>
                        <button onClick={this.cancelChanges}>Cancel Changes</button>
                    </div>
                    <div></div>
                </div>
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

export default connect(mapStateToProps, { createAlertMessage })(EditRoom);