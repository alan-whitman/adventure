import React, { Component } from 'react';
import './EditRoom.css';

class EditRoom extends Component {
    render() {
        return (
            <div className="EditRoom">
                Edit room with id: {this.props.match.params.roomId}
            </div>
        )
    }
}

export default EditRoom;