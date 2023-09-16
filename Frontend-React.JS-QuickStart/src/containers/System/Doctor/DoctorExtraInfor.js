import React, { Component } from 'react';
import { connect } from 'react-redux';
import './DoctorExtraInfor.scss'
import * as actions from '../../../store/actions'
import {CRUD_ACTIONS, LANGUAGES, dateFormat} from '../../..//utils'
import { toast } from "react-toastify"
import {getEtraInforDoctorById} from '../../../services/userService'
import { FormattedMessage } from 'react-intl';
import logger from 'redux-logger';
import NumberFormat from 'react-number-format';

class DoctorExtraInfor extends Component {
    constructor(props) {
        super(props)
        this.state = {
           isShowDetailInfor: false,
           extraInfor: {}
        }
    }

    async componentDidMount() {
        if(this.props.doctorFromParent) {
            let res = await getEtraInforDoctorById(this.props.doctorFromParent)
            if(res && res.errCode === 0) {
                this.setState({
                    extraInfor: res.data
                })
            }
        }
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

   
    async componentDidUpdate(prevProps, prevState) {
        if(this.props.doctorFromParent !== prevProps.doctorFromParent) {
            let res = await getEtraInforDoctorById(this.props.doctorFromParent)
            if(res && res.errCode === 0) {
                this.setState({
                    extraInfor: res.data
                })
            }
        }
    }

 
    render() {
        let {isShowDetailInfor, extraInfor} = this.state
        let {language} = this.props
        return (
            <div className='doctor-extra-infor-container'>
                    <div className='content-up'>
                        <div className='heading-address'>
                            <FormattedMessage id="patient.extra-infor-doctor.heading-address"/>
                        </div>
                        <div className='clinic'>{extraInfor && extraInfor.nameClinic ? extraInfor.nameClinic : ''}</div>
                        <div className='address'>{extraInfor && extraInfor.addressClinic ? extraInfor.addressClinic : ''}</div>
                    </div>
                    <div className='content-down'>
                    
                    {isShowDetailInfor === false ?
                        <div className='price-detail'>
                            <span className='price-item'>
                                <FormattedMessage id="patient.extra-infor-doctor.price-item"/>
                            </span>
                            <span className='money'>
                                {extraInfor && extraInfor.priceTypeData
                                    ? 
                                    <>
                                        <NumberFormat 
                                            value={language === LANGUAGES.VI ? extraInfor.priceTypeData.valueVi : extraInfor.priceTypeData.valueEn} 
                                            displayType={'text'} 
                                            thousandSeparator={true}
                                            suffix={language === LANGUAGES.VI ? ' VNĐ' :' $'}
                                        />
                                    </>  
                                    : 
                                    ''
                                }
                            </span>
                            <span className='detail' onClick={() => this.setState({isShowDetailInfor: true})}>
                                <FormattedMessage id="patient.extra-infor-doctor.detail"/>
                            </span>
                        </div>
                        :
                        <>
                            <div className='heading'>
                                <FormattedMessage id="patient.extra-infor-doctor.heading"/>
                            </div>
                        <div className='heading-price'>
                            
                            <div className='item'>
                                <span className='item-left'>
                                    <FormattedMessage id="patient.extra-infor-doctor.item-left"/>
                                </span>
                                <span className='item-right'>
                                {extraInfor && extraInfor.priceTypeData
                                    ? 
                                    <>
                                     <NumberFormat 
                                            value={language === LANGUAGES.VI ? extraInfor.priceTypeData.valueVi : extraInfor.priceTypeData.valueEn} 
                                            displayType={'text'} 
                                            thousandSeparator={true}
                                            suffix={language === LANGUAGES.VI ? ' VNĐ' :' $'}
                                        />
                                    </>  
                                    : 
                                    ''
                                }
                                </span>
                            </div>
                            <div className='price-description'>
                            {extraInfor && extraInfor.note ? extraInfor.note : ''}
                            </div>
                        </div>
                        <div className='payment'>
                            <FormattedMessage id="patient.extra-infor-doctor.payment"/>
                            
                            {extraInfor && extraInfor.paymentTypeData ? 
                            <>
                             {language === LANGUAGES.VI ? extraInfor.paymentTypeData.valueVi : extraInfor.paymentTypeData.valueEn} 
                            </>
                            :
                            ''
                            }
                        </div>
                        <div className='hiden-price' onClick={() => this.setState({isShowDetailInfor: false})}>
                            <FormattedMessage id="patient.extra-infor-doctor.hiden-price"/>
                        </div>
                        </>
                    }
                        
                        
                    </div>
             
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfor);
