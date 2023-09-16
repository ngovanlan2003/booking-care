import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux';
import Slider from "react-slick";
import {getAllSpecialty} from '../../../services/userService'
import { withRouter } from 'react-router';

class Specialty extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSpecialty: []
        }
    }

    async componentDidMount() {
        let res = await getAllSpecialty()
        if(res && res.errCode === 0) {
            this.setState({
                dataSpecialty: res.data ? res.data : []
            })
        } 
    }

    handleViewDetailSpecialty = (specialty) => {
        this.props.history.push(`/detail-specialty/${specialty.id}`)
    }

    render() {
        
        let {dataSpecialty} = this.state
        return (
            <div className='section-share section-specialty'>
                <div className='section-container'>
                    <div className='section-header'>
                        <h2>Chuyên khoa phổ biến</h2>
                        <button>Xem thêm</button>
                    </div>
                    <div className='section-body'>
                    <Slider {...this.props.settings}>
                        {dataSpecialty && dataSpecialty.length > 0 &&
                            dataSpecialty.map((item, index) => {
                                return (
                                <div className='section-customize' key={index}
                                >
                                    <div className='bg-img section-specialty'
                                        style={{backgroundImage: `url(${item.image})`}}
                                    onClick={() => this.handleViewDetailSpecialty(item)}

                                    ></div>
                                    <div>{item.name}</div>
                                </div>
                                )
                            })
                        }
                       
                    </Slider>
                    </div>
                    
                </div>
 
            </div>
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
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Specialty));
