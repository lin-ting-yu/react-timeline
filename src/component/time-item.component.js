import React from 'react';

export class TimeItem extends React.Component {

  constructor(props) {
    super(props);
  }

  onItemClick() {
    return () => {

    };
  }
  render() {

    return (
      <div 
        className="time-item"
        title={this.props.timeItemData.name}
      >
        <div className="text-container">{this.props.timeItemData.name}</div>
      </div>
    );
  }
}