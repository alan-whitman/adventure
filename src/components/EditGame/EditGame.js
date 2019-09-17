import React, { Component } from 'react';
import './EditGame.css'

import EditDetails from './EditDetails/EditDetails';
import EditMap from './EditMap/EditMap';
import EditObjects from './EditObjects/EditObjects';
import EditVerbs from './EditVerbs/EditVerbs';
import EditRoom from './EditMap/EditRoom/EditRoom';
import GameInfo from './GameInfo/GameInfo';

import axios from 'axios';

import { connect } from 'react-redux'
import { createAlertMessage, setGame } from '../../redux/reducer';

import { Link, Switch, Route } from 'react-router-dom';

class EditGame extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: true
        }
    }
    componentDidMount() {
        axios.get('/editGames/getGame/' + this.props.match.params.gameId).then(res => {
            this.props.setGame(res.data);
            this.setState({ isLoading: false });
        }).catch(err => {
            if (err.response)
                this.props.createAlertMessage(err.response.data);
            this.setState({ game: {}, isLoading: false })
        });
    }
    componentDidUpdate(prevProps) {
        if (this.props.match.params.gameId !== prevProps.match.params.gameId) {
            axios.get('/editGames/getGame/' + this.props.match.params.gameId).then(res => {
                this.props.setGame(res.data);
                this.setState({ isLoading: false });
            }).catch(err => {
                if (err.response)
                    this.props.createAlertMessage(err.response.data);
                this.setState({ game: {}, isLoading: false })
            });
        }
    }
    render() {
        const { gameId } = this.props.match.params;
        return (
            <div className="EditGame">
                <div className="edit-menu">
                    <Link to={'/EditGame/' + gameId}>{this.props.currentGame.game_name ? this.props.currentGame.game_name : 'Name not found'}</Link>
                    <Link to={'/EditGame/' + gameId + '/EditDetails'}>Edit Details</Link>
                    <Link to={'/EditGame/' + gameId + '/EditMap'}>Edit Map</Link>
                    <Link to={'/EditGame/' + gameId + '/EditObjects'}>Edit Objects</Link>
                    <Link to={'/EditGame/' + gameId + '/EditVerbs'}>Edit Verbs</Link>
                </div>
                {!this.state.isLoading && this.props.currentGame.game_name ?
                    <Switch>
                        <Route path={'/EditGame/' + gameId + '/EditMap'} component={EditMap} />
                        <Route path={'/EditGame/' + gameId + '/EditObjects'} component={EditObjects} />
                        <Route path={'/EditGame/' + gameId + '/EditVerbs'} component={EditVerbs} />
                        <Route path={'/EditGame/' + gameId + '/EditDetails'} component={EditDetails} />
                        <Route path={'/EditGame/' + gameId + '/EditRoom/:roomId'} component={EditRoom} />
                        <Route path={'/EditGame/' + gameId} component={GameInfo} />
                    </Switch>
                : null}
            </div>
        )
    }
}

const mapStateToProps = state => {
    const { isAuthenticated, user, currentGame } = state;
    return {
        isAuthenticated,
        user,
        currentGame
    }
}

export default connect(mapStateToProps, { createAlertMessage, setGame })(EditGame);