import React, { Component } from 'react';
import Papa from '../node_modules/papaparse/papaparse.min.js'
import WebFont from 'webfontloader';
import logo from './images/logo.png';
import './App.css';
import Card from './components/card';
import Filter from './components/filter';
import Chart from './components/chart';

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
    this.state = {
      'selectedType1':'ALL',
      'selectedType2':'ALL'
    }
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
    types.add("ALL");
    this.state['data'].forEach((obj, index)=>{
      types.add(obj.Type1)
    });
    return types;
  }
  getTypes2(){
    let types = new Set();
    types.add("ALL");
    this.state['data'].forEach((obj, index)=>{
      if (obj.Type1 === this.state.selectedType1) {
        types.add(obj.Type2)
      }
    });
    return types;
  }
  getmovementTypeDistribution(filteredData){
    var movementTypes = new Map();
    filteredData.forEach((obj, index)=>{
      if(!movementTypes.has(obj.MovementType)){
        movementTypes.set(obj.MovementType, 1);
      }else {
        movementTypes.set(obj.MovementType, movementTypes.get(obj.MovementType)+1);
      }
    })
    return movementTypes;
  }
  getAvgCollisionData(filteredData){
    let collisionData = [0.0, 0.0, 0.0];

    filteredData.forEach((obj, index)=>{
      if (obj['CollisionHeadRadiusM']) {
        collisionData[0] += parseFloat(obj['CollisionHeadRadiusM'])
      }
      if (obj['CollisionHeightM']) {
        collisionData[1] += parseFloat(obj['CollisionHeightM'])
      }
      if (obj['CollisionRadiusM']) {
        collisionData[2] += parseFloat(obj['CollisionRadiusM'])
      }
    })

    collisionData.forEach((obj, index) => {
      obj /= filteredData.length;
    })
    return collisionData;
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
    if (this.state && this.state.data) {
      var filteredData = this.state.data.filter(instance => (this.state.selectedType1 === 'ALL' || instance.Type1 === this.state.selectedType1)&&(this.state.selectedType2 === 'ALL' || instance.Type2 === this.state.selectedType2));
      // console.log(filteredData);

      var collisionStats = this.getAvgCollisionData(filteredData);
      var movementTypeDistribution = this.getmovementTypeDistribution(filteredData);
    }
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
              <Filter data = {this.getTypes2()} clickHandler = {this.clickHandler} name={"Type 2"} id={"type-2"}/>
            </div>
            <div className="stats">
              <Card data = {[collisionStats[0].toFixed(2)]} header = {"Average Collision Head Radius"} />
              <Card data = {[collisionStats[1].toFixed(2)]} header = {"Average Collision Height"} />
              <Card data = {[collisionStats[2].toFixed(2)]} header = {"Average Collision Radius"} />
            </div>
            <Chart bindId={"pie1"} columns={movementTypeDistribution} chartType={'donut'} header={"Movement Type Distribution"}/>
          </div>
        }
      </div>
    );
  }
}

export default App;
