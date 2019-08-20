import React, { Component } from 'react';
import './MyGames.css';

import axios from 'axios';

import { connect } from 'react-redux'

import { Link } from 'react-router-dom';

class MyGames extends Component {
    constructor() {
        super();
        this.state = {
            myGames: []
        }
        this.renderGames = this.renderGames.bind(this);
    }
    componentDidMount() {
        if (this.props.isAuthenticated) {
            axios.get('/games/myGames').then(res => {
                this.setState({ myGames: res.data })
            }).catch(err => console.log(err));
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.isAuthenticated && prevProps.isAuthenticated !== this.props.isAuthenticated) {
            axios.get('/games/myGames').then(res => {
                this.setState({ myGames: res.data })
            }).catch(err => console.log(err));
        }
    }
    renderGames() {
        return this.state.myGames.map(game =>
            <div key={this.props.user.user_id + '|' + game.game_name} className="game-listing">
                <div className="game-name"><Link to={'/EditGame/' + game.game_id}>{game.game_name}</Link></div>
                <div className="game-description"><Link to={'/EditGame/' + game.game_id}>{game.game_description}</Link></div>
            </div>
        );
    }
    render() {
        return (
            <div className="MyGames">
                <div className="my-games-header">
                    <h2>My Games</h2>
                    <Link to="/CreateGame" className="button-link">Create New Game</Link>
                </div>
                {this.props.isAuthenticated ?
                    this.renderGames()
                :
                    <div>You must be logged in to view your games. Please log in, or click <Link to="/register">here</Link> to register a new account.</div>
                }
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

export default connect(mapStateToProps)(MyGames);