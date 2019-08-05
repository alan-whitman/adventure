import React from 'react';
import './reset.css';
import './App.css';

import Menu from './components/Menu/Menu';
import Header from './components/Header/Header';
import MapEditor from './components/MapEditor/MapEditor';
import LandingPage from './components/LandingPage/LandingPage';

import { HashRouter, Switch, Route } from 'react-router-dom';

function App() {
    return (
        <HashRouter>
            <div className="App">
                <Header />
                <div className="main-holder">
                    <Menu />
                    <Switch>
                        <Route path="/MapEditor" component={MapEditor} />
                        <Route path="/" component={LandingPage} />
                    </Switch>
                </div>
            </div>
        </HashRouter>
    );
}

export default App;
