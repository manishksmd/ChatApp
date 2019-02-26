import React, { Component } from 'react';
import { connect } from 'react-redux';
import { sendMsg, getMsg, getFile, sendFile } from '../Actions/msgAction';
import { getAllUsers } from '../Actions/userAction';
import { userTyping, typingUserName } from '../Actions/userTypingAction';
import EmojiPicker from 'emoji-picker-react';
import Data from './emoji.json';
import $ from 'jquery';
import { socket } from '../index';

class Textbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            msg: '',
            file: '',
            typingUser: '',
            showingAlert: false,
            showEmoji: false,
            popupVisible: false,
            uploadFile: '',
            isFile: false
        }
        this.onChange = this.onChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeFile = this.handleChangeFile.bind(this);
        this.openEmoji = this.openEmoji.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
    }
    componentWillMount() {
        this.props.getMsg();
        this.props.getAllUsers();
        this.props.typingUserName();
        this.props.getFile();
    }
    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }
    uploadFile(e) {
        e.preventDefault();
        const file = this.state.uploadFile
        const temp = file.name.split('.');
        const name = temp[0]
        const type = temp[1]
        const fileInfo = {
            fileName: name,
            fileType: type,
            file: file,
            user: this.props.user
        }
        this.setState({ msg: '', isFile: false });
        this.props.sendFile(fileInfo);
    }
    handleSubmit(e) {
        e.preventDefault();
        if (!this.state.msg.replace(/\s/g, '').length) {
            this.setState({ msg: '' });
            return;
        }
        else {
            this.setState({ msg: '', showEmoji: false });
            this.props.sendMsg(this.state.msg);
        }       
    }
    handleChangeFile(event) {
        const fileName = event.target.files[0].name;
        const file = event.target.files[0];
        this.setState({ file: fileName, msg: fileName, uploadFile: file, isFile: true })
        let formData = new FormData();
        formData.append('file', fileName);
    }
    handleKeyPress = () => {
        this.props.userTyping();
        this.setState({
            showingAlert: true,
            showEmoji: false
        });
    }
    handleEmojiClick = (n, e) => {
        if (e.category === "flags") {
            const replaceEmoji = e.name.replace(/-/g, "_");
            const emoji = ":" + replaceEmoji + ":";
            this.setState({
                msg: this.state.msg + emoji
            });
            return;
        }
        for (var index = 0; index < Data.length; index++) {
            if (Data[index].key === e.name) {
                const emoji = ":" + Data[index].value + ":";
                this.setState({
                    msg: this.state.msg + emoji
                });
                return;
            }
        }
        const emoji = ":" + e.name + ":";
        this.setState({
            msg: this.state.msg + emoji,
        });
    }
    openEmoji = (e) => {
        if (!this.state.showEmoji) {
            document.addEventListener('click', this.handleOutsideClick, false);
        } else {
            document.removeEventListener('click', this.handleOutsideClick, false);
        }

        this.setState(prevState => ({
            showEmoji: !prevState.showEmoji
        }));
    }
    handleOutsideClick(e) {
        if (this.node.contains(e.target)) {
            return;
        }
        this.openEmoji();
    }
    render() {
        const plane = 'fa-paper-plane';
        setTimeout(function () {
            $('#notification').fadeOut();
        }, 15000);

        const typing = this.props.userTypingData.map((data) => {
            if (this.props.user === data.user) {
                return <p key={data.user}></p>;
            }
            else {
                return <p key={data.user} className="text-primary" id="notification">{data.user}{data.msg}</p>
            }
        });
        return (
            <div className="bottomcss">
                {this.state.showEmoji ? <div><EmojiPicker onEmojiClick={this.handleEmojiClick} className="emotion-area" /></div> : null}
                <span>
                    {typing}
                </span>
                <div className="input-group">
                    <div ref={node => { this.node = node; }} ><button type="button" className="btn btn-primary mr-2 mb-2" onClick={this.openEmoji} ><i className="fa fa-smile-o"></i></button></div>
                    <textarea type="text" class="form-control mr-2" rows="1" ref="myInput" onKeyPress={this.handleKeyPress} placeholder="Enter Message" name="msg" value={this.state.msg} onChange={this.onChange}></textarea>
                    <label htmlFor="file-upload" className="btn btn-primary" hidden={this.state.msg}>
                        <i className="fa fa-cloud-upload"></i>
                    </label>
                    <input id="file-upload" type="file" name="file" onChange={this.handleChangeFile} />
                    <button type="submit" onClick={this.uploadFile}>upload</button>
                    <button button="submit" className="btn btn-primary mb-2" onClick={this.handleSubmit} hidden={!this.state.msg}><i className={'fa ' + plane}></i></button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    allUsers: state.allUsers.items,
    userTypingData: state.userTypingData.items,
    user: state.user.userObj,
    fileData: state.msgs.filedata,
})

export default connect(mapStateToProps, { sendMsg, getMsg, getAllUsers, userTyping, typingUserName, getFile, sendFile })(Textbox)
