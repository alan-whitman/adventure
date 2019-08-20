import React, { Component } from 'react';
import './reset.css';
import './App.css';

import { connect } from 'react-redux';
import { userLoggedIn } from './redux/reducer'

import Menu from './components/Menu/Menu';
import Header from './components/Header/Header';
import MapEditor from './components/MapEditor/MapEditor';
import LandingPage from './components/LandingPage/LandingPage';
import Register from './components/Register/Register'
import Settings from './components/Settings/Settings'
import MyGames from './components/MyGames/MyGames'
import EditGame from './components/EditGame/EditGame';
import CreateGame from './components/CreateGame/CreateGame';
import UserAlert from './components/UserAlert/UserAlert';

import { HashRouter, Switch, Route } from 'react-router-dom';
import axios from 'axios';

class App extends Component {
    componentDidMount() {
        axios.get('/auth/currentUser').then(res => {
            if (res.data.username)
                this.props.userLoggedIn(res.data);
        });
    }
    render() {
        return (
            <HashRouter>
                <div className="App">
                    <UserAlert />
                    <Header />
                    <div className="main-holder">
                        <Menu />
                        <Switch>
                            <Route path="/MapEditor" component={MapEditor} />
                            <Route path="/Register" component={Register} />
                            <Route path="/Settings" component={Settings} />
                            <Route path="/MyGames" component={MyGames} />
                            <Route path="/CreateGame" component={CreateGame} />
                            <Route path="/EditGame/:gameId" component={EditGame} />
                            <Route path="/" component={LandingPage} />
                        </Switch>
                    </div>
                </div>
            </HashRouter>
        )
    }
}

export default connect(null, { userLoggedIn})(App);
