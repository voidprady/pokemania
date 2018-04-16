import React  from 'react';

const Filter = (props) => {
  var createOptions = () => {
    let options = [];
    for (let item of props.data) {
      options.push(<option key={item} value={item}>{item}</option>);
    }
    return options;
  }
  return (
    <div className="filter">
      <span className="filter-name">{props.name+": "}</span>
      <select className="filt" onChange={props.clickHandler} id={props.id}>
      {createOptions()}
      </select>
    </div>
  )
}

export default Filter;
