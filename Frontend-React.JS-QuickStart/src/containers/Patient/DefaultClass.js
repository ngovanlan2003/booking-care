import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

class DefaultClass extends Component {
    constructor(props) {
        super(props)
        this.state = {
           
        }
    }

    async componentDidMount() {
       
    }

    

   
    async componentDidUpdate(prevProps, prevState) {
        if(this.props.doctorFromParent !== prevProps.doctorFromParent) {
            let res = await getEtraInforDoctorById(this.props.doctorFromParent)
            if(res && res.errCode === 0) {
                this.setState({
                    extraInfor: res.data
                })
            }
        }
    }

 
    render() {
        
        return (
           
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

export default connect(mapStateToProps, mapDispatchToProps)(DefaultClass);
