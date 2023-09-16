import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux';
import './HomeHeader.scss'
import {LANGUAGES} from '../../utils'
import { changeLanguageApp } from '../../store/actions/appActions';
import { withRouter } from 'react-router';

class HomeHeader extends Component {
    changeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language)
    }

    returnToHome = () => {
        this.props.history.push(`/home`)

    }
    render() {
        let language = this.props.lang
        return (
            <>
                <div className='home-header-container'>
                    <div className='home-header-content'>
                        <div className='left-content'>
                            <i className="fas fa-bars"></i>
                            <div className='header-logo'>
                                <img src="https://bookingcare.vn/assets/icon/bookingcare-2020.svg"
                                    onClick={() => this.returnToHome()}
                                />
                            </div>
                        </div>
                        <div className='center-content'>
                            <div className='child-content'>
                                <div><b><FormattedMessage id="home-header.speciality"/></b></div>
                                <div className='depcription-content'><FormattedMessage id="home-header.searchDoctor"/></div>
                            </div>
                            <div className='child-content'>
                                <div><b><FormattedMessage id="home-header.healthFacility"/></b></div>
                                <div className='depcription-content'><FormattedMessage id="home-header.select-room"/></div>
                            </div>
                            <div className='child-content'>
                                <div><b><FormattedMessage id="home-header.doctor"/></b></div>
                                <div className='depcription-content'><FormattedMessage id="home-header.select-doctor"/></div>
                            </div>
                            <div className='child-content'>
                                <div><b><FormattedMessage id="home-header.fee"/></b></div>
                                <div className='depcription-content'><FormattedMessage id="home-header.check-health"/></div>
                            </div>
                        </div>
                        <div className='right-content'>
                            <div className='support'>
                                <i className="fas fa-question"></i>
                                <FormattedMessage id="home-header.support"/>
                            </div>
                            <div className={language === LANGUAGES.VI ? 'language-vi active' : 'language-vi'}><span onClick={() => this.changeLanguage(LANGUAGES.VI)}>VN</span></div>
                            <div className={language === LANGUAGES.EN ? 'language-en active' : 'language-en'}><span onClick={() => this.changeLanguage(LANGUAGES.EN)}>EN</span></div>
                        </div>
                    </div>
                </div>
                {this.props.isShowBanner === true &&
                    <div className='home-header-banner'>
                        <div className='content-up'>
                            <div className='title1'> <FormattedMessage id="banner.title1"/></div>
                            <div className='title2'><FormattedMessage id="banner.title2"/></div>
                            <div className='search'>
                                <i className="fas fa-search"></i>   
                                <input type='text' placeholder='Tìm kiếm'/>
                            </div>
                        </div>
                        <div className='content-down'>
                            <div className='option'>
                                <div className='option-child'>
                                    <div className='option-icon'>
                                        <img src="https://cdn.bookingcare.vn/fo/2021/12/08/133537-khamchuyenkhoa.png"/>
                                    </div>
                                    <div className='option-text'>
                                        <div className='option-text-up'><FormattedMessage id="banner.child1"/></div>
                                    </div>
                                </div>
                                <div className='option-child'>
                                    <div className='option-icon'>
                                        <img src="https://cdn.bookingcare.vn/fo/2021/12/08/133657-khamtuxa.png"/>
                                    </div>
                                    <div className='option-text'>
                                        <div className='option-text-up'><FormattedMessage id="banner.child2"/></div>
                                    </div>
                                </div>
                                <div className='option-child'>
                                    <div className='option-icon'>
                                        <img src="https://cdn.bookingcare.vn/fo/2021/12/08/133744-khamtongquat.png"/>
                                    </div>
                                    <div className='option-text'>
                                        <div className='option-text-up'><FormattedMessage id="banner.child3"/></div>
                                    </div>
                                </div>
                                <div className='option-child'>
                                    <div className='option-icon'>
                                        <img src="	https://cdn.bookingcare.vn/fo/2021/12/08/133744-dichvuxetnghiem.png"/>
                                    </div>
                                    <div className='option-text'>
                                        <div className='option-text-up'><FormattedMessage id="banner.child4"/></div>
                                    </div>
                                </div>
                                <div className='option-child'>
                                    <div className='option-icon'>
                                        <img src="	https://cdn.bookingcare.vn/fo/2021/12/08/133744-suckhoetinhthan.png"/>
                                    </div>
                                    <div className='option-text'>
                                        <div className='option-text-up'><FormattedMessage id="banner.child5"/></div>
                                    </div>
                                </div>
                                <div className='option-child'>
                                    <div className='option-icon'>
                                        <img src="https://cdn.bookingcare.vn/fo/2022/05/19/104635-khamnhakhoa.png"/>
                                    </div>
                                    <div className='option-text'>
                                        <div className='option-text-up'><FormattedMessage id="banner.child6"/></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </> 
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        lang: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeHeader));
