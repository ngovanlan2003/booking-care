import React, { Component } from 'react';
import { connect } from 'react-redux';
import './DoctorSchedule.scss'
import * as actions from '../../../store/actions'
import {CRUD_ACTIONS, LANGUAGES, dateFormat} from '../../..//utils'
import moment from 'moment';
import localization from 'moment/locale/vi'
import { toast } from "react-toastify"
import {getScheduleDoctorByDate} from '../../../services/userService'
import { FormattedMessage } from 'react-intl';
import BookingModal from './Modal/BookingModal';

class DoctorSchedule extends Component {
    constructor(props) {
        super(props)
        this.state = {
            allDays : [],
            allAvailableTime: [],
            isOpenModalBooking: false, 
            dataScheduleTimeModal: {}
        }
    }

    async componentDidMount() {
        let {language} = this.props
        let arrDate = this.getArrDays(language)

        if(arrDate && arrDate.length > 0) {
            this.setState({
                allDays: arrDate,
            })
        }

        if(this.props.doctorFromParent) {
            let res = await getScheduleDoctorByDate(this.props.doctorFromParent, arrDate[0].value)
            this.setState({
                allAvailableTime: res.data ? res.data : []
            })

        }
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    getArrDays =  (language) => {
        let arrDate = []
        for(let i = 0; i < 7; i++) {
            let object = {}

            if(language === LANGUAGES.VI) {
                if(i === 0) {
                    let ddMM = moment(new Date()).format('DD/MM')
                    let today = `Hôm nay - ${ddMM}`
                    object.label = today
                }else {
                    let labelVi = moment(new Date()).add(i, 'days').format('dddd - DD/MM')
                    object.label = this.capitalizeFirstLetter(labelVi)
                }
            }else {
                if(i === 0) {
                    let ddMM = moment(new Date()).format('DD/MM')
                    let today = `Today - ${ddMM}`
                    object.label = today
                }else {
                    object.label = moment(new Date()).add(i, 'days').locale(`en`).format("ddd - DD/MM")
                }
            }
            object.value = moment(new Date()).add(i, 'days').startOf('day').valueOf()

            arrDate.push(object)
        }
        return arrDate
    }

    async componentDidUpdate(prevProps, prevState) {
        if(this.props.language !== prevProps.language) {
            let arrDate = this.getArrDays(this.props.language)
            this.setState({
                allDays: arrDate
            })
        }

        if(this.props.doctorFromParent !== prevProps.doctorFromParent) {
            let arrDate = this.getArrDays(this.props.language)

            let res = await getScheduleDoctorByDate(this.props.doctorFromParent, arrDate[0].value)
            this.setState({
                allAvailableTime: res.data ? res.data : []
            })
        }
    }

    handleOnChangeSelect = async (e) => {
        if(this.props.doctorFromParent && this.props.doctorFromParent !== -1) {
            let doctorId = this.props.doctorFromParent
            let date = e.target.value
            let res = await getScheduleDoctorByDate(doctorId, date)

            if(res && res.errCode === 0) {
                this.setState({
                    allAvailableTime: res.data ? res.data : []
                })
            }
        }
    }

    handleClickScheduleTime = (time) => {
        this.setState({
            isOpenModalBooking: true,
            dataScheduleTimeModal: time
        })
    }

    closeBookingModal = () => {
        this.setState({
            isOpenModalBooking: false
        })
    }
    render() {
        let {allDays, allAvailableTime, isOpenModalBooking, dataScheduleTimeModal} = this.state
        return (
           <>
                <div className='doctor-schedule-container'>
                    <div className='all-schedule'>
                        <select onChange={(e) => this.handleOnChangeSelect(e)} className="all-schedule-select">
                            {allDays && allDays.length > 0 &&
                                allDays.map((item, index) => {
                                    return (
                                        <option value={item.value} key={index}>{item.label}</option>
                                    )
                                })
                            }
                        </select>

                    </div>
                    <div className='all-available-time'>
                        <div className='text-calender'>
                            <span><i className="fas fa-calendar-alt"></i>
                                <FormattedMessage id="patient.detail-doctor.schedule"/>
                            </span>
                        </div>
                        <div className='time-content'>
                            <>
                            </>
                            {allAvailableTime && allAvailableTime.length > 0 ?
                            <>
                                {allAvailableTime.map((item, index) => {
                                    return (
                                        <button 
                                            key={index}
                                            onClick={() => this.handleClickScheduleTime(item)}
                                        >
                                            {this.props.language === LANGUAGES.VI ? item.timeTypeData.valueVi : item.timeTypeData.valueEn}
                                        </button>
                                    )
                                })}

                                <div className='book-free'>
                                    <span>
                                        <FormattedMessage id="patient.detail-doctor.choose"/>&nbsp;
                                            <i className='far fa-hand-point-up'></i> &nbsp;
                                        <FormattedMessage id="patient.detail-doctor.book-free"/>
                                    </span>
                                </div>
                            </>
                            :
                            <span className='no-schedule'>
                                <FormattedMessage id="patient.detail-doctor.no-schedule"/>
                            </span>
                            }
                        </div>
                    </div>
                </div>
                <BookingModal 
                    isOpenModalBookingParent={isOpenModalBooking}
                    closeBookingModal={this.closeBookingModal}
                    dataTime={dataScheduleTimeModal}
                />
           </>
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
