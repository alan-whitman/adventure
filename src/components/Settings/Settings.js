import React, { Component } from 'react';
import './Settings.css'

import { userLoggedOut, createAlertMessage } from '../../redux/reducer';

import { connect } from 'react-redux';

class Settings extends Component {
    constructor() {
        super();
        this.logout = this.logout.bind(this);
    }
    logout() {
        this.props.userLoggedOut();
    }
    render() {
        return (
            <div className="Settings">
                <h2>Settings</h2>
                {this.props.isAuthenticated &&
                    <button onClick={this.logout}>Logout</button>
                }
                <div>
                    <button onClick={() => this.props.createAlertMessage('test')}>Test</button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    const { isAuthenticated } = state;
    return {
        isAuthenticated
    }
}

export default connect(mapStateToProps, { userLoggedOut, createAlertMessage })(Settings);