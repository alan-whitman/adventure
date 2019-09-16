import React, { Component } from 'react';
import './EditDetails.css'

import { connect } from 'react-redux';

class EditDetails extends Component {
    constructor(props) {
        super(props);
        console.log(props.currentGame)
        this.state = {
            editName: false,
            editDescription: false,
            newName: props.currentGame.game_name,
            newDescription: props.currentGame.game_description
        }
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
                            <input type="text" value={this.state.newName} name="newName" onChange={e => this.updateFields(e)} />
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
                        <div className="edit-description-field">edit</div>
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

export default connect(mapStateToProps)(EditDetails);