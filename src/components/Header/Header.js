import React, { Component } from 'react';
import axios from 'axios';

import './Header.css';

import { connect } from 'react-redux';
import { userLoggedIn } from '../../redux/reducer';


class Header extends Component {
    constructor() {
        super()
        this.state = {
            showLogin: false,
            showRegister: false,
            loginUsername: '',
            loginPassword: '',
            registerUsername: '',
            registerPassword: '',
        }
    }
    updateFields(e) {
        const { name, value } = e.target
        this.setState({[name]: value});
    }
    componentDidUpdate() {
    }
    render() {
        return (
            <div className="Header">
                <h4>Adventure Builder</h4>
                <div className="auth-bar">
                    {this.props.isAuthenticated ? 
                        this.props.user.username
                    :
                        this.state.showLogin ?
                            <div className="login-fields">
                                <span>Username:</span>
                                <input 
                                    type="text"
                                    name="loginUsername" 
                                    value={this.state.loginUsername} 
                                    onChange={e => this.updateFields(e)}
                                />
                                <span>Password:</span> 
                                <input 
                                    type="password" 
                                    name="loginPassword" 
                                    value={this.state.loginPassword} 
                                    onChange={e => this.updateFields(e)} 
                                />
                                <button>Login</button> 
                                <button onClick={e => this.setState({showLogin: false})}>Cancel</button>
                            </div>
                        :
                            <button onClick={e => this.setState({showLogin: true})}>Login</button>
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    const { user, isAuthenticated } = state;
    return {
        user,
        isAuthenticated
    }    
}

export default connect(mapStateToProps, { userLoggedIn })(Header);