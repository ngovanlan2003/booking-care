import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from "react-slick";
import {getAllClinic} from '../../../services/userService'
import { withRouter } from 'react-router';
import './MedicalFacility.scss'

class MedicalFacility extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataClinics: []
        }
    }

    async componentDidMount() {
        let res = await getAllClinic()
        if(res && res.errCode === 0) {
            this.setState({
                dataClinics: res.data
            })
        }
    }

    handleViewDetailClinic = (clinic) => {
        this.props.history.push(`/detail-clinic/${clinic.id}`)
    }
    render() {
       let {dataClinics} = this.state

        return (
            <div >
                <div className='section-share section-medical-facility'>
                    <div className='section-container'>
                        <div className='section-header'>
                            <h2>Cơ sở ý tế nổi bật</h2>
                            <button>Xem thêm</button>
                        </div>
                        <div className='section-body'>
                        <Slider {...this.props.settings}>
                            {dataClinics && dataClinics.length > 0 
                            &&
                            dataClinics.map((item, index) => {
                                return (
                                    <div className='section-customize' key={index}
                                        onClick={() => this.handleViewDetailClinic(item)}
                                    >
                                        <div className='bg-img '
                                            style={{backgroundImage: `url(${item.image})`}}
                                        ></div>
                                        <div className='name'>{item.name}</div>
                                    </div>
                                )
                            })
                            
                            } 
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
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MedicalFacility));
