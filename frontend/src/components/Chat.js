import React from "react";
import io from "socket.io-client";
import { connect } from 'react-redux'

class Chat extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            message: '',
            messages: []
        };

        this.socket = io('localhost:8080');

        this.socket.on('RECEIVE_MESSAGE', function(data){
            addMessage(data);
        });

        const addMessage = data => {
            this.setState({messages: [...this.state.messages, data]});
        };

        this.sendMessage = ev => {
            ev.preventDefault();
            this.socket.emit('SEND_MESSAGE', {
                author: this.props.currentUser,
                message: this.state.message
            })
            this.setState({message: ''});

        }
    }
    render(){
      return (
        <div className="container">
          <div className="row">
            <div className="col-4">
              <div className="card">
                <div className="card-body">
                  <div className="card-title">Global Chat</div>
                    <hr/>
                    <div className="messages">
                      {this.state.messages.map(message => {
                      return (
                        <div>{message.author}: {message.message}</div>
                      )
                      })}
                    </div>
                  </div>
                  <div className="card-footer">
                      <input type="text" placeholder="Message" className="form-control" value={this.state.message} onChange={ev => this.setState({message: ev.target.value})}/>
                      <br/>
                      <button onClick={this.sendMessage} className="btn btn-primary form-control">Send</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
}

const mapStateToProps = state => {
  return {
    currentUser: state.user.currentUser
  }
}

export default connect(mapStateToProps)(Chat);
