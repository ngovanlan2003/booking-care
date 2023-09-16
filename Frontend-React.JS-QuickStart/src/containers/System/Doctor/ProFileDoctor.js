import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import * as actions from '../../../store/actions'
import './ProFileDoctor.scss'
import {getProfileDoctorById} from '../../../services/userService'
import logger from 'redux-logger';
import { LANGUAGES } from '../../../utils';
import { Label } from 'reactstrap';
import NumberFormat from 'react-number-format';
import _ from 'lodash'
import moment from 'moment';
import { Link } from 'react-router-dom';

class ProFileDoctor extends Component {
    constructor(props) {
        super(props)
        this.state = {
           dataProfile: {}
        }
    }

    async componentDidMount() {
        let data = await this.getInforDoctor(this.props.doctorId)
        this.setState({
            dataProfile: data
        })
    }

    getInforDoctor = async (id) => {
        let result = {}
        if(id) {
            let res = await getProfileDoctorById(id)
            if(res && res.errCode === 0) {
                result = res.data
            }
        }
        return result
    }

   
    async componentDidUpdate(prevProps, prevState) {
        if(this.props.doctorId !== prevProps.doctorId) {
            let data = await this.getInforDoctor(this.props.doctorId)
            this.setState({
                dataProfile: data
            })
        }
    }

    renderTimeBooking = (dataTime) => {
        let {language} = this.props
        if(dataTime&& !_.isEmpty(dataTime)) {
            let time = language === LANGUAGES.VI ? dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn
            let date = language === LANGUAGES.VI ?
                moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY')
                :
                moment.unix(+dataTime.date / 1000).locale('en').format('ddd - MM/DD/YYYY')

            return (
                <>
                    <div>
                        {time} - {date}
                    </div>
                </>
            )

        }else {
            return (
                <>
                    <div></div>
                </>
            )
        }
    }

    render() {
        let {dataProfile} = this.state
        let {language, isShowDescriptionDoctor, dataTime, isShowLinkDetail, isShowPrice,
            doctorId
        } = this.props
        let nameVi ='', nameEn = ''
        if(dataProfile && dataProfile.positionData) {
             nameVi = `${dataProfile.positionData.valueVi}, ${dataProfile.firstName} ${dataProfile.lastName}`
             nameEn = `${dataProfile.positionData.valueEn}, ${dataProfile.firstName} ${dataProfile.lastName}`
        }


        return (
            <div className='profile-doctor-container'>
                <div className='intro-doctor'>
                    <div className='content-left'
                        style={{backgroundImage: `url(${dataProfile.image})`}}
                    >

                    </div>
                    <div className='content-right'>
                        <div className='up'>
                            {language === LANGUAGES.VI ? nameVi : nameEn}
                        </div>
                        <div className='down'>
                            {isShowDescriptionDoctor === true 
                                ?
                                <>
                                    {dataProfile.Markdown && dataProfile.Markdown.description ?
                                        <span>
                                            {dataProfile.Markdown.description}
                                        </span>
                                        :
                                        <span>
                                            Không có dữ liệu
                                        </span>
                                    }
                                
                                </>
                                :
                                <>
                                    {this.renderTimeBooking(dataTime)}
                                </>
                            }
                        </div>
                    </div>
                  
                </div>
                {isShowLinkDetail === true &&
                    <div className='view-detail-doctor'>
                        <Link to={`/detail-doctor/${doctorId}`}>Xem thêm</Link>
                    </div>
                }


                {isShowPrice === true
                    &&
                    <div className='price'>
                        Giá khám:
                        {dataProfile && dataProfile.Doctor_Infor &&
                            <>
                            <NumberFormat 
                                value={language === LANGUAGES.VI ? dataProfile.Doctor_Infor.priceTypeData.valueVi : dataProfile.Doctor_Infor.priceTypeData.valueEn} 
                                displayType={'text'} 
                                thousandSeparator={true}
                                suffix={language === LANGUAGES.VI ? ' VNĐ' :' $'}
                            />
                        </>  
                        } 
                    </div>

                }
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

export default connect(mapStateToProps, mapDispatchToProps)(ProFileDoctor);
