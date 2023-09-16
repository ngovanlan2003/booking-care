import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import './DetailClinic.scss'
import * as actions from '../../../store/actions'
import HomeHeader from '../../HomePage/HomeHeader';
import DoctorSchedule from '../../System/Doctor/DoctorSchedule';
import DoctorExtraInfor from '../../System/Doctor/DoctorExtraInfor';
import ProFileDoctor from '../../System/Doctor/ProFileDoctor';
import {getDetailClinic, getAllCodeService} from '../../../services/userService'

import _ from 'lodash'
import { LANGUAGES } from '../../../utils';
class DetailClinic extends Component {
    constructor(props) {
        super(props)
        this.state = {
           arrDoctorId: [],
           dataClinic: {},
           isShowDescriptionSpecialty: false
        }    
    }

    async componentDidMount() {
        if(this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id
           
            let res = await getDetailClinic(id)

            if(res && res.errCode === 0) {
                let data = res.data
                let arrDoctorId = []
                if(data && !_.isEmpty(data)) {
                    let arr = data.doctorClinic
                    if(arr && arr.length > 0) {
                        arr.map(item => {
                            arrDoctorId.push(item.doctorId)
                        })
                    }
                }
               
                this.setState({
                    dataClinic: res.data, 
                    arrDoctorId: arrDoctorId,
                })
            }
        }
    }
   
    async componentDidUpdate(prevProps, prevState) {
      
    }

    render() {
        let {arrDoctorId, dataClinic, isShowDescriptionSpecialty} = this.state
        let {language} = this.props
        return (
            <div className='detail-specialty-container'>
                <HomeHeader />
                
                    <div className='description-specialty'>
                        {dataClinic && !_.isEmpty(dataClinic) &&
                            <>
                                <h2>{dataClinic.name}</h2>
                                <div dangerouslySetInnerHTML={{__html: dataClinic.descriptionHTML}} >
                                </div>
                                
                            </>
                        }
                        </div>
                    <div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailClinic);
