import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import './Header.css';

import { connect } from 'react-redux';
import { userLoggedIn, userLoggedOut, createAlertMessage } from '../../redux/reducer';


class Header extends Component {
    constructor() {
        super()
        this.state = {
            showLogin: false,
            showRegister: false,
            username: '',
            password: '',
        }
        this.logout = this.logout.bind(this);
        this.login = this.login.bind(this);
    }
    updateFields(e) {
        const { name, value } = e.target
        this.setState({ [name]: value });
    }
    login() {
        const { username, password } = this.state;
        if (username.trim() === '' || password.trim() === '')
            return this.props.createAlertMessage('You must enter a username and password.');
        axios.post('/auth/login', { username, password }).then(res => {
            this.props.userLoggedIn(res.data);
            this.setState({ username: '', password: '' })
        }).catch(err => {
            if (err.response)
                this.props.createAlertMessage(err.response.data);
        });
    }
    logout() {
        axios.get('/auth/logout').then(res => {
            this.props.userLoggedOut()
        });
    }
    render() {
        return (
            <div className="Header">
                <h4><Link to="/">Adventure Builder</Link></h4>
                <div className="auth-bar">
                    {this.props.isAuthenticated ?
                        <div className="logged-in">
                            <span>{this.props.user.username}</span>
                            <Link to="/settings"><i className="fas fa-cog"></i></Link>
                        </div>
                        :
                        this.state.showLogin ?
                            <div className="login-fields">
                                <span>Username:</span>
                                <input
                                    type="text"
                                    name="username"
                                    value={this.state.username}
                                    onChange={e => this.updateFields(e)}
                                    onKeyPress={e => {if (e.key === 'Enter') this.login()}}
                                />
                                <span>Password:</span>
                                <input
                                    type="password"
                                    name="password"
                                    value={this.state.password}
                                    onChange={e => this.updateFields(e)}
                                    onKeyPress={e => {if (e.key === 'Enter') this.login()}}
                                />
                                <button onClick={this.login}>Login</button>
                                <button onClick={e => this.setState({ showLogin: false })}>Cancel</button>
                            </div>
                            :
                            <div className="login-register">
                                <button onClick={e => this.setState({ showLogin: true })}>Login</button>
                                <Link to="/register">Register</Link>
                            </div>

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

export default connect(mapStateToProps, { userLoggedIn, userLoggedOut, createAlertMessage })(Header);