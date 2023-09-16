import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ManageSchedule.scss'
import { FormattedMessage } from 'react-intl';
import Select from 'react-select';
import * as actions from '../../../store/actions'
import {CRUD_ACTIONS, LANGUAGES, dateFormat} from '../../..//utils'
import DatePicker from '../../../components/Input/DatePicker';
import moment from 'moment';
import FormattedDate  from '../../../components/Formating/FormattedDate';
import { toast } from "react-toastify"
import _ from 'lodash'
import {saveBulkScheduleDoctor} from '../../../services/userService'

class ManageSchedule extends Component {
    constructor(props) {
        super(props)
        this.state = {
            listDoctors: [], 
            selectedDoctor: {},
            currentDate: '', 
            rangeTime: []
        }
    }

    componentDidMount() {
        this.props.fetchAllDoctors()
        this.props.fetchAllScheduleTime()
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect( this.props.allDoctors)
            this.setState({
                listDoctors: dataSelect
            })
        }
        // if(prevProps.lang !== this.props.lang) {
        //     let dataSelect = this.buildDataInputSelect( this.props.allDoctors)
        //     this.setState({
        //         listDoctors: dataSelect
        //     })
        // }
        if(prevProps.allScheduleTime !== this.props.allScheduleTime) {
            let data = this.props.allScheduleTime
            if(data && data.length > 0) {
                data = data.map(item => ({
                    ...item,
                    isSelected: false
                }))
            }
            this.setState({
                rangeTime: data
            })
        }
    }

    handleChangeSelect = async (selectedDoctor) => {
        this.setState({ selectedDoctor: selectedDoctor })
       
      };
    buildDataInputSelect = (inputData) => {
        let result = []
        let {language} = this.props
        if(inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {}
                let labelVi = `${item.lastName} ${item.firstName}`
                let labelEn = `${item.firstName} ${item.lastName}`
                object.label = language === LANGUAGES.VI ? labelVi : labelEn
                object.value = item.id
                result.push(object)
            })
        }
        return result
    }

    handleOnchangeDatepicker = (date) => {
        this.setState({
            currentDate: date[0]
        })
    }

    handleClickBtnTime = (time) => {
        let { rangeTime } = this.state
        if(rangeTime && rangeTime.length > 0) {
            rangeTime = rangeTime.map(item => {
                if(item.id === time.id) {
                    item.isSelected = !item.isSelected
                }
                return item
            })

            this.setState({
                rangeTime: rangeTime
            })
        }
    }

    handleSaveSchedule = async () => {
        let { rangeTime, selectedDoctor, currentDate} = this.state
        let result = []

        if(selectedDoctor && _.isEmpty(selectedDoctor)) {
            toast.error("Bạn chưa chọn bác sĩ!")
            return
        }

        if(!currentDate) {
            toast.error("Bạn chưa chọn ngày kìa!")
            return
        }

        let formatDate = new Date(currentDate).getTime() + ""
        // let formatDate = moment(currentDate).format(dateFormat.SEND_TO_SERVER)

        if(rangeTime && rangeTime.length > 0) {
            let selectedTime = rangeTime.filter(item => item.isSelected === true)
            if(selectedTime && selectedTime.length > 0) {
                selectedTime.map(item => {
                    let object = {}
                    object.doctorId = selectedDoctor.value
                    object.date = formatDate
                    object.timeType = item.keyMap
                    result.push(object)
                })
            }else {
                toast.error("Bạn chưa chọn giờ kìa!")
            }
        }

        let res = await saveBulkScheduleDoctor({
            arrSchedule: result,
            doctorId: selectedDoctor.value,
            formatDate: formatDate
        })

        if(res && res.errCode === 0) {
            toast.success("Bạn đã lưu thành công!")
        }else {
            toast.error("Bạn đã thất bại!")
        }
    }   

    render() {
        const { processLogout, langvi, userInfo } = this.props;
        let {language} = this.props
        let yesterday = new Date(new Date().setDate(new Date().getDate()-1));
        return (
            <>
                <div className='manage-schedule-container'>
                    <div className='m-s-title'>
                        <FormattedMessage id="manage-schedule.title" />
                    </div>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id="manage-schedule.choose-doctor" /></label>
                                <Select
                                    value={this.state.selectedDoctor}
                                    onChange={this.handleChangeSelect}
                                    options={this.state.listDoctors}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id="manage-schedule.choose-date" /></label>
                                <DatePicker 
                                    onChange={this.handleOnchangeDatepicker}
                                    className="form-control"
                                    value={this.state.currentDate[0]}
                                    minDate={yesterday}
                                />
                            </div>
                            <div className='col-12 pick-hour-container'>
                                {this.state.rangeTime && this.state.rangeTime.length > 0 &&
                                this.state.rangeTime.map((item, index) => {
                                    return (
                                        <button className={item.isSelected === true ? 'btn-time-select' : 'btn btn-time'}  key={index}
                                            onClick={() => this.handleClickBtnTime(item)}
                                        >
                                            {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                        </button>
                                    )
                                })}
                            </div>
                            <button 
                                onClick={() => this.handleSaveSchedule()}
                                className='btn-primary'><FormattedMessage id="manage-schedule.save" /></button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        allDoctors: state.admin.allDoctors, 
        allScheduleTime: state.admin.allScheduleTime
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
