import React, { Component } from 'react';
import './EditGame.css'

import axios from 'axios';

import { connect } from 'react-redux'
import { createAlertMessage } from '../../redux/reducer';

class EditGame extends Component {
    constructor() {
        super();
        this.game = {}
    }
    componentDidMount() {
        axios.get('/editGames/editGame/' + this.props.match.params.gameId).then(res => {

        }).catch(err => {if (err.response) this.props.createAlertMessage(err.response.data)});
    }
    componentDidUpdate(prevProps) {
        if (this.props.match.params.gameId !== prevProps.match.params.gameId) {
            axios.get('/editGames/editGame/' + this.props.match.params.gameId).then(res => {

            }).catch(err => {if (err.response) this.props.createAlertMessage(err.response.data)});    
        }
    }
    render() {
        return (
            <div className="EditGame">
                <h2>Edit Game</h2>
                <p>Game Id: {this.props.match.params.gameId}</p>
            </div>
        )
    }
}

const mapStateToProps = state => {
    const { isAuthenticated, user } = state;
    return {
        isAuthenticated,
        user
    }
}

export default connect(mapStateToProps, { createAlertMessage })(EditGame);