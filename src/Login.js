import React, { Component } from 'react'
import './App.css';
import $ from 'jquery';
import {browserHistory, Link} from 'react-router'
import { apiUrl } from '../config'

export default class Login extends Component {
	constructor(props){
		super(props)
		this.state = {
			username: "",
			password: ""
		};

	}

	userName(event) {
		this.setState({username: event.target.value});
	}

	passWord(event) {
		this.setState({password: event.target.value});
	}

	submitLogin(){
		var self = this;
		$.ajax({
			method: 'POST',
			url: apiUrl + '/api/authenticate',
			contentType: 'application/json',
			data: JSON.stringify({
				username: this.state.username,
				password: this.state.password
			})
		})
		.done(function(result){
			self.props.login(result)
			console.log(result)
			browserHistory.push('/Homepage')
		})
	}
	keyPress(event){
	  if(event.key === 'Enter'){
	    this.submitLogin()
	  }
	}
	render() {
		return(
			<div className="App">
				<h1 className="header">Bow Wow Buddies</h1>
				<label htmlFor="Username"> Username</label>
				<input className="Username" type="textbox" onChange={this.userName.bind(this)}></input>
				<label htmlFor="Password"> Password</label>
				<input className="Password" type="password" onChange={this.passWord.bind(this)} value={this.state.password} onKeyPress={this.keyPress.bind(this)}></input>
				<button className="button" onClick={this.submitLogin.bind(this)}> Login</button><br/>
				<Link to="/profile"> Join the Bow Wow Community :)</Link>
			</div>


	)};
}
