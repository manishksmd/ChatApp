import React, { Component } from 'react';
import { addUser } from '../Actions/userAction';
import { connect } from 'react-redux';
import { alreadyUsers } from '../Actions/userAction';
import { fakeAuth } from '../App';
import { getMsg, getFile } from '../Actions/msgAction';
import { getAllUsers, getOnlineUsers } from '../Actions/userAction';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            redirectToReferrer: false
        }
        this.onChange = this.onChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentWillMount() {
        this.props.alreadyUsers();
        this.props.getAllUsers();
        this.props.getMsg();
        this.props.getFile();
        this.props.getOnlineUsers();
    }
    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }
    handleSubmit(e) {
        e.preventDefault();
        for (var index = 0; index < this.props.onlineUser.length; index++) {
            if (this.props.onlineUser[index] === this.state.name) {
                alert("Enter different Usename");
                return;
            }
        }
        fakeAuth.authenticate();
        const userName = {
            Name: this.state.name
        }
        this.setState({ name: '' });
        this.props.addUser(userName);
        this.props.history.push('/chat')
    }
    render() {
        return (
            <div className="row center1">
                <div className="col-md-4">
                    <h1 className="form-inline text-center text-light">Chat Application</h1>
                    <form className="form-inline">
                        <div className="form-group">
                            <input className="form-control mr-2 mt-1" type="text" placeholder="Enter Your Name" name="name" value={this.state.name} onChange={this.onChange} required />
                            <button type="button" className="btn btn-secondary border-left-0 rounded-0 rounded-right mt-1" disabled={!this.state.name} onClick={this.handleSubmit}>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    users: state.users.items,
    allUsers: state.allUsers.items,
    aleryUser: state.alreadyUsers.item,
    onlineUser: state.user.onlineUserName,
})

export default connect(mapStateToProps, { addUser, alreadyUsers, getMsg, getAllUsers, getFile, getOnlineUsers })(Login)
