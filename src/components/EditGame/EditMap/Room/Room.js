import React, { PureComponent } from 'react';
import './Room.css';

class Room extends PureComponent {
    render() {
        if (this.props.activeRoomIndex !== -1)
            console.log(this.props);
        const { activeRoomIndex } = this.props;
        return (
            <div
                className={activeRoomIndex !== -1 ? 'activeroom room' : 'inactiveroom room'}
                style={{
                    width: Math.floor(this.props.roomRenderSize * .8),
                    height: Math.floor(this.props.roomRenderSize * .8),
                    fontSize: Math.floor(this.props.roomRenderSize * .13)
                }}
                onClick={e => this.props.showPopup(e, this.props.roomX, this.props.roomY, activeRoomIndex)}
            >
                {this.props.roomName &&
                    <div
                        className="room-label"
                        style={{ height: Math.floor(this.props.roomRenderSize * .7) }}
                    >
                        {this.props.roomName}
                    </div>
                }
            </div>
        )
    }
}

export default Room;