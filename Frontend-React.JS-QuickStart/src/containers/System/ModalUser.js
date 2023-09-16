import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Modal,  ModalHeader, ModalBody, ModalFooter, Button} from 'reactstrap';
import { emitter } from '../../utils/emitter'

class ModalUser extends Component {

    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: ''
        }

        this.listenToEmitter()
    }
    listenToEmitter() {
        emitter.on("EVENT_CLEAR_MODAL_DATA", () => {
            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                address: ''
            })
        })
    }
    componentDidMount() {
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

    handleAddNewUser = () => {
        let isValid = this.checkValidateInput()
        if(isValid) {
           this.props.createNewUser(this.state)
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
                <ModalHeader toggle={() => this.toggle()}>Create a new user</ModalHeader>
                <ModalBody>
                    <div className='modal-user-body'>
                        <div className='input-container'>
                            <label>Email</label>
                            <input type='text' 
                            value= {this.state.email}
                            onChange={(e) => this.handelOnchangeInput(e, "email")}
                            />
                        </div>
                        <div className='input-container'>
                            <label>Password</label>
                            <input type='password'
                              value= {this.state.password}
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
                        onClick={() => this.handleAddNewUser()}>
                        Add new
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);

    
   