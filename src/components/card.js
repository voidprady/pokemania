import React  from 'react';

const Card = (props) => {
  return(
    <div className = "card">
      <h3 className="card-title">{props.header}</h3>
      <div className="card-body">
        <p>{props.data[0]}</p>
        <p>{props.data[1]}</p>
      </div>
    </div>
  )
}

export default Card;
