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
            pathData: [
                '2333',
                '1222',
                '1112',
                '2223',
                '3233',
                '3132',
                '3141'
            ],
            maxX: props.currentGame.map_width,
            maxY: props.currentGame.map_height,
            roomPopupX: 0,
            roomPopupY: 0,
            pathPopupX: 0,
            pathPopupY: 0,
            popupRoomX: 0,
            popupRoomY: 0,
            popupRoomId: -1,
            popupRoomActive: false,
            showRoomPopup: false,
            showPathPopup:false
        }
        this.renderRooms = this.renderRooms.bind(this);
        this.displayRoomPopup = this.displayRoomPopup.bind(this);
        this.clearRoomPopup = this.clearRoomPopup.bind(this);
        this.createRoom = this.createRoom.bind(this);
        this.deleteRoom = this.deleteRoom.bind(this);
        this.mapWindowRef = React.createRef();
    }
    componentDidMount() {
        const { maxX } = this.state;
        let roomRenderSize = Math.floor(this.mapWindowRef.current.clientWidth / maxX);
        if (roomRenderSize > 120)
            roomRenderSize = 120;
        this.setState({ roomRenderSize });
        axios.get('/editGames/getRooms/' + this.props.currentGame.game_id).then(res => {
            this.setState({ activeRooms: res.data });
        }).catch(err => { if (err.response) this.props.createAlertMessage(err.response.data) });
    }
    displayRoomPopup(e, roomX, roomY, activeRoomIndex, roomId) {
        this.setState({
            roomPopupX: e.clientX,
            roomPopupY: e.clientY,
            showRoomPopup: !this.state.showRoomPopup,
            popupRoomX: roomX,
            popupRoomY: roomY,
            popupRoomActive: activeRoomIndex === -1 ? false : true,
            popupRoomId: roomId
        })
    }
    clearRoomPopup() {
        if (this.state.showRoomPopup)
            this.setState({
                showRoomPopup: false,
                roomPopupX: 0,
                roomPopupY: 0,
                popupRoomX: 0,
                popupRoomY: 0,
                popupRoomActive: false,
                popupRoomId: -1
            })
    }
    displayPathPopup(e, pathCoords, pathIndex, pathId) {

    }
    createRoom() {
        let { activeRooms, popupRoomX, popupRoomY } = this.state;
        const existingRoomIndex = activeRooms.findIndex(room => room.room_x === popupRoomX && room.room_y === popupRoomY);
        if (existingRoomIndex !== -1)
            return this.createAlertMessage('Weird error, room is already active.')
        axios.post('/editGames/createRoom', { roomX: popupRoomX, roomY: popupRoomY, gameId: this.props.currentGame.game_id }).then(res => {
            this.setState({ activeRooms: res.data });
            this.props.createAlertMessage('New room created.');
        }).catch(err => { if (err.response) this.props.createAlertMessage(err.response.data) });
    }
    deleteRoom() {
        const { popupRoomId } = this.state;
        axios.post('/editGames/deleteRoom', { roomId: popupRoomId, gameId: this.props.currentGame.game_id }).then(res => {
            this.setState({ activeRooms: res.data });
            this.props.createAlertMessage('Room deleted.');
        }).catch(err => { if (err.response) this.props.createAlertMessage(err.response.data) });
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
                        displayRoomPopup={this.displayRoomPopup}
                        roomX={x}
                        roomY={y}
                        roomName={activeRoomIndex !== -1 ? activeRooms[activeRoomIndex].room_name : ''}
                        roomId={activeRoomIndex !== -1 ? activeRooms[activeRoomIndex].room_id : -1}
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
                            <div 
                                style={{
                                    width: Math.floor(roomRenderSize * .2),
                                    height: Math.floor(roomRenderSize * .15),
                                }}
                                onClick={e => console.log('clicking on path from ' + x + y + ' to ' + (x + 1) + y)}
                            />
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
        const { showRoomPopup, roomPopupX, roomPopupY, popupRoomId, showPathPopup, pathPopupX, pathPopupY } = this.state;
        return (
            <div className="EditMap" ref={this.mapWindowRef} onClick={this.clearRoomPopup}>
                <div className="popup" style={{ display: showRoomPopup ? 'block' : 'none', top: roomPopupY, left: roomPopupX }}>
                    {this.state.popupRoomActive ?
                        [
                            <div key={'delete room'} onClick={this.deleteRoom}>Delete Room</div>,
                            <Link key={'edit room'} to={'/EditGame/' + this.props.currentGame.game_id + '/Editroom/' + popupRoomId}>Edit room</Link>
                        ]
                        :
                        <div onClick={this.createRoom}>Create Room</div>
                    }
                </div>
                <div className="popup" style={{ display: showPathPopup ? 'block' : 'none', top: pathPopupY, left: pathPopupX }}>

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