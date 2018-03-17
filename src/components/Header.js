import React, { Component } from 'react';
import {getCity} from '../services/geolocation.js';
import {getWeather} from '../services/weather.js';

export default class HeaderContainer extends Component {
  state = {
  };
 
  getCityWeather(latitude, longitude) {
    getCity(latitude, longitude).then((city) => {                
      this.setState({currentCity: city})
    }).catch(function(err) {
      console.log('Error retrieving the current city: ', err);
    });

    getWeather(latitude, longitude).then((weather) => {
      this.setState({currentWeather: weather})
    }).catch(function(err){
      console.log('Error retrieving the current weather: ', err);
    })
  }
    
  getMyLocation = () => {    
    const cachedLatitude = localStorage.getItem('lat');
    const cachedLongitude = localStorage.getItem('lng');    

    if (cachedLatitude && cachedLongitude) {
       this.getCityWeather(cachedLatitude, cachedLongitude);     
    }    
    
    const errorLocation = (err) => {
      console.log("error retrieving current position, " + err);
    }

    const currentLocation = (position) => {
      console.log('current position is updated');
      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }

      localStorage.setItem('lat', pos.lat);
      localStorage.setItem('lng', pos.lng); 
      this.getCityWeather(pos.lat, pos.lng);
    }
  
    // Ask user for permission to use location services
    if (navigator.geolocation) {        
      navigator.geolocation.getCurrentPosition(currentLocation, errorLocation);
    } else {          
      alert('Sorry your browser doesn\'t support the Geolocation API');    
    }
  }

  componentWillMount() {
    this.getMyLocation();
  }

  render () {
    const message = (this.state.currentCity && this.state.currentWeather) ?
    `Welcome - You are in ${this.state.currentCity} and the temperature is ${this.state.currentWeather} °F` :
    `Welcome`;
    return(
        <h3 className="header">
          {message}
      </h3>
    );
  }
}