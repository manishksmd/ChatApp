import React, { Component } from 'react'
import $ from 'jquery';
import { connect } from 'react-redux';
import { sendMsg, getMsg, getFile, sendFile } from '../Actions/msgAction';
import { getAllUsers } from '../Actions/userAction';
import { userTyping, typingUserName } from '../Actions/userTypingAction';
import EmojiPicker from 'emoji-picker-react';
import Data from './emoji.json';
import { socket } from '../index';
import  ChatUI from './chatUI';

class TextboxUI extends Component {
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
            isFile: false,
        }
        this.textInput = props.keyData;
        this.onChange = this.onChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeFile = this.handleChangeFile.bind(this);
        this.openEmoji = this.openEmoji.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
    }
   
    componentWillMount() {
        this.props.getMsg();
        this.props.getAllUsers();
        this.props.typingUserName();
        this.props.getFile();
    }
    componentWillReceiveProps(props){
    //    this.setState({
    //        msg: props.keyData
    //    })
    }
    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }
    handleSubmit(e) {
        this.textInput = null;
        e.preventDefault();
        if (this.state.isFile === true) {
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
        else {
            if (!this.state.msg.replace(/\s/g, '').length) {
                this.setState({ msg: '' });
                return;
            }
            else {
                var message = this.state.msg.trim()
                this.setState({ msg: '', showEmoji: false });
                this.props.sendMsg(message);
            }
        }
    }
    handleChangeFile(event) {
        $('#notification').hide();
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
        console.log(this.props.msgDisplay)
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
            <div>
                <div className="row no-gutters fixed-bottom">
                    <div className="emotion-area">{typing}</div>
                    {this.state.showEmoji ? <div className="emotion-area"><EmojiPicker onEmojiClick={this.handleEmojiClick} /></div> : null}
                    <div className="col-auto">
                        <div ref={node => { this.node = node; }} > <button className="btn btn-secondary border-left-0 rounded-0 rounded-right" type="submit" onClick={this.openEmoji}>
                            <i className="fa fa-smile-o"></i>
                        </button>
                        </div>
                    </div>
                    <div className="col">
                        {/* <textarea type="text" className="form-control" rows="1" placeholder="Enter Message" onKeyPress={this.handleKeyPress} name="msg" value={this.state.msg} onChange={this.onChange}></textarea> */}
                       { this.props.msgDisplay ? <textarea type="text" className="form-control" rows="1" placeholder="Enter Message" onKeyPress={this.handleKeyPress} name="msg"  ref={this.props.keyData} onChange={this.onChange}></textarea> : 
                       <textarea type="text" className="form-control" rows="1" placeholder="Enter Message" onKeyPress={this.handleKeyPress} name="msg" value={this.state.msg} onChange={this.onChange}></textarea>}
                    </div>
                    <div className="col-auto">
                        <button className="btn btn-secondary border-left-0 rounded-0 rounded-right" type="submit" onClick={this.handleSubmit} hidden={!this.state.msg}>
                            <i className={'fa fa-paper-plane'}></i>
                        </button>
                    </div>
                    <div className="col-auto">
                        <button onClick={(e) => { $('#file-upload').click() }} className="btn btn-secondary border-left-0 rounded-0 rounded-right"><i className="fa fa-cloud-upload"></i></button>
                        <input id="file-upload" type="file" name="file" onChange={this.handleChangeFile} />
                    </div>
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
    prevMsgs: state.msgs.chat
})


export default connect(mapStateToProps, { sendMsg, getMsg, getAllUsers, userTyping, typingUserName, getFile, sendFile })(TextboxUI)