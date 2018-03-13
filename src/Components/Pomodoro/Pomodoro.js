import React, {Component} from 'react';
import './../../styles/App.css';
import Footer from './../Footer/Footer';
import GithubCorner from 'react-github-corner';
import {Howl, Howler} from 'howler';
//the title component doesnt work with react 16.2.0?


class Pomodoro extends Component {
constructor(props){
  super(props);
    this.state={
      time: "",
      timeType: 0,
      title: '',
      play: false
  }

   this.setTimeForCode = this.setTime.bind(this, 1500);
   this.setTimeForSocial = this.setTime.bind(this, 300);
   this.setTimeForCoffee = this.setTime.bind(this, 900);
   this.reset = this.reset.bind(this);
   this.play = this.play.bind(this);
   this.elapseTime = this.elapseTime.bind(this);
}
format(seconds){
  let m = Math.floor(seconds % 3600 / 60);
  let s = Math.floor(seconds % 3600 % 60);
  let timeFormated = (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
  return timeFormated;
}

componentDidMount() {
  this.setDefaultTime();
  Notification.requestPermission();
}

elapseTime() {
  if (this.state.time === 0) {
    this.reset(0);
    this.alert();
  }
  if (this.state.play === true) {
    let newState = this.state.time - 1;
    this.setState({time: newState, title: this.getTitle(newState)});
  }
}

getFormatTypes(){
  return [
    {type:"code", time: 1500},
    {type: "social", time: 300},
    {type: "coffee", time: 900}
  ]
}



formatType(timeType){
  let timeTypes = this.getFormatTypes();
  for(let i=0; i<timeTypes.length;i++){
    let timeObj = timeTypes[i];
    if(timeObj.time === timeType) {
      return timeObj.type;
    }
  }
}


getTitle(time) {
  time = typeof time === 'undefined' ? this.state.time : time;
  let _title = this.format(time) + ' | Pomodoro timer';
  return _title;
}

setTime(newTime) {
  this.restartInterval();
  
  this.setState({
    time: newTime, 
    timeType: newTime, 
    title: this.getTitle(newTime), 
    play: true
  });
}

setDefaultTime() {
  let defaultTime = 1500;

  this.setState({
    time: defaultTime, 
    timeType: defaultTime, 
    title: this.getTitle(defaultTime), 
    play: false
  });
}

  play() {
    if (true === this.state.play) return; 
    
    this.restartInterval();
    
    this.setState({ 
      play: true 
    });
  }

reset(resetFor = this.state.time) {
  clearInterval(this.interval);
  let time = this.format(resetFor);
  this.setState({play: false});
}

  restartInterval() {
    clearInterval(this.interval);
    this.interval = setInterval(this.elapseTime, 1000);
  }
  

  alert() {
    // vibration
    if(this.refs.vibrate.checked) {
      window.navigator.vibrate(1000);
    }
    // audio
    if(this.refs.audio.checked) {
      const audio = new Howl({
        src: ['http://www.sousound.com/music/healing/musicbox_01.mp3'],
      });
      audio.play();
      setTimeout(() => audio.pause(), 9400)

    }
    // notification
    if(this.refs.notification.checked) {
      if (this.state.timeType === 1500) {
        let notification = new Notification("Relax :)", {
          icon: "http://www.pngmart.com/files/4/Coffee-Cup-PNG-Free-Download.png",
          lang: "pl",
          body: "Gooo talk or drink a coffee."
        });
      } else {
        let notification = new Notification("The time is over!", {
          icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTorBqYYYajvOmUQXMzWijfe8Mvv6T99yH5avvY2r6mcD6dr_nH",
          lang: "pl",
          body: "Heyyy, back to code!"
        });
      }
    }
  }


  render() {
    return (
      <div className="main pomodoro">
        <GithubCorner
          href="https://github.com/insomnia1337"
          bannerColor="rgba(0, 252, 134, 0.904)"
          octoColor="#272727"
        />
        <div className="container display">
          <span className="time">{this.format(this.state.time)}</span>
          <span className="timeType">The {this.formatType(this.state.timeType)} time!</span>
        </div>
        <div className="container display">
          <button className="btn" onClick={this.setTimeForCode}>Code</button>
          <button className="btn" onClick={this.setTimeForCoffee}>Coffee</button>
          <button className="btn" onClick={this.setTimeForSocial}>Social</button>
          
        </div>
        <div className="container">
          <div className="controlsPlay">
            <button className="play btnIcon" onClick={this.play}>
              <i className="fas fa-play"></i>
            </button>
            <button className="stop btnIcon" onClick={this.reset}>
              <i className="fas fa-stop"></i>
            </button>
          </div>
        </div>
        <div className="bottomBar">
          <div className="controls">
            <div className="container">
              <div className="controlsLink"><a href="https://en.wikipedia.org/wiki/Pomodoro_Technique" target="_blank">What is Pomodoro?</a></div>
              <div className="controlsCheck">
                <span className="check"><input ref="notification"  type="checkbox" id="notification"/><label htmlFor="notification">Notification</label></span>
                <span className="check"><input ref="audio" type="checkbox" id="audio"/><label htmlFor="audio">Sound</label></span>
                <span className="check"><input ref="vibrate" type="checkbox" id="vibrate"/><label htmlFor="vibrate">Vibration</label></span>
              </div>

            </div>
          </div>
          <Footer/>
        </div>
      </div>

    );
  }
}

export default Pomodoro;
