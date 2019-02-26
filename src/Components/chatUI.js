import React, { Component } from 'react';
import { connect } from 'react-redux';
import { sendMsg, getMsg, getFile, sendFile, getReadReceipt } from '../Actions/msgAction';
import { getAllUsers } from '../Actions/userAction';
import { userTyping, typingUserName } from '../Actions/userTypingAction';
import Notification from './notification';
import { emojify } from 'react-emoji';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';
import 'react-s-alert/dist/s-alert-default.css';
import $ from 'jquery';
import EmojiPicker from 'emoji-picker-react';
import Data from './emoji.json';
import { socket } from '../index';


var fileDownload = require('js-file-download');
let icon = '';
let count = -1;
let readUserArr = [];

export class chatUI extends Component {
    constructor(props) {
        super(props);
        this.state = {
            msg: '',
            file: '',
            typingUser: '',
            showingAlert: false,
            showEmoji: false,
            visibility: false,
            popupVisible: false,
            uploadFile: '',
            isFile: false,
            readUser: [],
            id: -1,
            counter: -1
        }
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
        this.props.getReadReceipt();
    }
    downloadFile = (id, e) => {
        e.preventDefault();
        this.props.prevMsgs.map((data, index) => {
            if (index == id) {
                fileDownload(data.content, data.fileName + "." + data.fileType)
            }
        })
    }
    editData = (Id) => {
        this.props.prevMsgs.map((data, index) => {
            if (index == Id) {
                this.setState({
                    id: Id,
                    msg: data.msg
                })
            }

        })

    }
    infoData = (id) => {
        // alert("Read Receipt");
        //socket.emit('READ_RECEIPT', id);   
        // alert(this.props.allUsers.length);   
        
            
            if(this.props.allUsers.length > 1)
            {
                alert("delivered");
            }
            else
            {
                this.state.delivermsg = "Undelivered";
                alert("undelivered");
            }
            
        
    }
    deleteData = (id) => {
        socket.emit('DELETE', id)
    }
    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }
    handleSubmit(e) {
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
                user: this.props.user,
                counter: this.state.counter + 1,
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
                setTimeout(() => {
                    if (this.state.id == -1) {
                        console.log("add")
                        this.setState({ counter: this.state.counter + 1 })
                        
                        const editMesssage = {
                            index: this.state.counter,
                            msg: this.state.msg.trim(),

                        }
                        var message = this.state.msg.trim()
                        this.setState({ msg: '', showEmoji: false });
                        this.props.sendMsg(editMesssage);
                        return;
                    }
                    if (this.state.id > -1) {
                        console.log("update")
                        const editMesssage = {
                            id: this.state.id,
                            index: this.state.counter,
                            msg: this.state.msg
                        }
                        this.setState({ msg: '', id: -1 });
                        this.props.sendMsg(editMesssage);
                    }
                }, 100);

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

        var online = this.props.allUsers;
        var user = this.props.user;

     
        //console.log(this.props.readReceipt)

        const onlineUser = this.props.allUsers.map((data) => {
            if (this.props.user === data) {
                return <li key={data} className="text-warning">{data}
                </li>
            }
            return <li key={data}>{data}</li>
        });

        const readReceipt = this.props.readReceipt.map((data) => {
           
            return <div key={data.index}>{data._data.value}</div>
        })
        const chat = this.props.prevMsgs.map((data, index) => {
            window.addEventListener("focus", function () {
                const readReceiptData = {
                    index: index,
                    user: onlineUser
                }
                if (data.user == user) {
                    return
                }
                else {
                     socket.emit('READ_RECEIPT',index,user);
                }
                return;
            }, true);
            if (!data.msg) {
                return (<li key={index} className="container">
                    <strong>{data.user}:</strong>
                    <strong className="strgcla">{data.time}</strong>
                    <p className="text-dark chat"> {data.fileName}{"."}{data.fileType}<i className={icon}></i>
                        <i className="fa fa-cloud-download ml-2 iconfa strgcla" onClick={this.downloadFile.bind(this, index)}></i>
                        <i className="fa fa-info-circle ml-2 iconfa strgcla" id="infobutton" onClick={this.infoData.bind(this, index)}></i>
                        <i className="fa fa-trash ml-2  iconfa strgcla" onClick={this.deleteData.bind(this, index)}></i>
                        <i className="fa fa-edit ml-2 iconfa strgcla" onClick={this.editData.bind(this, index)}></i>
                    </p>
                </li>)
            }
            else {
                if (this.props.user === data.user) {
                    return <li key={index} className="container">
                        <strong>{data.user}:</strong>
                        <strong className="strgcla">{data.time}</strong>
                        <p className="text-dark chat">{emojify(data.msg, { emojiType: 'emojione' })}<i className={icon}></i>
                            <i className="fa fa-info-circle ml-2 iconfa strgcla" id="dropdownMenuLink" data-toggle="dropdown" onClick={this.infoData.bind(this,index)}><div className="dropdown-menu" aria-labelledby="dropdownMenuLink">{data.delivermsg} By : {JSON.stringify(this.props.user)}</div></i>
                            {/*Seen by: {JSON.stringify(this.props.user)} */}
                            <i className="fa fa-trash ml-2 iconfa strgcla" onClick={this.deleteData.bind(this, index)}></i>
                            <i className="fa fa-edit ml-2 iconfa strgcla" onClick={this.editData.bind(this, index)}></i>
                        </p>
                    </li>
                }
                else {
                    return <li key={index} className="container">
                        <strong>{data.user}:</strong>
                        <strong className="strgcla">{data.time}</strong>
                        <p className="text-dark chat">{emojify(data.msg, { emojiType: 'emojione' })}
                        </p>
                    </li>
                }
            }

        });
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
            <div className="row">
                <div className="col-sm-3 ">
                    <h2 className="text-light">Online User</h2>
                    <div className="container"> {onlineUser} </div>
                </div>

                <div className="col-sm-9">
                    <h2 className="text-white">Chat Messages</h2>
                    <div className="divscroll">
                        <div>
                            {chat}
                            {readReceipt}
                        </div>
                    </div>
                </div>
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
                        <textarea type="text" className="form-control" rows="1" placeholder="Enter Message" onKeyPress={this.handleKeyPress} name="msg" value={this.state.msg} onChange={this.onChange}></textarea>
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
                <Notification />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    fileData: state.msgs.filedata,
    allUsers: state.allUsers.items,
    user: state.user.userObj,
    prevMsgs: state.msgs.chat,
    readReceipt: state.msgs.readreceipt,
    userTypingData: state.userTypingData.items,

})

export default connect(mapStateToProps, { sendMsg, getMsg, getAllUsers, userTyping, typingUserName, getFile, sendFile, getReadReceipt })(chatUI)