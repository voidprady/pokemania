import React, { Component } from 'react';
import Papa from '../node_modules/papaparse/papaparse.min.js'
import WebFont from 'webfontloader';
import logo from './images/logo.png';
import './App.css';
import Card from './components/card';
import Filter from './components/filter';

WebFont.load({
  google: {
    families : [
      'Titillium Web:300,400,700',
    ]
  }
})

class App extends Component {
  constructor(props) {
    super(props);
    this.updateData = this.updateData.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
  }
  componentWillMount() {
    var pokemon_csv = require("./pokemons.csv");
    Papa.parse(pokemon_csv, {
      header: true,
      download: true,
      skipEmptyLines: true,
      complete: this.updateData
    });
    console.log("componentWillMount");
  }
  updateData(result) {
    const data = result.data;
    this.setState({data: data}, function(){
      console.log("state updated");
    });
  }
  getTypes1(){
    let types = new Set();
    types.add("-SELECT TYPE1-");
    this.state['data'].forEach((obj, index)=>{
      types.add(obj.Type1)
    });
    return types;
  }
  getTypes2(){
    let types = new Set();
    types.add("-SELECT TYPE2-");
    this.state['data'].forEach((obj, index)=>{
      if (obj.Type1 === this.state.selectedType1) {
        types.add(obj.Type2)
      }
    });
    return types;
  }
  getmovementTypes(){
    let types = new Set();
    this.state['data'].forEach((obj, index)=>{
      types.add("-SELECT MOVEMENT TYPE-");
      if (obj.Type1 === this.state.selectedType1 && obj.Type2 === this.state.selectedType2) {
        types.add(obj.MovementType)
      }
    });
    return types;
  }
  getAvgCollisionData(){
    let collisionHead = 0;
    let filteredData = this.state.data.filter(instance => (instance.Type1 == this.state.selectedType1)&&(instance.Type2 == this.state.selectedType2)&&(instance.MovementType == this.state.selectedMovementType));

    filteredData.forEach((obj, index)=>{
      
    })
  }
  clickHandler(event){
    if (event.target.id === 'type-1') {
      this.setState({selectedType1 : event.target.value});
    }else if (event.target.id === 'type-2') {
      this.setState({selectedType2 : event.target.value});
    }else if (event.target.id === 'movement-type') {
      this.setState({selectedMovementType : event.target.value});
    }
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Pokemania !</h1>
        </header>
        {this.state && this.state.data &&
          <div>
            <div className="toppers">
              <Card data = {this.state.data.sort((a,b) => parseInt(b["BaseAttack"], 10) - parseInt(a['BaseAttack'], 10)).map(instance => [instance["Identifier"],instance["BaseAttack"]])[0]} header = {"Highest Base Attack"} />
              <Card data = {this.state.data.sort((a,b) => parseInt(b["BaseStamina"], 10) - parseInt(a['BaseStamina'], 10)).map(instance => [instance["Identifier"],instance["BaseStamina"]])[0]} header = {"Highest Base Stamina"} />
              <Card data = {this.state.data.sort((a,b) => parseInt(b["BaseDefense"], 10) - parseInt(a['BaseDefense'], 10)).map(instance => [instance["Identifier"],instance["BaseDefense"]])[0]} header = {"Highest Base Defense"} />
            </div>
            <div className="filters">
              <Filter data = {this.getTypes1()} clickHandler = {this.clickHandler} name={"Type 1"} id={"type-1"}/>
              <Filter data = {this.state.selectedType1?this.getTypes2():''} clickHandler = {this.clickHandler} name={"Type 2"} id={"type-2"}/>
              <Filter data = {this.state.selectedType1 && this.state.selectedType2?this.getmovementTypes():''} clickHandler = {this.clickHandler} name={"Movement Type"} id={"movement-type"}/>
            </div>
            <div className="stats">
              <Card data = {getAvgCollisionData()[0]} header={"Collision Radius"}/>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default App;
