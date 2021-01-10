import React from 'react';
import './time-item.css';


export class TimeItem extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      index: 0
    }
    this.index = this.state.index;
  }

  onItemClick(event) {
    return () => {
      this.index++; 
      console.log('click', this.index, event);
      this.setState({index: this.index} )
    };
  }
  render() {
    const style = {
      backgroundColor: 'red',
      font: 'inherit',
      border: '1px solid blue',
      padding: '8px',
      cursor: 'pointer'
    };

    if (this.index % 2) {
      style.backgroundColor = 'green';
    }

    return (
      <div>
        <h2 style={style} onClick={this.onItemClick(133564)}>Item {this.props.name} {this.index}</h2>
      </div>
    );
  }
}