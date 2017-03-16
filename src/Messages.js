import React, { Component } from 'react'
import logo from './logo.svg';
import './App.css';
import $ from 'jquery';
import MessagePane from './MessagePane'
import { browserHistory } from 'react-router'

export default class Messages extends Component {
  constructor(props){
    super(props)
    this.state = {
      to: "",
      text: "",
      messages : []
    };
  }

  componentDidMount(){

    setInterval(this.recieveMessage.bind(this), 3000)

  }

  fromSet() { 
    this.setState({from: this.props.username}); //since the username is a prop, we do not have to set it in the state, set it as the 'from' field here. 
  }
  toSet(event){
    this.setState({to: event.target.value});
  }
  textSet(event) {
    this.setState({text: event.target.value});
  }
  keyPress(event){
    if(event.key === 'Enter'){
      this.submitMessage()
    }
  }

  submitMessage(){
    $.ajax({
        method: 'POST', 
        url:'http://localhost:3001/api/messages',
        contentType: 'application/json',
        data: JSON.stringify({
            from: this.props.username,
            to: this.state.to,
            text: this.state.text,
            token: this.props.token // require a token becuase we tell this route to requireLogin, this ajax call needs authorization
          })
    })
      .done((result) => {
        this.setState({text: ''})//after it submits a message, it clears out the text inbox and lets that message RIP! 
        this.recieveMessage()
    }) 
  }

recieveMessage(){

    var self = this 
    $.get('http://localhost:3001/api/messages', 
        {
          user: this.state.to, //recieve messages from the 'to' field
          token: this.props.token //checking token to authenticate the user for the ajax call to go through
        }, 
        function(response){ 
            self.setState({messages : response})
        })
  }

    render() {
      if(this.props.cookieLoaded && !this.props.token){ //if the cookie has not loaded or a token has not been granted; you are re-directed to /Login
        browserHistory.push('/Login') // 'push' you to login page
      }
      return (
        <div>
        {this.props.token ? 'You are logged in!' : 'NOT LOGGED IN'}
        <div className="App">
        <h2>HMU</h2>
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
          </div>
          <div>
            <label htmlFor="to">To:</label>
            <input className="to" type="textbox" onChange={this.toSet.bind(this)}></input> <br/>
            <br/><textArea className="Message" value={this.state.text} onKeyPress={this.keyPress.bind(this)} placeholder="Enter Message" onChange={this.textSet.bind(this)}></textArea><br/>
            <button onClick={this.submitMessage.bind(this)}>Submit</button><br/> <br/>
          </div>
          <div>
            <MessagePane messages={this.state.messages.slice(this.state.messages.length - 5)} /> {/*limits message history to the last five messages / lines*/}
          </div>
        </div>
        </div>
      );
    }
}