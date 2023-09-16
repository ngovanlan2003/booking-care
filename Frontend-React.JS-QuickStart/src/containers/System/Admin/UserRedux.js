import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import {getAllCodeService} from '../../../services/userService'
import { LANGUAGES, CRUD_ACTIONS, CommonUtils} from '../../../utils';
import * as actions from '../../../store/actions'
import './UserRedux.scss'
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import TableManageUser from './TableManageUser';

class UserRedux extends Component {

    constructor(props) {
        super(props)
        this.state = {
            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewImgURL: "",
            isOpen: false,

            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            gender: '',
            position: '',
            role: '',
            avatar: '',
            
            action: '',
            userEditId: ''
        }
    }

    async componentDidMount() {
        this.props.getGenderStart()
        this.props.getPositionStart()
        this.props.getRoleStart()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.genderRedux !== this.props.genderRedux) {
            let arrGenders = this.props.genderRedux
            this.setState({
                genderArr: arrGenders,
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : '',
            })
        }
        if(prevProps.roleRedux !== this.props.roleRedux) {
            let arrRoles = this.props.roleRedux
            this.setState({
                roleArr: arrRoles,
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : '',
            })
        }
        if(prevProps.positionRedux !== this.props.positionRedux) {
            let arrPositions = this.props.positionRedux
            this.setState({
                positionArr: arrPositions,
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : '',
            })
        }

