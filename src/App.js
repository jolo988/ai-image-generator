import React, { Component } from 'react';
import ParticlesBg from 'particles-bg';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import Rank from './components/Rank/Rank';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import './App.css';

/*
1) create frontend component (including inputs)
2) style components
3) create/test frontend onRouteChange to capture data (Class/routes)
4) load data to app (frontend)
5) Connect to backend server
6) load user + route change home
*/

//Set initial state for home page
const initialState = {
  input: '',//what the user will input
  imageURL: '',//imageURL should be displayed when clicked onbuttonsubmit
  route: 'signin', //keeps track of which page user is in(app starts on signin page)
  isSignedIn: false,
      //when user joins -> these will be updated in server -> DB
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: '',
  }
}
//create state for app to know value that user enters/remembers & updates it
class App extends Component {
  constructor() {
    super();
    this.state = initialState;
    }

  //update state w/ user that's received
  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  //property of App: receive an event when input changes
  //get value from user input (event.target.value)
  //pass funct to imagelinkform INPUT
  onInputChange = (event) => {
    this.setState({input:event.target.value});
  }

  //click event to submit
  onButtonSubmit = () => {
    this.setState({imageURL: this.state.input});//update imageURL variable w/ input from imagelinkform -> pass imageURL to facerecognition

    //POST request openai API
      fetch('http://localhost:8081/imageURL', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input
        })
      })
      .then(response => response.json())
      
      //PUT req to update entry count
      .then(response => {
        if (response) {
          fetch('http://localhost:8081/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count }))
          })
          .catch(console.log)
        }
      })
      .catch((err) => console.log(err));
  }


  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }
  //after signin button clicks -> goes route changes to first page
  //dynamically use route -> route is what we give it

  render() {
    // const { isSignedIn, imageURL, route } = is.state;
    return (
      <div className="App">
        <ParticlesBg className='particles' num={100} type="cobweb" bg={true} />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
        { this.state.route === 'home'
          ? <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
              <FaceRecognition imageURL={this.state.imageURL}/> 
            </div>
          : (
            this.state.route === 'signin'
            ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          )
        }
      </div>
    );
  }
}

export default App;
