import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";

import * as actions from "../../store/actions";
import './Login.scss';
import { FormattedMessage } from 'react-intl';
import { handleLoginApi } from '../../services/userService'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usename: '',
            password: '',
            isShowPassword: false,
            errMessage: ''
        } 
    }
    handleOnchangeUser = (e) => {
        this.setState({
            ...this.state,
            usename: e.target.value
        })
    }

    handleOnchangePassword =(e) => {
        this.setState({
            ...this.state,
            password: e.target.value
        })
    }

    handleLogin = async () => {
        this.setState({
            errMessage: ''
        })

        try {
            let data = await handleLoginApi(this.state.usename, this.state.password)
            if(data && data.errCode !== 0) {
                this.setState({
                    errMessage: data.message
                })
            }
            if(data && data.errCode === 0) {
                console.log("Login success");
                this.props.userLoginSuccess(data.user)
            }
        } catch (e) {
            console.log(e.response);
            if(e.response) {
                if(e.response.data) {
                    this.setState({
                        errMessage: e.response.data.message
                    })
                }
            }
        }
    }

    handleShowHidePassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword
        })
    }
    render() {
        return (
           <div className="login-background">
                <div className="login-container">
                    <div className="login-content">
                        <div className='col-12 text-center login-heading'>Login</div>
                        <div className='col-12 form-group'>
                            <label>Username:</label>
                            <input type='text' className='form-control' placeholder='Enter your username' value={this.state.usename}
                               onChange={(e) => this.handleOnchangeUser(e)}
                            />
                        </div>
                        <div className='col-12 form-group-input'>
                            <label>Password:</label>
                            <input type={this.state.isShowPassword ? "text" : "password"}  className='form-control' placeholder='Enter your password' value={this.state.password}
                               onChange={(e) => this.handleOnchangePassword(e)}
                            />
                            <span onClick={() => this.handleShowHidePassword()}>
                                <i className={this.state.isShowPassword ? "far fa-eye" : "fas fa-eye-slash"} ></i>
                            </span>
                        </div>
                        <div className='col-12' style={{color: 'red'}}>
                            {this.state.errMessage}
                        </div>
                        <div>
                            <button onClick={() => this.handleLogin()}>Submit</button>
                        </div>
                        <div className='col-12 help'>
                            <span>Forgot your password?</span>
                        </div>
                        <div className='col-12 text-center'>
                            <span>Or Login with:</span>
                        </div>
                        <div className='col-12 login-social text-center'>
                            <i className="fab fa-facebook-f facebook"></i>
                            <i className="fab fa-google google"></i>
                        </div>
                    </div>
                </div>
           </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        // userLoginFail: () => dispatch(actions.adminLoginFail()),
        userLoginSuccess: (userInfo) =>  dispatch(actions.userLoginSuccess(userInfo))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
