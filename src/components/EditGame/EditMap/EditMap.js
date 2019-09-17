import React, { Component } from 'react';
import './EditMap.css';

import { connect } from 'react-redux';
import { createAlertMessage } from '../../../redux/reducer';

import Room from './Room/Room';

import { Link } from 'react-router-dom';

import axios from 'axios';

class EditMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomRenderSize: 0,
            activeRooms: [],
            pathData: [],
            maxX: props.currentGame.map_width,
            maxY: props.currentGame.map_height,
            popupX: 0,
            popupY: 0,
            popupRoomX: 0,
            popupRoomY: 0,
            popupRoomId: -1,
            popupRoomActive: false,
            showPopup: false
        }
        this.renderRooms = this.renderRooms.bind(this);
        this.showPopup = this.showPopup.bind(this);
        this.clearPopup = this.clearPopup.bind(this);
        this.createRoom = this.createRoom.bind(this);
        this.mapWindowRef = React.createRef();
    }
    componentDidMount() {
        const { maxX } = this.state;
        let roomRenderSize = Math.floor(this.mapWindowRef.current.clientWidth / maxX);
        if (roomRenderSize > 120)
            roomRenderSize = 120;
        this.setState({ roomRenderSize });
        axios.get('/editGames/getRooms/' + this.props.currentGame.game_id).then(res => {
            this.setState({activeRooms: res.data});
        }).catch(err => {if (err.response) this.props.createAlertMessage(err.response.data)});
    }
    showPopup(e, roomX, roomY, activeRoomIndex) {
        this.setState({
            popupX: e.clientX,
            popupY: e.clientY,
            showPopup: !this.state.showPopup,
            popupRoomX: roomX,
            popupRoomY: roomY,
            popupRoomActive: activeRoomIndex === -1 ? false : true
        })
    }
    clearPopup() {
        if (this.state.showPopup)
            this.setState({
                showPopup: false,
                popupX: 0,
                popupY: 0,
                popupRoomX: 0,
                popupRoomY: 0,
                popupRoomActive: false,
            })
    }
    createRoom() {
        let { activeRooms, popupRoomX, popupRoomY } = this.state;
        const existingRoomIndex = activeRooms.findIndex(room => room.room_x === popupRoomX && room.room_y === popupRoomY);
        if (existingRoomIndex !== -1)
            return this.createAlertMessage('Weird error, room is already active.')
        axios.post('/editGames/createRoom', {roomX: popupRoomX, roomY: popupRoomY, gameId: this.props.currentGame.game_id}).then(res => {
            this.setState({activeRooms: res.data});
            this.props.createAlertMessage('New room created.');
        }).catch(err => {if (err.response) this.props.createAlertMessage(err.response.data)});
    }
    deleteRoom() {

    }
    renderRooms() {
        const { maxX, maxY, roomRenderSize, pathData, activeRooms } = this.state;
        let rooms = []
        for (let y = 1; y <= maxY; y++) {
            let row = [];
            for (let x = 1; x <= maxX; x++) {
                let activeRoomIndex = activeRooms.findIndex(room => room.room_x === x && room.room_y === y);
                row.push(
                    <Room
                        activeRoomIndex={activeRoomIndex}
                        key={'x' + x + 'y' + y}
                        roomRenderSize={roomRenderSize}
                        showPopup={this.showPopup}
                        roomX={x}
                        roomY={y}
                        roomName={activeRoomIndex !== -1 ? activeRooms[activeRoomIndex].roomName : ''}
                    />
                )
                if (x < (maxX)) {
                    const pathNode = '' + x + y + (x + 1) + y;
                    let pathClass = 'horpath '
                    pathClass += pathData.indexOf(pathNode) !== -1 ? 'activehorpath' : 'inactivehorpath'
                    row.push(
                        <div
                            className={pathClass}
                            key={'horpath' + x + y}
                        >
                            <div style={{
                                width: Math.floor(roomRenderSize * .2),
                                height: Math.floor(roomRenderSize * .15),
                            }} />
                        </div>

                    )
                }
            }
            rooms.push(
                <div className="roomrow" key={'row' + y}
                    style={{
                        marginLeft: Math.floor(roomRenderSize * .1),
                        height: Math.floor(roomRenderSize * .8)
                    }}
                >
                    {row}
                </div>
            );
            if (y < (maxY)) {
                let vertRow = []
                for (let vertCount = 0; vertCount < maxX; vertCount++) {
                    const pathNode = '' + vertCount + y + vertCount + (y + 1);
                    let pathClass = 'vertpath ';
                    pathClass += pathData.indexOf(pathNode) !== -1 ? 'activevertpath' : 'inactivevertpath'
                    vertRow.push(
                        <div
                            className="vertpathholder"
                            style={{
                                width: Math.floor(roomRenderSize * .8),
                                // width: roomRenderSize - 1,
                                height: Math.floor(roomRenderSize * .2)
                            }}
                            key={'vertpathholder' + vertCount + y}
                        >
                            <div
                                className={pathClass}
                                style={{
                                    width: Math.floor(roomRenderSize * .15)
                                }}
                            />
                        </div>
                    )
                    vertRow.push(
                        <div className="vertrow-spacer" 
                            style={{
                                width: Math.floor(roomRenderSize * .2),
                            }}
                            key={'vertrowspacer' + vertCount + y} 
                        />
                    )
                }
                rooms.push(
                    <div
                        className="vertpathrow"
                        key={'vertpathrow' + y}
                        style={{
                            marginLeft: Math.floor(roomRenderSize * .1),
                            height: Math.floor(roomRenderSize * .2),
                        }}
                    >
                        {vertRow}
                    </div>
                )
            }
        }
        return rooms;
    }
    render() {
        const { showPopup, popupX, popupY, popupRoomId } = this.state;
        return (
            <div className="EditMap" ref={this.mapWindowRef} onClick={this.clearPopup}>
                <div className="room-popup" style={{ display: showPopup ? 'block' : 'none', top: popupY, left: popupX }}>
                    {this.state.popupRoomActive ?
                        <div onClick={this.deleteRoom}>Delete Room</div>
                    :
                        <div onClick={this.createRoom}>Create Room</div>
                    }
                    <Link to={'/EditGame/' + this.props.currentGame.game_id + '/Editroom/' + popupRoomId}>Edit room</Link>
                </div>

                <h2>Edit Map</h2>
                <div className="rooms">
                    {this.state.roomRenderSize && this.renderRooms()}
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

export default connect(mapStateToProps, { createAlertMessage })(EditMap);