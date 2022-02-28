import React from 'react';

export class TimeItem extends React.Component {

  constructor(props) {
    super(props);
  }

  onItemClick() {
    return () => {

    };
  }
  getTextColor(bgColor) {
    const isHex = bgColor[0] === '#';
    let colorList = [];
    if (isHex) {
      colorList = bgColor.match(/[a-fA-F\d]./g).map(num => parseInt(num, 16));
    } else {
      colorList = bgColor.match(/(\d+)/g).map(num => +num);
    }
    const half = colorList.reduce((a, b) => a + b, 0) / 3;
    if (half < 127) {
      return '#eeeeee';
    }
    return '#111111';
  }

  render() {
    const onClick = () => this.props.timeItemData;
    return (
      <div
        className="time-item"
        title={this.props.timeItemData.name}
        onClick={onClick}
        style={{
          backgroundColor: this.props.timeItemData.color,
          color: this.getTextColor(this.props.timeItemData.color)
        }}
      >
        <div className="text-container">{this.props.timeItemData.name}</div>
      </div>
    );
  }
}