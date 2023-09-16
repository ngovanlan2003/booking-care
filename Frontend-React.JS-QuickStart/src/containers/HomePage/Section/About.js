import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux';



class About extends Component {
    
    render() {
        
    
        return (
            <div className='section-share section-about'>
                <div className='section-about-header'>
                    Truyền thông nói gì về chúng tôi
                </div>
                <div className='section-about-content'>
                    <div className='content-left'>
                        <iframe width="100%" height="400px" src="https://www.youtube.com/embed/KYBv3NesWP8" title="Nhạc Chill 2023 - Tết Này Con Sẽ Về, Đi Để Trở  Về  | Nhạc Lofi Chill" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    </div>
                    <div className='content-right'>
                        <p>Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book. It usually begins with:
                        </p>
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

export default connect(mapStateToProps, mapDispatchToProps)(About);
