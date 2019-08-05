import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import './Header.css';

import { connect } from 'react-redux';
import { userLoggedIn, userLoggedOut } from '../../redux/reducer';


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
        this.setState({[name]: value});
    }
    componentDidMount() {
    }
    componentDidUpdate() {
    }
    login() {
        const { username, password } = this.state;
        console.log(username, password)
        axios.post('/auth/login', { username, password }).then(res => {
            this.props.userLoggedIn(res.data);
        }).catch(err => {
            if (err.response)
                console.log(err.response.data);
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
                <h4>Adventure Builder</h4>
                <div className="auth-bar">
                    {this.props.isAuthenticated ? 
                        <div>
                            <span>{this.props.user.username}</span>
                            <button onClick={this.logout}>Logout</button>
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
                                />
                                <span>Password:</span> 
                                <input 
                                    type="password" 
                                    name="password" 
                                    value={this.state.password} 
                                    onChange={e => this.updateFields(e)} 
                                />
                                <button onClick={this.login}>Login</button> 
                                <button onClick={e => this.setState({showLogin: false})}>Cancel</button>
                            </div>
                        :
                            <div className="login-register">
                                <button onClick={e => this.setState({showLogin: true})}>Login</button>
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

export default connect(mapStateToProps, { userLoggedIn, userLoggedOut })(Header);