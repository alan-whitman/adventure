import React, { Component } from 'react';
import './EditMap.css';

import { connect } from 'react-redux'; 
import { createAlertMessage } from '../../../redux/reducer';

class EditMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomRenderSize: 0,
            roomData: [],
            pathData: [],
            maxX: props.currentGame.map_width,
            maxY: props.currentGame.map_height
        }
        this.renderRooms = this.renderRooms.bind(this);
        this.mapWindowRef = React.createRef();

    }
    componentDidMount() {
        const { maxX } = this.state;
        let roomRenderSize = Math.floor(this.mapWindowRef.current.clientWidth / maxX);
        if (roomRenderSize > 120)
            roomRenderSize = 120;
        this.setState({roomRenderSize});
    }
    renderRooms() {
        const { maxX, maxY, roomRenderSize, pathData, roomData } = this.state;
        let rooms= []
        for (let y = 1; y <= maxY; y++) {
            let row = [];
            for (let x = 1; x <= maxX; x++) {
                let activeRoomIndex = roomData.findIndex(room => room.x === x && room.y === y);
                row.push(
                    <div 
                        className={activeRoomIndex !== -1 ? 'activeroom room' : 'inactiveroom room'}
                        key={'x' + x + 'y' + y} 
                        style={{
                            width: Math.floor(roomRenderSize * .8),
                            height: Math.floor(roomRenderSize * .8)
                        }}
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
        return (
            <div className="EditMap" ref={this.mapWindowRef}>
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