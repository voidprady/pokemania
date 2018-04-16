import React, { Component }  from 'react';
import c3 from 'c3/c3.js';
import 'c3/c3.css';

class Chart extends Component {
  constructor(props){
    super(props);
    this._updateChart = this._updateChart.bind(this);
  }
  componentDidMount() {
    this._updateChart();
  }
  componentDidUpdate() {
    this._updateChart();
  }
  _updateChart() {
    let columns = [];
    for (var [key,value] of this.props.columns) {
      columns.push([key,value]);
    }
    console.log(columns);
    const chart = c3.generate({
      bindto: '#'+this.props.bindId,
      data: {
        columns: columns,
        type: this.props.chartType
      }
    });
  }
  render() {
    return(
      <div>
        <h3 className="chart-title">{this.props.header}</h3>
        <div id={this.props.bindId}></div>;
      </div>
    )

  }
}

export default Chart;
