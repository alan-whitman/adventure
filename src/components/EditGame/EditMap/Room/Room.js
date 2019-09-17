import React, { PureComponent } from 'react';
import './Room.css';

class Room extends PureComponent {
    render() {
        const { activeRoomIndex } = this.props;
        return (
            <div
                className={activeRoomIndex !== -1 ? 'activeroom room' : 'inactiveroom room'}
                style={{
                    width: Math.floor(this.props.roomRenderSize * .8),
                    height: Math.floor(this.props.roomRenderSize * .8)
                }}
                onClick={e => this.props.showPopup(e, this.props.roomX, this.props.roomY, activeRoomIndex)}
            />
        )
    }
}

export default Room;