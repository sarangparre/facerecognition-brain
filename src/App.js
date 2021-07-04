import React,  {Component} from 'react';
import './App.css';
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './components/ImageLinkForm/ImageLinkForm.css'
import axios from 'axios';

const particleOptions = {
  
  particles: {
      number:{
        value: 30,
        density: {
          enable: true,
          value_area: 200
      }
    }
  }
}

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: new Date()
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {initialState}
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })
  }


  calculateFaceLocation = (data) => {
    const rapidApiFace = data.data.detected_faces[0].BoundingBox;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
        startX: rapidApiFace.startX * width,
        startY: rapidApiFace.startY * height,
        endX : width - (rapidApiFace.endX * width),
        endY : height - (rapidApiFace.endY * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box})
  }

  onInputChange = (event) => {
      this.setState({input: event.target.value})
  }
  
  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    const options = {
      method: "POST",
      url: "https://face-detection6.p.rapidapi.com/img/face",
      headers: {
        "content-type": "application/json",
        "x-rapidapi-key":"887cd92ff3mshdf6de250a271eb3p1d2741jsnb56259012d5d",
        "x-rapidapi-host": "face-detection6.p.rapidapi.com",
      },
      data: { url: "", accuracy_boost: 2 },
    }
    options.data.url = this.state.input

    axios
      .request(options)
      .then((response) => {
        if (response) {
          fetch(" https://warm-coast-88754.herokuapp.com/image", {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            })

        }
        this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch((error) => console.error(error));
  };

  onRouteChange = (route) => {
    if(route === 'signin') {
      this.setState(initialState)
    }else if (route === 'home'){
      this.setState({isSignedIn: true})
      
    }
    this.setState({route: route})
  }

  render() {
    const { route, isSignedIn, box, imageUrl } = this.state;
    return(
      <div className="App">
    <Particles className='particles'
                params={particleOptions} />
      <Navigation isSignedIn = {isSignedIn} onRouteChange = {this.onRouteChange}/>
    { route === 'home' 
    ?<div>
      <Logo />
      <Rank 
      name={this.state.user.name}
      entries={this.state.user.entries}
      />
      <ImageLinkForm onInputChange = {this.onInputChange} onButtonSubmit = {this.onButtonSubmit}/>
      <FaceRecognition box={box} imageUrl={imageUrl} />
       </div> 
    : (
      this.state.route === 'signin' 
      ? <Signin loadUser = {this.loadUser} onRouteChange = {this.onRouteChange}/>
      : <Register loadUser = {this.loadUser} onRouteChange = {this.onRouteChange}/>
    ) 

     } 
      
    </div>
    )
  }
}

export default App;
