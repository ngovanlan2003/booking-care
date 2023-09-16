import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Slider from "react-slick";
import * as actions from '../../../store/actions'
import { LANGUAGES } from '../../../utils';
import { withRouter } from 'react-router';

class OutStandingDoctor extends Component {
    constructor(props){
        super(props)
        this.state = {
            arrDoctors: []
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot)  {
        if(prevProps.topDoctorsRedux !== this.props.topDoctorsRedux) {
            this.setState({
                arrDoctors: this.props.topDoctorsRedux
            })
        }
    }

    componentDidMount() {
        this.props.loadTopDoctors()

    }

    handleViewDetailDoctor = (doctor) => {
        this.props.history.push(`/detail-doctor/${doctor.id}`)
    }

    render() {
        let arrDoctors = this.state.arrDoctors
        let {language} = this.props
        return (
            <div >
                <div className='section-share section-outstanding-doctor'>
                <div className='section-container'>
                    <div className='section-header'>
                        <h2><FormattedMessage id="homepage.out-standing-doctor" /></h2>
                        <button><FormattedMessage id="homepage.more" /></button>
                    </div>
                    <div className='section-body'>
                    <Slider {...this.props.settings}>
                        {arrDoctors && arrDoctors.length > 0 &&
                            arrDoctors.map((item, index) => {
                                let imageBase64 = ''
                                if(item.image) {
                                    imageBase64 = new Buffer(item.image, 'base64').toString('binary')
                                }
                                let nameVi = `${item.positionData.valueVi}, ${item.firstName} ${item.lastName}`
                                let nameEn = `${item.positionData.valueEn}, ${item.firstName} ${item.lastName}`
                                return (
                                    <div className='section-customize' key={index} onClick={() => this.handleViewDetailDoctor(item)}>
                                        <div className='customize-border'>
                                            <div className='outer-bg'>
                                                <div className='bg-img section-outstanding-doctor'
                                                style={{backgroundImage: `url(${imageBase64})`}}
                                                ></div>
                                            </div>
                                            <div className='position text-center'>
                                                <div>{language === LANGUAGES.VI ? nameVi : nameEn}</div>
                                                <div>Cơ xương khớp 1</div>
                                            </div>
                                        </div>
                                    </div>
                                )
                        })}
                      
                    </Slider>
                    </div>
                    
                </div>
            </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        topDoctorsRedux: state.admin.topDoctors
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadTopDoctors: () => dispatch(actions.fetchTopDoctor())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor));
