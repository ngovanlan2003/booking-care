import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Modal,  ModalHeader, ModalBody, ModalFooter, Button} from 'reactstrap';
import { emitter } from '../../utils/emitter'
import _ from 'lodash'

class ModalEditUser extends Component {

    constructor(props) {
        super(props)
        this.state = {
            id: '',
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: ''
        }

    }
    
    componentDidMount() {
        let user = this.props.currentUser
        if(user && !_.isEmpty(user)) {
            this.setState({
                id: user.id,
                email: user.email,
                password: "hard code",
                firstName: user.firstName,
                lastName: user.lastName,
                address: user.address
            })
        }
    }

    toggle = () => {
        this.props.toggleFromParent()
    }

    handelOnchangeInput = (e, id) => {
        let copyState = {...this.state}
        copyState[id] = e.target.value
        this.setState({
            ...copyState
        })
    }

    checkValidateInput = () => {
        let isValid = true
        let arrInput = ['email', 'password', 'firstName', 'lastName', 'address']
        for(let i = 0; i < arrInput.length; i++) {
            if(!this.state[arrInput[i]]) {
                isValid = false
                alert("Chưa nhập: " + arrInput[i] + " kìa ông nội")
                break;
            }
        }
        return isValid
    }

    handleSaveUser = () => {
        let isValid = this.checkValidateInput()
        if(isValid) {
           this.props.editUser(this.state)
        }
    }

    render() {
        return (
            <Modal 
                isOpen={this.props.isOpen} 
                toggle={() => this.toggle()} 
                className={"modal-user-container"}
                size="lg"
                centered
            >
                <ModalHeader toggle={() => this.toggle()}>Edit a User</ModalHeader>
                <ModalBody>
                    <div className='modal-user-body'>
                        <div className='input-container'>
                            <label>Email</label>
                            <input type='text' 
                            value= {this.state.email}
                            disabled
                            onChange={(e) => this.handelOnchangeInput(e, "email")}
                            />
                        </div>
                        <div className='input-container'>
                            <label>Password</label>
                            <input type='password'
                              value= {this.state.password}
                              disabled
                              onChange={(e) => this.handelOnchangeInput(e, "password")}
                            />
                        </div>
                    </div>
                    <div className='modal-user-body'>
                        <div className='input-container'>
                            <label>First Name</label>
                            <input type='text'
                              value= {this.state.firstName}
                              onChange={(e) => this.handelOnchangeInput(e, "firstName")}
                            />
                        </div>
                        <div className='input-container'>
                            <label>Last Name</label>
                            <input type='text'
                              value= {this.state.lastName}
                              onChange={(e) => this.handelOnchangeInput(e, "lastName")}
                            />
                        </div>
                    </div>
                    <div className='modal-user-body'>
                        <div className='input-container'>
                            <label>Address</label>
                            <input type='text'
                              value= {this.state.address}
                              onChange={(e) => this.handelOnchangeInput(e, "address")}
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" className='px-3' 
                        onClick={() => this.handleSaveUser()}>
                        Save changes
                    </Button>
                    <Button variant="secondary" className='px-3' 
                        onClick={() => this.toggle()}>
                        Close
                    </Button> 
                </ModalFooter>
            </Modal>
        )
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditUser);

    
   