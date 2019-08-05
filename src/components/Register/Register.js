import React, { Component } from 'react';
import axios from 'axios';
import './Register.css';

import stringIsValid from '../../utils/stringIsValid';

import { connect } from 'react-redux';
import { userLoggedIn } from '../../redux/reducer';


class Register extends Component {
    constructor() {
        super();
        this.state = {
            username: '',
            usernameValid: false,
            password: '',
            passwordValid: false,
            confirmPassword: '',
            confirmPasswordValid: false
        }
        this.submitRegistration = this.submitRegistration.bind(this);
    }
    updateFields(e) {
        const { name, value } = e.target;
        switch (name) {
            case 'username':
                if (stringIsValid(value, /[^a-zA-Z0-9]/, 6, 24))
                    return this.setState({ [name]: value, usernameValid: true });
                else
                    return this.setState({ [name]: value, usernameValid: false });
            case 'password':
                if (stringIsValid(value, /[^a-zA-Z0-9_@#$%^&*!?.]/, 8, 54) && value === this.state.confirmPassword)
                    return this.setState({ [name]: value, passwordValid: true, confirmPasswordValid: true })
                else
                    return this.setState({ [name]: value, passwordValid: false, confirmPasswordValid: false })

            case 'confirmPassword':
                if (stringIsValid(value, /[^a-zA-Z0-9_@#$%^&*!?.]/, 8, 54) && value === this.state.password)
                    return this.setState({ [name]: value, confirmPasswordValid: true, passwordValid: true })
                else
                    return this.setState({ [name]: value, confirmPasswordValid: false, passwordValid: false })
            default:
                return;
        }

    }
    submitRegistration() {
        const { username, usernameValid, password, passwordValid, confirmPasswordValid } = this.state;
        if (!usernameValid || !passwordValid || !confirmPasswordValid)
            return console.log('invalid inputs');
        else {
            console.log('inputs valid');
            axios.post('/auth/register', { username, password }).then(res => {
                this.props.userLoggedIn(res.data);
            }).catch(err => console.log(err));
        }
    }
    render() {
        console.log(this.props)
        if (!this.props.isAuthenticated)
            return (
                <div className="Register">
                    <h2>Register</h2>
                    <div>Username: (alphnumeric only, 6 character minimum)</div>
                    <div>
                        <input type="text" name="username" value={this.state.username} onChange={e => this.updateFields(e)} />
                        {this.state.username && this.state.usernameValid ? <i className="fas fa-check"></i> : this.state.username ? <i className="fas fa-times"></i> : null}
                    </div>
                    <div>Password: (alphanumeric characters plus _@#$%^&*!?., 8 character minimum)</div>
                    <div>
                        <input type="password" name="password" value={this.state.password} onChange={e => this.updateFields(e)} />
                        {this.state.password && this.state.passwordValid ? <i className="fas fa-check"></i> : this.state.password ? <i className="fas fa-times"></i> : null}
                    </div>
                    <div>Confirm Password:</div>
                    <div>
                        <input type="password" name="confirmPassword" value={this.state.confirmPassword} onChange={e => this.updateFields(e)} />
                        {this.state.confirmPassword && this.state.confirmPasswordValid ? <i className="fas fa-check"></i> : this.state.confirmPassword ? <i className="fas fa-times"></i> : null}
                    </div>
                    <div><button onClick={this.submitRegistration}>Submit</button></div>
                </div>
            )
        else
            return (
                <div className="Register">
                    <h3>You are already logged in.</h3>
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

export default connect(mapStateToProps, { userLoggedIn })(Register);