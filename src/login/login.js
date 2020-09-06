import React, { Component, Fragment } from 'react';
import './login.css';
import LandingPage from '../landingPage/landingPage';
import { MessageBox } from '../messageBox/messageBox';
import { ToastContainer } from 'react-toastify';
import { Button } from '@material-ui/core';

class Login extends Component {

    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            isPasswordValid: false,
            isEmailValid: false,
            isShowLandingPage: false
        }
    }

    handleFormSubmit = () => {
        if (this.state.isPasswordValid && this.state.isEmailValid) {
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            };
            let url = 'http://localhost:5000';
            fetch(`${url}/login/?email=${this.state.email}&&password=${this.state.password}`, requestOptions)
                .then(response => response.json())
                .then((response) => {
                    if (response.data) {
                        MessageBox(response.message, 'Success');
                        localStorage.setItem('roleName', response.roleName);
                        localStorage.setItem('userId', response.userId);
                        this.setState({ isShowLandingPage: true });
                    }
                    else {
                        MessageBox(response.message, 'Error');
                    }
                }).catch(err => console.log(err));
        }
    }

    onChangeInputFields(e, input) {
        let value = e.target.value;
        switch (input) {
            case 'email':
                {
                    let isEmailValid = false;
                    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    if (emailRegex.test(value)) {
                        isEmailValid = true;
                    }
                    this.setState({ email: value, isEmailValid });
                    break;
                }
            case 'password': {
                let isPasswordValid = false;
                if (value && value.length >= 5) {
                    isPasswordValid = true;
                }
                this.setState({ password: value, isPasswordValid });
                break;
            }
        }
    }

    render() {
        return (
            <Fragment>
                {!this.state.isShowLandingPage &&
                    <form className="loginForm">
                        <div className="signIn">
                            <h2 className="signInLabel">Sign In</h2>

                            <div className="inputDiv">
                                <label>Email address</label>
                                <input className="inputClassEmail" type="email" placeholder="Enter email" onChange={(e) => { this.onChangeInputFields(e, 'email') }} />
                            </div>

                            <div className="inputDiv">
                                <label>Password</label>
                                <input className="inputClassPass" type="password" placeholder="Enter password" onChange={(e) => { this.onChangeInputFields(e, 'password') }} />
                            </div>
                            <div className="inputDiv1">
                                <Button
                                    disabled={!this.state.isPasswordValid || !this.state.isEmailValid}
                                    className="loginButton" onClick={this.handleFormSubmit.bind(this)}>Login</Button>
                            </div>
                        </div>
                    </form>}
                {this.state.isShowLandingPage &&
                    <LandingPage />
                }
                <ToastContainer />
            </Fragment>
        );
    }
}

export default Login;