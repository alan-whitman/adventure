import React, { Component }  from 'react';
import './MyGames.css';

import axios from 'axios';

import { connect } from 'react-redux'

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
                this.setState({myGames: res.data})
            }).catch(err => console.log(err));
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.isAuthenticated && prevProps.isAuthenticated !== this.props.isAuthenticated) {
            axios.get('/games/myGames').then(res => {
                this.setState({myGames: res.data})
            }).catch(err => console.log(err));
        }
    }
    renderGames() {
        return this.state.myGames.map(game =>
            <div key={this.props.user.user_id + '|' + game.game_name}>
                <div>{game.game_name}</div>
                <div>{game.game_description}</div>
                
            </div>
        );
    }
    render() {
        return (
            <div className="MyGames">
                <h2>My Games</h2>
                {this.renderGames()}
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