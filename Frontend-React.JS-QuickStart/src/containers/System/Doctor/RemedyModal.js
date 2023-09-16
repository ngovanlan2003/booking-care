import React, { Component } from 'react';
import * as actions from '../../../store/actions'
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import {Modal, ModalHeader, ModalBody, ModalFooter, Button} from 'reactstrap';
import './RemedyModal.scss'
import { toast } from 'react-toastify';
import moment from 'moment';
import { CommonUtils } from '../../../utils';

class RemedyModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            imgBase64: ''
        }
    }

    async componentDidMount() {
        if(this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email
            })
        }
    }

   
    async componentDidUpdate(prevProps, prevState) {
        if(prevProps.dataModal !== this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email
            })
        }
    }
 
    handleOnchangeImg = async (event) => {
        let data = event.target.files
        let file = data[0]
        if(file) {
            let base64 = await CommonUtils.getBase64(file)
            this.setState({
                imgBase64: base64
            })
        }
    }

    handleOnchangeEmail = (e) => {
        this.setState({
            email: e.target.value
        })
    }

    handleSenmedy = () => {
        this.props.sendRemedy(this.state)
    }

    render() {
        let {isOpenRemedyModal, closeRemedyModal, dataModal, sendRemedy} = this.props
      
        return (
            <Modal 
                isOpen={isOpenRemedyModal} 
                className='booking-modal-container'
                size="md"
                centered
            >
                <div className='modal-header'>
                    <h5 className='modal-title'>Gửi hóa đơn khám bệnh thành công</h5>
                    <button type='button' className='close' aria-aria-label='label' onClick={closeRemedyModal}>
                        <span aria-hidden="true">x</span>
                    </button>
                </div>
                <ModalBody>
                    <div className='row'>
                        <div className='col-6 form-group'>
                                <label>Email bệnh nhân</label>
                                <input className='form-control' type='email' value={this.state.email}
                                    onChange={(e) => this.handleOnchangeEmail(e)}
                                />
                        </div>
                        <div className='col-6 form-group'>
                                <label>Chọn file hóa đơn</label>
                                <input className='form-control-file' type='file'
                                    onChange={(e) => this.handleOnchangeImg(e)}
                                />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color='primary' onClick={() => this.handleSenmedy()}>Send</Button>
                    <Button color='secondary' onClick={closeRemedyModal}>Cancel</Button>
                </ModalFooter>
            </Modal>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal);
