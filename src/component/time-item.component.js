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
    const onClick = () => this.props.timeItemData;
    return (
      <div 
        className="time-item"
        title={this.props.timeItemData.name}
        onClick={onClick}
        style={{
          backgroundColor: this.props.timeItemData.color
        }}
      >
        <div className="text-container">{this.props.timeItemData.name}</div>
      </div>
    );
  }
}