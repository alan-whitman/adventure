import React, { Component } from 'react';
import './EditMap.css';

import { connect } from 'react-redux'; 
// import { createAlertMessage } from '../../../redux/reducer';

import Room from './Room/Room';

import { Link } from 'react-router-dom';

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
            popupRoomActive: false,
            showPopup: false,
            nextRoomId: 0
        }
        this.renderRooms = this.renderRooms.bind(this);
        this.showPopup = this.showPopup.bind(this);
        this.clearPopup = this.clearPopup.bind(this);
        this.toggleRoomActive = this.toggleRoomActive.bind(this);
        this.mapWindowRef = React.createRef();
    }
    componentDidMount() {
        const { maxX } = this.state;
        let roomRenderSize = Math.floor(this.mapWindowRef.current.clientWidth / maxX);
        if (roomRenderSize > 120)
            roomRenderSize = 120;
        this.setState({roomRenderSize});
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
    toggleRoomActive() {
        let { activeRooms, popupRoomX, popupRoomY, nextRoomId } = this.state;
        if (this.state.popupRoomActive) {
            activeRooms = activeRooms.filter(room => room.x !== popupRoomX || room.y !== popupRoomY);
        }
        else {
            activeRooms.push({
                name: 'temp name',
                x: popupRoomX,
                y: popupRoomY,
                id: nextRoomId
            });
        }
        this.setState({activeRooms, nextRoomId: nextRoomId + 1});
    }
    renderRooms() {
        const { maxX, maxY, roomRenderSize, pathData, activeRooms } = this.state;
        let rooms= []
        for (let y = 1; y <= maxY; y++) {
            let row = [];
            for (let x = 1; x <= maxX; x++) {
                let activeRoomIndex = activeRooms.findIndex(room => room.x === x && room.y === y);
                row.push(
                    <Room 
                        activeRoomIndex={activeRoomIndex} 
                        key={'x' + x + 'y' + y}
                        roomRenderSize={roomRenderSize}
                        showPopup={this.showPopup}
                        roomX={x}
                        roomY={y}
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
                            style={{
                                width: Math.floor(roomRenderSize * .2),
                                height: Math.floor(roomRenderSize * .15),
                                top: -(Math.floor(roomRenderSize * .35))
                            }}

                        />
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
                                width: roomRenderSize - 1,
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
                }
                rooms.push(
                    <div 
                        className="vertpathrow"
                        key={'vertpathrow' + y}
                        style={{
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
        const { showPopup, popupX, popupY } = this.state;
        return (
            <div className="EditMap" ref={this.mapWindowRef} onClick={this.clearPopup}>
                <div className="room-popup" style={{display: showPopup ? 'block' : 'none', top: popupY, left: popupX}}>
                    <div onClick={this.toggleRoomActive}>{this.state.popupRoomActive ? 'Make Room Inactive' : 'Make Room Active'}</div>
                    <Link to="/">Edit room</Link>
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

export default connect(mapStateToProps)(EditMap);