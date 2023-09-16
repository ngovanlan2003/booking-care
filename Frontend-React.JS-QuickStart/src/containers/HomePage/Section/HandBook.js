import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux';
import Slider from "react-slick";



class HandBook extends Component {
    
    render() {
        
    
        return (
            <div className='section-share section-hanbook'>
                <div className='section-container'>
                    <div className='section-header'>
                        <h2>Cẩm nang</h2>
                        <button>Xem thêm</button>
                    </div>
                    <div className='section-body'>
                    <Slider {...this.props.settings}>
                        <div className='section-customize'>
                            <div className='bg-img section-hanbook'></div>
                            <div>Cơ xương khớp 1</div>
                        </div>
                        <div className='section-customize'>
                            <div className='bg-img section-hanbook'></div>
                            <div>Cơ xương khớp 1</div>
                        </div>
                        <div className='section-customize'>
                            <div className='bg-img section-hanbook'></div>
                            <div>Cơ xương khớp 1</div>
                        </div>
                        <div className='section-customize'>
                            <div className='bg-img section-hanbook'></div>
                            <div>Cơ xương khớp 1</div>
                        </div>
                        <div className='section-customize'>
                        <div className='bg-img section-hanbook'></div>
                            <div>Cơ xương khớp 1</div>
                        </div>
                        <div className='section-customize'>
                        <div className='bg-img section-hanbook'></div>
                            <div>Cơ xương khớp 1</div>
                        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(HandBook);
