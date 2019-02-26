import React, { Component } from 'react';
import { connect } from 'react-redux';
import { sendMsg, getMsg, getFile } from '../Actions/msgAction';
import { getAllUsers } from '../Actions/userAction';
import { userTyping, typingUserName } from '../Actions/userTypingAction';
import Notification from './notification';
import Textbox from './textboxOptions';
import { emojify } from 'react-emoji';


var fileDownload = require('js-file-download');

const arr = [];

export class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            msg: '',
            file: '',
            typingUser: '',
            showingAlert: false,
            showEmoji: false,
            chatDetail: []
        }
        // this.downloadFile = this.downloadFile.bind(this);
      
    }
    componentWillMount() {
        this.props.getMsg();
        this.props.getAllUsers();
        this.props.typingUserName();
        this.props.getFile();
    }
    downloadFile = (data) => {
         this.props.fileData.map((data,index)=>{
             var fileContent ={}
             fileContent.index= index
             fileContent.fileName = data.fileName;
             fileContent.fileType = data.fileType;
             fileContent.content = data.content;
             var a = arr.indexOf(fileContent);
             arr.push(fileContent)
         })
         for(var index=0; index<arr.length;index++){
             if(arr[index].index == data){
                 fileDownload(arr[index].content, arr[index].fileName + "." + arr[index].fileType)
             }
         }
    }
    render() {
        const onlineUser = this.props.allUsers.map((data) => {
            if (this.props.user === data) {
                return <li key={data} className="text-primary">{data}
                </li>
            }
            return <li key={data}>{data}</li>
        });
        const chat = this.props.prevMsgs.map((data, index) => {
            if (!data.msg) {
                
                return (<li key={index} >
                    <strong>{data.user}: </strong>
                    <pre className="text-white"> {data.fileName}{"."}{data.fileType}
                        <button class="btn btn-secondary border-left-0 rounded-0 rounded-right" type="button" onClick={this.downloadFile.bind(this,index)}>Download</button>
                    </pre>
                </li>)
            }
            return <li key={index} >
                <strong>{data.user}: </strong>
                <pre className="text-white">{emojify(data.msg, { emojiType: 'emojione' })}
                </pre>
            </li>
        });
        return (
            <div>
                <div className="row spaceset">
                    <div className="col-md-2 col-xs-2 col-sm-2">
                        <div className="row ml-2">
                            <div className="boxx">
                                <h3 className="text-white">Online Users</h3>
                                <ul className="list-group sp text-white">
                                    {onlineUser}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-10 col-xs-10 col-sm-10 spaceset1">
                        <form>
                            <div className="form-group">
                                <div className="chat ex3">
                                    <ul className="list-group sp text-white">
                                        {chat}
                                    </ul>
                                </div>
                                {/* <Textbox /> */}
                            </div>
                        </form>
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
    prevMsgs: state.msgs.chat
})

export default connect(mapStateToProps, { sendMsg, getMsg, getAllUsers, userTyping, typingUserName, getFile })(Chat)
