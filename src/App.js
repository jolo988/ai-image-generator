import React, { Component } from 'react';
import ParticlesBg from 'particles-bg';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import ImageArea from './components/ImageArea/ImageArea'
import Rank from './components/Rank/Rank';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import './App.css';



//Set initial state for home page
const initialState = {
  input: '',//what the user will input
  imagePrompt: '',//imagePrompt should be displayed when clicked onbuttonsubmit
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

  //pass funct to imagelinkform INPUT
  onInputChange = (event) => {
    this.setState({input:event.target.value});
  }

  //click event to submit
  onButtonSubmit = async () => {
    this.setState({imagePrompt: this.state.input});//update imagePrompt variable w/ input from imagelinkform -> pass image text to imageArea
    
    const button = document.querySelector('button');
    button.disabled = true;
    button.innerHTML = 'Generating... <span class="spinner">🧠</span>';

    //POST request openai API
    try {
      const response = await fetch('https://serene-reef-65041.herokuapp.com/imagePrompt', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input
        })
      })

      const data = await response.json();

      if(data && data.image) {
        this.setState({imagePrompt: data.image});
        const updateResponse = await fetch('https://serene-reef-65041.herokuapp.com/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        });

        const count = await updateResponse.json();
        this.setState(Object.assign(this.state.user, { entries: count }));
      } else {
        alert(console.log('Error loading image:', data));
      }
    } catch (err) {
      alert(console.log('Error loading image:', err));
    }
    button.disabled = false;
    button.innerHTML = 'Generate';
  }
  // onButtonSubmit = () => {
  //   this.setState({imagePrompt: this.state.input});//update imagePrompt variable w/ input from imagelinkform -> pass imagePrompt to facerecognition
    
  //   const button = document.querySelector('button');
  //   button.disabled = true;
  //   button.innerHTML = 'Generating... <span class="spinner">🧠</span>';
  //   //POST request openai API
  //     fetch('https://serene-reef-65041.herokuapp.com/imagePrompt', {
  //       method: 'post',
  //       headers: {'Content-Type': 'application/json'},
  //       body: JSON.stringify({
  //         input: this.state.input
  //       })
  //     })
  //     .then(response => response.json())
  //     .then(data => {
  //       //if there's data (not null) + image
  //       if (data && data.image) {
  //         this.setState({imagePrompt: data.image});
            
  //           //update entry counter
  //           fetch('https://serene-reef-65041.herokuapp.com/image', {
  //             method: 'put',
  //             headers: {'Content-Type': 'application/json'},
  //             body: JSON.stringify({
  //               id: this.state.user.id
  //             })
  //           })
  //           .then(response => response.json())
  //           .then(count => {
  //             this.setState(Object.assign(this.state.user, { entries: count }));
  //             button.disabled = false;
  //             button.innerHTML = 'Generate';
  //           })
  //           .catch((err) => console.log('Error updating count:', err));
  //         } else {
  //           console.log('Error loading image:', data);
  //           button.disabled = false;
  //           button.innerHTML = 'Generate';
  //         }
  //       })
  //       .catch((err) => {console.log('Error loading image:', err)
  //       button.disabled = false;
  //       button.innerHTML = 'Generate';
  //       });
  // }


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
    // const { isSignedIn, imagePrompt, route } = is.state;
    return (
      <div className="App">
        <ParticlesBg className='particles' num={50} type="cobweb" bg={true} />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
        { this.state.route === 'home'
          ? <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
              <ImageArea imagePrompt={this.state.imagePrompt}/> 
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
