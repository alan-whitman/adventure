import React, { Component } from 'react';
import './EditGame.css'

class EditGame extends Component {
    render() {
        return (
            <div className="EditGame">
                <h2>Edit Game</h2>
                <p>Game Id: {this.props.match.params.gameId}</p>
            </div>
        )
    }
}

export default EditGame;