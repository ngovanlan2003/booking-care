import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManage.scss'
import {getAllUser, createNewUserService, deleteUser, editUserService} from '../../services/userService'
import ModalUser from './ModalUser';
import logger from 'redux-logger';
import ModalEditUser from './ModalEditUser';
import { emitter } from '../../utils/emitter'

class UserManage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arrUser: [],
            isOpenModal: false,
            isOpenModalEditUser: false,
            userEdit: {}
        }
    }
    state = {

    }

    async componentDidMount() {
       await this.getAllUserFromReact()
    }

    getAllUserFromReact = async () => {
        let response = await getAllUser('ALL')
        if(response && response.errCode === 0) {
            this.setState({
                arrUser: response.users
            })
        }
    }

    handleAddNewUser = () => {
        this.setState({
            isOpenModal: true
        })
    }

    toggleUserModal = () => {
        this.setState({
            isOpenModal: !this.state.isOpenModal
        })
    }

    toggleUserEditModal = () => {
        this.setState({
            isOpenModalEditUser: !this.state.isOpenModalEditUser
        })
    }

    createNewUser = async (data) => {
        try {
            let response = await createNewUserService(data)
            if(response && response.errCode !== 0) {
                alert(response.errMessage)
            }else {
                await this.getAllUserFromReact()
                this.setState({
                    isOpenModal: false
                })
                emitter.emit("EVENT_CLEAR_MODAL_DATA")
            }
        } catch (error) {
            console.log(error);
        }
    }

    handleDeleteUser = async (user) => {
        try {
            let response = await deleteUser(user.id)
            console.log(response);
            if(response && response.errCode !== 0) {
                alert(response.errMessage)
            }else {
                await this.getAllUserFromReact()
            }
        } catch (error) {
            console.log(error);
        }
    }

    handleEditUser = (user) => {
        this.setState({
            isOpenModalEditUser: true,
            userEdit: user
        })
    }

    doEditUser = async (user) => {
        try {
            let response = await editUserService(user)
            if(response && response.errCode === '0') {
                this.setState({
                    isOpenModalEditUser: false
                })
                await this.getAllUserFromReact()
            }else {
                alert(response.errMessage)
            }
        } catch (error) {
            console.log(error);
        }
    }
    render() {
        return (
            <div className="user-container">
                <ModalUser 
                    isOpen={this.state.isOpenModal}
                    toggleFromParent={this.toggleUserModal}
                    createNewUser={this.createNewUser}
                />
                {this.state.isOpenModalEditUser &&
                    <ModalEditUser 
                        isOpen={this.state.isOpenModalEditUser}
                        toggleFromParent={this.toggleUserEditModal}
                        currentUser={this.state.userEdit}
                        editUser={this.doEditUser}
                    />
                }
                <div className='title text-center'>Ngô Văn Lân</div>
                <div className='mx-1'>
                    <button className='btn btn-primary px-3'
                        onClick={() => this.handleAddNewUser()}
                    >
                        <i className='fas fa-plus px-1'></i>
                        Add new user
                    </button>
                </div>
                <div className='user-table mt-3 mx-1'>
                <table id="customers">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Address</th>
                            <th>Actions</th>
                        </tr>

                    </thead>
                    <tbody>
                        {this.state.arrUser && this.state.arrUser.map((item) => {
                            return (
                                <tr key={item.id}>
                                    <td>{item.email}</td>
                                    <td>{item.firstName}</td>
                                    <td>{item.lastName}</td>
                                    <td>{item.address}</td>
                                    <td>
                                        <button className='btn-edit'
                                            onClick={() => this.handleEditUser(item)}
                                        >
                                            <i className="fas fa-pencil-alt"></i>
                                            Edit
                                        </button>
                                        <button className='btn-delete' 
                                            onClick={() => this.handleDeleteUser(item)}>
                                            <i className="fas fa-trash"></i>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                         )})}
                    </tbody>
                    <tfoot></tfoot>
                    </table>
                </div>
            </div>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
