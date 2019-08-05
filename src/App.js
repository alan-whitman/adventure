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
                    <Header />
                    <div className="main-holder">
                        <Menu />
                        <Switch>
                            <Route path="/MapEditor" component={MapEditor} />
                            <Route path="/Register" component={Register} />
                            <Route path="/" component={LandingPage} />
                        </Switch>
                    </div>
                </div>
            </HashRouter>
        )
    }
}

export default connect(null, { userLoggedIn})(App);
