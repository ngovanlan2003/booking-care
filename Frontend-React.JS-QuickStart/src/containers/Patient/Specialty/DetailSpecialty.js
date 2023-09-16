import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import './DetailSpecialty.scss'
import * as actions from '../../../store/actions'
import HomeHeader from '../../HomePage/HomeHeader';
import DoctorSchedule from '../../System/Doctor/DoctorSchedule';
import DoctorExtraInfor from '../../System/Doctor/DoctorExtraInfor';
import ProFileDoctor from '../../System/Doctor/ProFileDoctor';
import {getDetailSpecialty, getAllCodeService} from '../../../services/userService'

import _ from 'lodash'
import { LANGUAGES } from '../../../utils';
class DetailSpecialty extends Component {
    constructor(props) {
        super(props)
        this.state = {
           arrDoctorId: [],
           dataDetailSpecialty: {},
           listProvince: []   
        }    
    }

    async componentDidMount() {
        if(this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id
            // let location = this.props.match.params.location
           
            let res = await getDetailSpecialty({
                id, 
                location: "ALL"
            })

            let resProvince = await getAllCodeService('PROVINCE')

            if(res && res.errCode === 0 && resProvince && resProvince.errCode === 0) {
                let data = res.data
                let arrDoctorId = []
                if(data && !_.isEmpty(data)) {
                    let arr = data.doctorSpecialty
                    if(arr && arr.length > 0) {
                        arr.map(item => {
                            arrDoctorId.push(item.doctorId)
                        })
                    }
                }

                let dataProvince = resProvince.data
                if(dataProvince && dataProvince.length > 0) {
                    dataProvince.unshift({
                        createdAt: null,
                        keyMap: 'ALL',
                        type: 'PROVINCE',
                        valueEn: 'ALL',
                        valueVi: 'Toàn quốc'
                    })
                } 
                this.setState({
                    dataDetailSpecialty: res.data, 
                    arrDoctorId: arrDoctorId,
                    listProvince: dataProvince
                })
            }
        }
    }
   
    async componentDidUpdate(prevProps, prevState) {
      
    }

    handleOnChangeSelect = async (e) => {
        if(this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id
            let location = e.target.value
            let res = await getDetailSpecialty({
                id, 
                location: location
            })

            if(res && res.errCode === 0) {
                let data = res.data
                let arrDoctorId = []
                if(data && !_.isEmpty(data)) {
                    let arr = data.doctorSpecialty
                    if(arr && arr.length > 0) {
                        arr.map(item => {
                            arrDoctorId.push(item.doctorId)
                        })
                    }
                }

                this.setState({
                    dataDetailSpecialty: res.data, 
                    arrDoctorId: arrDoctorId,
                })
            }

        }
    }

    render() {
        let {arrDoctorId, dataDetailSpecialty, listProvince} = this.state
        let {language} = this.props
        return (
            <div className='detail-specialty-container'>
                <HomeHeader />
                
                <div className='description-specialty'>
                    
                    {dataDetailSpecialty && !_.isEmpty(dataDetailSpecialty) &&
                        <div dangerouslySetInnerHTML={{__html: dataDetailSpecialty.descriptionHTML}} >
                        </div>
                    }
                </div>
                <div className='choose-location-doctor'>
                    <select onChange={(e) => this.handleOnChangeSelect(e)}>
                        {listProvince && listProvince.length> 0 &&
                            listProvince.map((item, index) => {
                                return (
                                    <option key={index} value={item.keyMap}>
                                        {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                    </option>
                                )
                            })
                        }
                    </select>
                </div>
                <div className='content'>
                    {arrDoctorId && arrDoctorId.length > 0 &&
                        arrDoctorId.map((item, index) => {
                            return (
                                <div className='each-doctor' key={index}>
                                    <div className='dt-content-left'>
                                        <ProFileDoctor 
                                           doctorId={item}
                                           isShowDescriptionDoctor={true}
                                           isShowLinkDetail={true}
                                           isShowPrice={false}
                                        //    dataTime={dataTime}
                                        />
                                    </div>
                                    <div className='dt-content-right'>
                                        <div className='doctor-schedule'>
                                            <DoctorSchedule 
                                                doctorFromParent={item}
                                            />
                                        </div>
                                        <div className='doctor-infor'>
                                            <DoctorExtraInfor 
                                                doctorFromParent={item}
                                            /> 
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                        
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty);