        if(prevProps.listUsers !== this.props.listUsers) {
            let arrGenders = this.props.genderRedux
            let arrRoles = this.props.roleRedux
            let arrPositions = this.props.positionRedux

            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                address: '',
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : '',
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : '',
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : '',
                avatar: '',
                action: CRUD_ACTIONS.CREATE,
                previewImgURL: ''
            })
        }
    }

    handleOnchangeImg = async (event) => {
        let data = event.target.files
        let file = data[0]
        if(file) {
            let base64 = await CommonUtils.getBase64(file)
            let objectURL = URL.createObjectURL(file)
            this.setState({
                previewImgURL: objectURL,
                avatar: base64
            })
        }
    }

    handleClickImage = () => {
        if(!this.state.previewImgURL) return
        this.setState({
            isOpen: true
        })
    }

    checkValidateInput = () => {
        let isValid = true
        let arrCheck = ['email', 'password', 'firstName', 'lastName', 'phoneNumber', 'address']
        for(let i = 0; i < arrCheck.length; i++) {
            if(this.state[i] === '') {
                isValid = false
                alert('Còn thiếu kìa cu: ' + arrCheck[i])
                break
            }
        }
        return {

        }
    }

    onChangeInput = (event, id) => {
        let copyState = {...this.state}
        copyState[id] = event.target.value
        this.setState({
            ...copyState
        })
    }

    handleSaveUser = () => {
       
        let isValid = this.checkValidateInput()
        if(!isValid) return

        let {action} = this.state

        if(action === CRUD_ACTIONS.CREATE) {
            this.props.createNewUser({
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phoneNumber: this.state.phoneNumber,
                gender: this.state.gender,
                roleId: this.state.role,
                positionId: this.state.position,
                avatar: this.state.avatar
            })
        }
        if(action === CRUD_ACTIONS.EDIT) {
            this.props.editAUserRedux({
                id: this.state.userEditId,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phoneNumber: this.state.phoneNumber,
                gender: this.state.gender,
                roleId: this.state.role,
                positionId: this.state.position,
                avatar: this.state.avatar
            })
        }
    }

    handleEditUserFromParent = (user) => {
        let imageBase64 = ''
        if(user.image) {
            imageBase64 = new Buffer(user.image, 'base64').toString('binary')
        }

        this.setState({
            email: user.email,
            password: "Hard code",
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            address: user.address,
            gender: user.gender,
            role: user.roleId,
            position: user.positionId,
            avatar: '',
            previewImgURL: imageBase64,
            action: CRUD_ACTIONS.EDIT,
            userEditId: user.id
        })
    }
    render() {
        let genderArr = this.state.genderArr
        let roles = this.state.roleArr
        let positions = this.state.positionArr
        let lang = this.props.lang
        let isLoadingGender = this.props.isLoadingGender
        let {email, password, firstName, lastName, phoneNumber, address, gender, position, role, avatar} = this.state

        return (
            <div className='user-redux-container'>
                <div className='title'>
                    User Redux with Ngo Van Lan
                </div>
                <div>{isLoadingGender ? "...Loading" : ""}</div>
                <div className="user-redux-body" >
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12 my-3'><FormattedMessage id="manage-user.add"/></div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.email"/></label>
                                <input className='form-control' type='email' placeholder='Email'
                                    value={email} 
                                    onChange={(event) => this.onChangeInput(event, 'email')}
                                    disabled={this.state.action === CRUD_ACTIONS.EDIT ? true : false}
                                />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.password"/></label>
                                <input className='form-control' type='password' placeholder='Password'
                                    value={password} 
                                    onChange={(event) => this.onChangeInput(event, 'password')}
                                    disabled={this.state.action === CRUD_ACTIONS.EDIT ? true : false}
                                />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.firstName"/></label>
                                <input className='form-control' type='text' placeholder='First Name'
                                        value={firstName} 
                                        onChange={(event) => this.onChangeInput(event, 'firstName')}
                                />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.lastName"/></label>
                                <input className='form-control' type='text' placeholder='Last Name'
                                     value={lastName} 
                                     onChange={(event) => this.onChangeInput(event, 'lastName')}
                                />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.phoneNumber"/></label>
                                <input className='form-control' type='text' placeholder='Phone number'
                                      value={phoneNumber} 
                                      onChange={(event) => this.onChangeInput(event, 'phoneNumber')}
                                />
                            </div>
                            <div className='col-9'>
                                <label><FormattedMessage id="manage-user.address"/></label>
                                <input className='form-control' type='text' placeholder='Address'
                                      value={address} 
                                      onChange={(event) => this.onChangeInput(event, 'address')}
                                />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.gender"/></label>
                                <select className="form-control" 
                                    onChange={(event) => this.onChangeInput(event, 'gender')}
                                    value={gender}
                                >
                                    {genderArr && genderArr.length > 0 &&
                                            genderArr.map((item, index) => {
                                                return (
                                                    <option key={index} value={item.keyMap}>
                                                        {lang === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                        </option>

                                                )
                                        })
                                    } 
                                </select>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.position" /></label>
                                <select className="form-control" 
                                    onChange={(event) => this.onChangeInput(event, 'position')}
                                    value={position}
                                >
                                    {positions && positions.length > 0 &&
                                            positions.map((item, index) => {
                                                return (
                                                    <option key={index} value={item.keyMap}>
                                                        {lang === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                        </option>

                                                )
                                        })
                                    } 
                                     
                                </select>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.roleId"/></label>
                                <select className="form-control" 
                                    onChange={(event) => this.onChangeInput(event, 'role')}
                                    value={role}
                                >
                                    {roles && roles.length > 0 &&
                                            roles.map((item, index) => {
                                                return (
                                                    <option key={index} value={item.keyMap}>
                                                        {lang === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                        </option>

                                                )
                                        })
                                    } 
                                </select>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.image"/></label>
                                <div className='prewview-img-container'>
                                    <input id="prewviewImg" type='file' hidden
                                        onChange={(event) => this.handleOnchangeImg(event)}
                                    />
                                    <label className='label-upload' htmlFor="prewviewImg">Tải ảnh <i className='fas fa-upload'></i></label>
                                    <div className='preview-img'
                                        style={{backgroundImage: `url(${this.state.previewImgURL})`}}
                                        onClick={() => this.handleClickImage()}
                                    >
                                    
                                    </div>
                                   
                                </div>
                            </div>
                            <div className='col-12 my-3'>
                                <button className={this.state.action === CRUD_ACTIONS.EDIT ? "btn btn-warning" : 'btn btn-primary'}
                                    onClick={() => this.handleSaveUser()}
                                >
                                    {this.state.action === CRUD_ACTIONS.EDIT 
                                        ? 
                                            <FormattedMessage id="manage-user.edit"/>
                                        : 
                                            <FormattedMessage id="manage-user.save"/>
                                    }
                                </button>
                            </div>
                            <div className='col-12 my-5'>
                                <TableManageUser 
                                    handleEditUserFromParent={this.handleEditUserFromParent}
                                    action={this.state.action}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                    {this.state.isOpen === true &&
                    <Lightbox
                        mainSrc={this.state.previewImgURL}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                    />
                    }
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        lang: state.app.language,
        genderRedux: state.admin.genders,
        roleRedux: state.admin.roles,
        positionRedux: state.admin.positions,
        isLoadingGender: state.admin.isLoadingGender,
        listUsers: state.admin.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        getPositionStart: () => dispatch(actions.fetchPositionStart()),
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
        createNewUser: (data) => dispatch(actions.createNewUser(data)),
        fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
        editAUserRedux: (data) => dispatch(actions.EditAUser(data))
        // processLogout: () => dispatch(actions.processLogout()),
        // changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
