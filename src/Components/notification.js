import React, { Component } from 'react'
import { connect } from 'react-redux'
import { disConnctedUser } from '../Actions/userAction';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';
import 'react-s-alert/dist/s-alert-default.css';

export class Notification extends Component {

    componentDidMount() {
        this.props.disConnctedUser();
    }
  
    render() {
        const notification = this.props.disconnected.map((data, index) => {
            const user = data.user;
            const msg = data.msg;
            Alert.info(user + msg, {
                position: 'bottom-right',
                effect: 'jelly'
            })
        })
        return (
            <div>
                {notification}
                <Alert stack={true} timeout={3000} />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    disconnected: state.disconnected.user
})


export default connect(mapStateToProps, { disConnctedUser })(Notification)
