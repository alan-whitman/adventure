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
            activePaths: [],
            maxX: props.currentGame.map_width,
            maxY: props.currentGame.map_height,

            roomPopupMouseX: 0,
            roomPopupMouseY: 0,
            roomPopupRoomX: 0,
            roomPopupRoomY: 0,
            roomPopupId: -1,
            roomPopupActive: false,
            roomPopupShow: false,

            pathPopupMouseX: 0,
            pathPopupMouseY: 0,
            pathPopupX1: 0,
            pathPopupX2: 0,
            pathPopupY1: 0,
            pathPopupY2: 0,
            pathPopupId: -1,
            pathPopupShow: false,
            pathPopupActive: false
        }
        this.displayRoomPopup = this.displayRoomPopup.bind(this);
        this.clearPopups = this.clearPopups.bind(this);
        this.createRoom = this.createRoom.bind(this);
        this.deleteRoom = this.deleteRoom.bind(this);
        this.createPath = this.createPath.bind(this);
        this.deletePath = this.deletePath.bind(this);

        this.renderRooms = this.renderRooms.bind(this);
        this.mapWindowRef = React.createRef();
    }
    componentDidMount() {
        const { maxX } = this.state;
        let roomRenderSize = Math.floor(this.mapWindowRef.current.clientWidth / maxX);
        if (roomRenderSize > 120)
            roomRenderSize = 120;
        this.setState({ roomRenderSize });
        axios.get('/editGames/getMapData/' + this.props.currentGame.game_id).then(res => {
            this.setState({ activeRooms: res.data.rooms, activePaths: res.data.paths });
        }).catch(err => { if (err.response) this.props.createAlertMessage(err.response.data) });
    }
    displayRoomPopup(e, roomX, roomY, activeRoomIndex, roomId) {
        this.setState({
            roomPopupMouseX: e.clientX,
            roomPopupMouseY: e.clientY,
            roomPopupShow: true,
            roomPopupRoomX: roomX,
            roomPopupRoomY: roomY,
            roomPopupActive: activeRoomIndex === -1 ? false : true,
            roomPopupId: roomId
        })
    }
    displayPathPopup(e, pathPopupX1, pathPopupY1, pathPopupX2, pathPopupY2, activePathIndex, pathPopupId) {
        this.setState({
            pathPopupMouseX: e.clientX,
            pathPopupMouseY: e.clientY,
            pathPopupX1,
            pathPopupY1,
            pathPopupX2,
            pathPopupY2,
            pathPopupShow: true,
            pathPopupId,
            pathPopupActive: activePathIndex === -1 ? false : true
        });
    }
    clearPopups() {
        if (this.state.roomPopupShow || this.state.pathPopupShow)
            this.setState({
                roomPopupShow: false,
                roomPopupMouseX: 0,
                roomPopupMouseY: 0,
                roomPopupRoomX: 0,
                roomPopupRoomY: 0,
                roomPopupActive: false,
                roomPopupId: -1,
                pathPopupMouseX: 0,
                pathPopupMouseY: 0,
                pathPopupX1: 0,
                pathPopupX2: 0,
                pathPopupY1: 0,
                pathPopupY2: 0,
                pathPopupId: -1,
                pathPopupShow: false,
                pathPopupActive: false
            })
    }
    createRoom() {
        let { activeRooms, roomPopupRoomX, roomPopupRoomY } = this.state;
        const existingRoomIndex = activeRooms.findIndex(room => room.room_x === roomPopupRoomX && room.room_y === roomPopupRoomY);
        if (existingRoomIndex !== -1)
            return this.createAlertMessage('Weird error, room is already active.')
        axios.post('/editGames/createRoom', { roomX: roomPopupRoomX, roomY: roomPopupRoomY, gameId: this.props.currentGame.game_id }).then(res => {
            this.setState({ activeRooms: res.data });
            this.props.createAlertMessage('New room created.');
        }).catch(err => { if (err.response) this.props.createAlertMessage(err.response.data) });
    }
    deleteRoom() {
        const { roomPopupId } = this.state;
        axios.post('/editGames/deleteRoom', { roomId: roomPopupId, gameId: this.props.currentGame.game_id }).then(res => {
            this.setState({ activeRooms: res.data });
            this.props.createAlertMessage('Room deleted.');
        }).catch(err => { if (err.response) this.props.createAlertMessage(err.response.data) });
    }
    createPath() {
        const { activeRooms, pathPopupX1, pathPopupX2, pathPopupY1, pathPopupY2 } = this.state;
        const room1Index = activeRooms.findIndex(room => room.room_x === pathPopupX1 && room.room_y === pathPopupY1);
        const room2Index = activeRooms.findIndex(room => room.room_x === pathPopupX2 && room.room_y === pathPopupY2);
        if (room1Index === -1 || room2Index === -1)
            return this.props.createAlertMessage('A path can only be created between two active rooms.');

        // CHECK FOR EXISTING PATH CLIENT SIDE BEFORE SENDING TO SERVER

        axios.post('/editGames/createPath', { x1: pathPopupX1, y1: pathPopupY1, x2: pathPopupX2, y2: pathPopupY2, gameId: this.props.currentGame.game_id }).then(res => {
            this.setState({ activePaths: res.data });
            this.props.createAlertMessage('Path created.');
        }).catch(err => { if (err.response) this.props.createAlertMessage(err.response.data) });
    }
    deletePath() {
        const { pathPopupId } = this.state;
        axios.post('/editGames/deletePath', { pathId: pathPopupId, gameId: this.props.currentGame.game_id }).then(res => {
            this.setState({ activePaths: res.data });
            this.props.createAlertMessage('Path deleted.')
        }).catch(err => { if (err.response) this.props.createAlertMessage(err.response.data) });
    }
    renderRooms() {
        const { maxX, maxY, roomRenderSize, activePaths, activeRooms } = this.state;
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
                    let pathClass = 'horpath '
                    // let isActivePath = activePaths.findIndex(path => path.x1 === x && path.y1 === y && path.x2 === x + 1 && path.y2 === y) !== -1 ? true : false;
                    const activePathIndex = activePaths.findIndex(path => path.x1 === x && path.y1 === y && path.x2 === x + 1 && path.y2 === y);
                    pathClass += activePathIndex !== -1 ? 'activehorpath' : 'inactivehorpath'
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
                                onClick={e => {
                                    this.displayPathPopup(e, x, y, x + 1, y, activePathIndex, activePathIndex !== -1 ? activePaths[activePathIndex].path_id : -1)
                                }}
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
                for (let vertCount = 1; vertCount <= maxX; vertCount++) {
                    let pathClass = 'vertpath ';
                    // let isActivePath = activePaths.findIndex(path => path.x1 === vertCount && path.y1 === y && path.x2 === vertCount && path.y2 === y + 1) !== -1 ? true : false;
                    const activePathIndex = activePaths.findIndex(path => path.x1 === vertCount && path.y1 === y && path.x2 === vertCount && path.y2 === y + 1)
                    pathClass += activePathIndex !== -1 ? 'activevertpath' : 'inactivevertpath';
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
                                onClick={e => {
                                    this.displayPathPopup(e, vertCount, y, vertCount, y + 1, activePathIndex, activePathIndex !== -1 ? activePaths[activePathIndex].path_id : -1)
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
        const { roomPopupShow, roomPopupMouseX, roomPopupMouseY, roomPopupId, roomPopupActive, pathPopupShow, pathPopupMouseX, pathPopupMouseY, pathPopupActive } = this.state;
        return (
            <div className="EditMap" ref={this.mapWindowRef} onClick={this.clearPopups}>
                <div className="popup" style={{ display: roomPopupShow ? 'block' : 'none', top: roomPopupMouseY, left: roomPopupMouseX }}>
                    {roomPopupActive ?
                        [
                            <div key={'delete room'} onClick={this.deleteRoom}>Delete Room</div>,
                            <Link key={'edit room'} to={'/EditGame/' + this.props.currentGame.game_id + '/Editroom/' + roomPopupId}>Edit room</Link>
                        ]
                        :
                        <div onClick={this.createRoom}>Create Room</div>
                    }
                </div>
                <div className="popup" style={{ display: pathPopupShow ? 'block' : 'none', top: pathPopupMouseY, left: pathPopupMouseX }}>
                    {pathPopupActive ?
                        <div onClick={this.deletePath}>Delete Path</div>
                        :
                        <div onClick={this.createPath}>Create Path</div>
                    }
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