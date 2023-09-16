import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import * as actions from '../../../store/actions'
import './ManageClinic.scss'
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { CommonUtils} from '../../../utils';
import {createNewClinic} from '../../../services/userService'
import { toast } from 'react-toastify';

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageClinic extends Component {
    constructor(props) {
        super(props)
        this.state = {
           name: '',
           address: '',
           imageBase64: '',
           descriptionHTML: '',
           descriptionMarkdown: ''
        }
    }

    async componentDidMount() {
       
    }

    async componentDidUpdate(prevProps, prevState) {
       
    }

    handleOnchangeInput = (e, id) => {
        let stateCopy = {...this.state}
        stateCopy[id] = e.target.value
        this.setState({
            ...stateCopy
        })
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionMarkdown: text,
            descriptionHTML: html
        })
    }

    handleOnchangeImg = async (event) => {
        let data = event.target.files
        let file = data[0]
        if(file) {
            let base64 = await CommonUtils.getBase64(file)
            this.setState({
                imageBase64: base64,
            })
        }
    }

    handleSaveNewClinic = async () => {
        let res = await createNewClinic(this.state)
        if(res && res.errCode === 0) {
            toast.success('Bạn đã lưu thành công!')
            this.setState({
                name: '',
                imageBase64: '',
                address: '',
                descriptionHTML: '',
                descriptionMarkdown: ''
            })
        }else {
            toast.error('Lưu thất bại bạn ơi!')
            console.log("check res: ", res);
        }
    }

    render() {
        
        return (
           <div className='manage-specialty-container'>
                <div className='ms-title'>
                    Quản lý phòng khám
                </div>
                <div className='add-new-specialty row'>
                    <div className='col-6 form-group'>
                        <label>Tên phòng khám</label>
                        <input className='form-control' type='text' value={this.state.name}
                            onChange={(e) => this.handleOnchangeInput(e, 'name')}
                        />
                    </div>
                    <div className='col-6 form-group'>
                        <label>Ảnh phòng khám</label>
                        <input className='form-control-file' type='file'
                            onChange={(e) => this.handleOnchangeImg(e)}
                        />
                    </div>
                    <div className='col-6 form-group'>
                        <label>Địa chỉ phòng khám</label>
                        <input className='form-control' type='text' value={this.state.address}
                            onChange={(e) => this.handleOnchangeInput(e, 'address')}
                        />
                    </div>
                    <div className='col-12'>
                        <MdEditor 
                            style={{ height: '400px' }} renderHTML={text => mdParser.render(text)} 
                            onChange={this.handleEditorChange} 
                            value={this.state.descriptionMarkdown} 
                        />
                    </div>
                    <div className='col-12'>
                        <button className='btn-save-specialty'
                            onClick={() => this.handleSaveNewClinic()}
                        >Save</button>
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
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
