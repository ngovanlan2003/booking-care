import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux';



class HomeFooter extends Component {
    
    render() {
        
    
        return (
            <div className='home-footer'>
                <p>&copy; Bản quyền thuộc Ngô Văn Lân - 2022<a target="_blank" href="https://www.facebook.com/profile.php?id=100075095276763">Information</a></p>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
