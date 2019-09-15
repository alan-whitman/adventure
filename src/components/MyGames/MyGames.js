import React, { Component } from 'react';
import './MyGames.css';

import axios from 'axios';

import { connect } from 'react-redux'
import { createAlertMessage } from '../../redux/reducer';

import { Link } from 'react-router-dom';

class MyGames extends Component {
    constructor() {
        super();
        this.state = {
            myGames: [],
            isLoading: true
        }
        this.renderGames = this.renderGames.bind(this);
    }
    componentDidMount() {
        if (this.props.isAuthenticated) {
            axios.get('/editGames/myGames').then(res => {
                this.setState({ myGames: res.data, isLoading: false })
            }).catch(err => {if (err.response) this.props.createAlertMessage(err.response.data)});
        } else {
            this.setState({isLoading: false});
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.isAuthenticated && prevProps.isAuthenticated !== this.props.isAuthenticated) {
            axios.get('/editGames/myGames').then(res => {
                this.setState({ myGames: res.data, isLoading: false })
            }).catch(err => {if (err.response) this.props.createAlertMessage(err.response.data)});
        }
    }
    renderGames() {
        let { myGames } = this.state;
        if (!myGames[0])
            return <div className="game-listing">No games to display. Click the "Create New Game" button in order to start creating!</div>
        if (this.props.match.params.sortOrder) {
            if (this.props.match.params.sortOrder === 'ByName')
                myGames.sort((a, b) => a.game_name < b.game_name ? -1 : 1);
            if (this.props.match.params.sortOrder === 'ByCreation')
                myGames.sort((a, b) => a.creation_time < b.creation_time ? -1 : 1);
            if (this.props.match.params.sortOrder === 'ByDescription')
                myGames.sort((a, b) => a.game_description < b.game_description ? -1 : 1);

        }
        return myGames.map(game => {
            let ts = new Date(game.creation_time * 1000);
            return (
                <div key={this.props.user.user_id + '|' + game.game_name} className="game-listing">
                    <div className="game-name"><Link to={'/EditGame/' + game.game_id}>{game.game_name}</Link></div>
                    <div className="game-description"><Link to={'/EditGame/' + game.game_id}>{game.game_description}</Link></div>
                    <div>{(ts.getMonth() + 1) + '-' + ts.getDate() + '-' + ts.getFullYear()}</div>
                </div>
            )
        });
    }
    render() {
        const componentLoadingStyles = !this.state.isLoading ? { animationName: 'fadeIn' } : { opacity: 0 };
        return (
            <div className="MyGames" style={componentLoadingStyles}>
                <div className="my-games-header">
                    <h2>My Games</h2>
                    <Link to="/CreateGame" className="button-link">Create New Game</Link>
                </div>
                {this.props.isAuthenticated &&
                    <div className="game-listing game-listing-header">
                        <div className="game-name"><Link to="/MyGames/ByName">Game Name</Link></div>
                        <div className="game-description"><Link to="/MyGames/ByDescription">Game Description</Link></div>
                        <div><Link to="/MyGames/ByCreation">Created On</Link></div>
                    </div>
                }
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

export default connect(mapStateToProps, { createAlertMessage })(MyGames);