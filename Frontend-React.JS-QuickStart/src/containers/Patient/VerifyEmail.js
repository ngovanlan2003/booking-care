import React, { Component } from 'react';
import * as actions from '../../store/actions'
import { connect } from 'react-redux';
import {postVerifyBookAppointment} from '../../services/userService'
import HomeHeader from '../HomePage/HomeHeader';
import './VerifyEmail.scss'

class VerifyEmail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            statusVerify: false
        }
    }

    async componentDidMount() {
        if(this.props.location && this.props.location.search) {
            // documents in library query string
            let urlParams = new URLSearchParams(this.props.location.search)
            let token = urlParams.get('token')
            let doctorId = urlParams.get('doctorId')
            let res = await postVerifyBookAppointment({
                doctorId: doctorId,
                token: token
            })

            if(res && res.errCode == 0) {
                this.setState({
                    statusVerify: true,
                })
            }else {
                this.setState({
                    statusVerify: false
                })
            }
        }
    }
    async componentDidUpdate(prevProps, prevState) {
    }
    
    render() {
        let {statusVerify} = this.state
        return (
            <div className='verify-email-container'>
                <div>
                    <HomeHeader isShowBanner={false}/>
                </div>
                <div className='verify-email-content'>
                    {statusVerify === false 
                    ?
                    <div className='infor'>Xác nhận không thành công. Vui lòng thử lại</div>
                    :
                    <div className='infor'>Bạn đã xác nhận thành công</div>
                    }
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenders: () => dispatch(actions.fetchGenderStart()),

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);
