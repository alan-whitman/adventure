import React, { PureComponent } from 'react';
import './Room.css';

class Room extends PureComponent {
    render() {
        const { activeRoomIndex, roomX, roomY, roomId } = this.props;
        return (
            <div
                className={activeRoomIndex !== -1 ? 'activeroom room' : 'inactiveroom room'}
                style={{
                    width: Math.floor(this.props.roomRenderSize * .8),
                    height: Math.floor(this.props.roomRenderSize * .8),
                    fontSize: Math.floor(this.props.roomRenderSize * .13)
                }}
                onClick={e => this.props.displayRoomPopup(e, roomX, roomY, activeRoomIndex, roomId)}
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