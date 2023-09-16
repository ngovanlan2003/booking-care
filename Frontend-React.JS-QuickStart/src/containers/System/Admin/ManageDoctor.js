
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './ManageDoctor.scss'
import * as actions from '../../../store/actions'

import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';
import Select from 'react-select';
import { fetchAllDoctors } from '../../../store/actions';
import {CRUD_ACTIONS, LANGUAGES} from '../../..//utils'
import {getDetailInforDoctor} from "../../../services/userService"

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageDoctor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // save markdown table
            contentMarkdown: '',
            contentHTML: '',
            selectedDoctor: '',
            depcription: '',
            listDoctors: [],
            hasOldData: false,

            // save infor doctor table
            listPrice: [],
            listProvince: [],
            listPayment: [],
            listSpecialty: [],
            listClinic: [],
            selectedPrice: '',
            selectedPayment: '',
            selectedProvince: '',
            selectClinic: '',
            selectSpecialty: '',
            nameClinic: '',
            addressClinic: '',
            note: '',
            clinicId: '',
            specialty: ''
        }
    }
    
    componentDidMount() {
        this.props.fetchAllDoctors()
        this.props.getRequiredDoctorInfor()
    }

    buildDataInputSelect = (inputData, type) => {
        let result = []
        let {language} = this.props
        if(inputData && inputData.length > 0) {
            if(type === 'USERS') {
                inputData.map((item, index) => {
                    let object = {}
                    let labelVi = `${item.lastName} ${item.firstName}` 
                    let labelEn = `${item.firstName} ${item.lastName}`
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn
                    object.value = item.id
                    result.push(object)
                })
            }
            if(type === "PRICE") {
                inputData.map((item, index) => {
                    let object = {}
                    let labelVi = `${item.valueVi}  VND`
                    let labelEn = `${item.valueEn}  USD`
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn
                    object.value = item.keyMap
                    result.push(object)
                })
            }
            if(type === "PAYMENT") {
                inputData.map((item, index) => {
                    let object = {}
                    let labelVi = item.valueVi 
                    let labelEn = item.valueEn
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn
                    object.value = item.keyMap
                    result.push(object)
                })
            }
            if(type === "PROVINCE") {
                inputData.map((item, index) => {
                    let object = {}
                    let labelVi = item.valueVi 
                    let labelEn = item.valueEn
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn
                    object.value = item.keyMap
                    result.push(object)
                })
            }
            
            if(type === 'SPECIALTY') {
                inputData.map((item, index) => {
                    let object = {}
                    object.label = item.name
                    object.value = item.id
                    result.push(object)
                })
            }
            if(type === 'CLINIC') {
                inputData.map((item, index) => {
                    let object = {}
                    object.label = item.name
                    object.value = item.id
                    result.push(object)
                })
            }
        }
        return result
    }
    componentDidUpdate(prevProps, prevState) {
        if(prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect( this.props.allDoctors, "USERS")
            this.setState({
                listDoctors: dataSelect
            })
        }
        if(prevProps.lang !== this.props.lang) {
            let dataSelect = this.buildDataInputSelect( this.props.allDoctors, "USERS")
            let dataSelectPrice = this.buildDataInputSelect( this.props.allRequiredDoctorInfor.resPrice, 'PRICE')
            let dataSelectPayment = this.buildDataInputSelect( this.props.allRequiredDoctorInfor.resPayment, 'PAYMENT')
            let dataSelectProvince = this.buildDataInputSelect( this.props.allRequiredDoctorInfor.resProvince, 'PROVINCE')

            this.setState({
                listDoctors: dataSelect,
                listPrice: dataSelectPrice,
                listProvince: dataSelectProvince,
                listPayment: dataSelectPayment,
            })
        }
        if(prevProps.allRequiredDoctorInfor !== this.props.allRequiredDoctorInfor) {
            let dataSelectPrice = this.buildDataInputSelect( this.props.allRequiredDoctorInfor.resPrice, 'PRICE')
            let dataSelectPayment = this.buildDataInputSelect( this.props.allRequiredDoctorInfor.resPayment, 'PAYMENT')
            let dataSelectProvince = this.buildDataInputSelect( this.props.allRequiredDoctorInfor.resProvince, 'PROVINCE')
            let dataSelectSpecialty = this.buildDataInputSelect( this.props.allRequiredDoctorInfor.resSpecialty, 'SPECIALTY')
            let dataSelectClinic = this.buildDataInputSelect( this.props.allRequiredDoctorInfor.resClinic, 'CLINIC')
            
            this.setState({
                listPrice: dataSelectPrice,
                listProvince: dataSelectProvince,
                listPayment: dataSelectPayment,
                listSpecialty: dataSelectSpecialty,
                listClinic: dataSelectClinic
            })
        }
    }

   
    // Finish!
    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown: text,
            contentHTML: html
        })
    }
  
    handleSaveContentMarkdown = () => {
        let {hasOldData} = this.state
        this.props.saveDetailtDoctor({
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
            description: this.state.depcription,
            doctorId: this.state.selectedDoctor.value,
            action: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,
           
            selectedPrice: this.state.selectedPrice.value,
            selectedPayment: this.state.selectedPayment.value,
            selectedProvince: this.state.selectedProvince.value,
            nameClinic: this.state.nameClinic,
            addressClinic: this.state.addressClinic,
            note: this.state.note,
            clinicId: this.state.selectClinic && this.state.selectClinic.value ? this.state.selectClinic.value : '',
            specialtyId: this.state.selectSpecialty.value
        })
    }
    
    handleChangeSelect = async (selectedDoctor) => {
        this.setState({ selectedDoctor })
        let {listPayment, listPrice, listProvince, listSpecialty, listClinic} = this.state

        let res = await getDetailInforDoctor(selectedDoctor.value)
        if(res && res.errCode === 0 && res.data && res.data.Markdown) {
            let markdown = res.data.Markdown

            let addressClinic = '', nameClinic = '', note = '',
            paymentId = '', priceId = '', provinceId = '', specialtyId = '', clinicId = '',
            selectedClinic = ''
            if(res.data.Doctor_Infor) {
                addressClinic = res.data.Doctor_Infor.addressClinic
                nameClinic = res.data.Doctor_Infor.nameClinic
                note = res.data.Doctor_Infor.note
                paymentId = res.data.Doctor_Infor.paymentId
                priceId = res.data.Doctor_Infor.priceId
                provinceId = res.data.Doctor_Infor.provinceId
                specialtyId = res.data.Doctor_Infor.specialtyId
                clinicId = res.data.Doctor_Infor.clinicId
                
                let selectedPrice = listPrice.find(item => {
                    item.value = priceId
                    return item
                })

                let selectedPayment = listPayment.find(item => {
                    item.value = paymentId
                    return item
                })

                let selectedProvince = listProvince.find(item => {
                    item.value = provinceId
                    return item
                })

                let selectedSpecialty  = listSpecialty.find(item => {
                    return item && item.value === specialtyId
                })

                selectedClinic = listClinic.find(item => {
                    return item && item.value === clinicId
                })
                this.setState({
                    selectedPrice: selectedPrice,
                    selectedPayment: selectedPayment,
                    selectedProvince: selectedProvince,
                    selectSpecialty: selectedSpecialty,
                    selectClinic: selectedClinic
                })
            }

            this.setState({
                contentHTML: markdown.contentHTML,
                contentMarkdown: markdown.contentMarkdown,
                depcription: markdown.description,
                hasOldData: true,
                addressClinic : addressClinic,
                nameClinic : nameClinic,
                note : note
            })
        }else {
            this.setState({
                contentHTML: "",
                contentMarkdown: "",
                depcription: "",
                hasOldData: false,
                selectedPrice: '',
                selectedPayment: '',
                selectedProvince: '',
                selectSpecialty: '',
                selectClinic: ''
            })
        }
      };

    handleChangeSelectDoctorInfor = async (selectedOption, name) => {
        let stateName = name.name
        let stateCopy = {...this.state}
        stateCopy[stateName] = selectedOption

        this.setState({
            ...stateCopy
        })
    }

      handleOnChangeText = (e, id) => {
        let stateCopy = {...this.state}
        stateCopy[id] = e.target.value
        this.setState({
            ... stateCopy
        })
      }

    render() {
        let arrUsers = this.state.userRedux
        let {listSpecialty} = this.state
        return (
            <div className="manage-doctor-container">
                <div className='manage-doctor-title'>
                    <FormattedMessage id="admin.manage-doctor.title" />
                </div>
                <div className='more-infor'>
                    <div className='content-left'>
                        <label>
                            <FormattedMessage id="admin.manage-doctor.choose-doctor" />
                        </label>
                        <Select
                            value={this.state.selectedDoctor}
                            onChange={this.handleChangeSelect}
                            options={this.state.listDoctors}
                        />
                    </div>
                    <div className='content-right'>
                        <label><FormattedMessage id="admin.manage-doctor.infor" /></label>
                        <textarea className='text'
                            onChange={(e) => this.handleOnChangeText(e, 'depcription')}
                            value={this.state.depcription}
                        >
                        </textarea>
                    </div>

                    
                </div>

                <div className='more-infor-extra row'>
                    <div className='col-4 form-group'>
                        <label>
                             <FormattedMessage id="admin.manage-doctor.price" />
                        </label>
                        <Select
                            value={this.state.selectedPrice}
                             onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listPrice}
                            name={"selectedPrice"}

                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label>
                            <FormattedMessage id="admin.manage-doctor.payment" />
                        </label>
                        <Select
                            value={this.state.selectedPayment}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listPayment}
                            name={"selectedPayment"}
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label>
                            <FormattedMessage id="admin.manage-doctor.province" />
                        </label>
                        <Select
                            value={this.state.selectedProvince}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listProvince}
                            name={"selectedProvince"}
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label>
                            <FormattedMessage id="admin.manage-doctor.name-clinic" />
                        </label>
                        <input className='form-control'
                            onChange={(e) => this.handleOnChangeText(e, 'nameClinic')}
                            value={this.state.nameClinic}
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label>
                            <FormattedMessage id="admin.manage-doctor.address-clinic" />
                        </label>
                        <input className='form-control'
                            onChange={(e) => this.handleOnChangeText(e, 'addressClinic')}
                            value={this.state.addressClinic}
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label>
                            <FormattedMessage id="admin.manage-doctor.note" />
                        </label>
                        <input className='form-control'
                            onChange={(e) => this.handleOnChangeText(e, 'note')}
                            value={this.state.note}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='col-4 form-group'>
                        <label>
                            <FormattedMessage id="admin.manage-doctor.specialty" />
                        </label>
                        <Select
                            value={this.state.selectSpecialty}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listSpecialty}
                            name={"selectSpecialty"}
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label>
                            <FormattedMessage id="admin.manage-doctor.clinic" />
                        </label>
                        <Select
                            value={this.state.selectClinic}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listClinic}
                            name={"selectClinic"}
                        />
                    </div>
                </div>

                <div className='manage-doctor-editor'>
                    <MdEditor 
                    style={{ height: '350px' }} renderHTML={text => mdParser.render(text)} 
                    onChange={this.handleEditorChange} 
                    value={this.state.contentMarkdown}
                    />
                </div>
                <button 
                    onClick = {() => this.handleSaveContentMarkdown()}
                    className={this.state.hasOldData === false ? 'create-content-doctor' : 'save-content-doctor' }>
                        {this.state.hasOldData === false ? 
                        <FormattedMessage id="admin.manage-doctor.add" />
                        : 
                        <FormattedMessage id="admin.manage-doctor.save" />}
                </button>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        allDoctors: state.admin.allDoctors,
        allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: (id) => dispatch(actions.fetchAllDoctors(id)),
        getRequiredDoctorInfor: () => dispatch(actions.getRequiredDoctorInfor()),
        saveDetailtDoctor: (data) => dispatch(actions.saveDetailtDoctors(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
