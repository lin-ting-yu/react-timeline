import React from 'react';
import { render } from 'react-dom';
import { Timeline } from './component/timeline.component';
import { EditTime } from './component/edit-time.component';
import timelineItems from './data/timelineItems';
import './index.css';
import * as dayjs from 'dayjs'

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
      isAdd: false,
      time: null,
      timeItemList: timelineItems
    }
  }

  onEditTimeEvent = (time) => {
    this.setState({
      isEdit: true,
      time
    })
  }

  onCloseEdit = () => {
    this.setState({
      isEdit: false,
      isAdd: false,
      time: null
    })
  }
  onConfirmEdit = (newTime, isDelete = false) => {
    const innerTimeItemList = [...this.state.timeItemList];
    if (this.state.isEdit) {
      let index = -1;
      const time = innerTimeItemList.find((time, i) => {
        if (time.id === newTime.id) {
          index = i;
          return true;
        }
        return false;
      });
      if (isDelete) {
        innerTimeItemList.splice(index, 1);
      } else {
        if (JSON.stringify(newTime) === JSON.stringify(time)) {
          this.setState(
            {
              isEdit: false,
              isAdd: false,
              time: null
            }
          )
          return;
        }
        innerTimeItemList[index] = newTime;
      }
    } else if (this.state.isAdd) {
      innerTimeItemList.push(newTime);
    }
    this.setState(
      {
        isEdit: false,
        isAdd: false,
        time: null,
        timeItemList: innerTimeItemList
      }
    )
  }

  getEditTime() {
    if (this.state.isEdit || this.state.isAdd) {
      return (
        <EditTime
          timeData={this.state.time}
          onCloseEdit={this.onCloseEdit}
          onConfirmEdit={this.onConfirmEdit}
          isCanDelete={this.state.isEdit}
        ></EditTime>
      );
    }
  }

  getTimeline() {
    return (
      <Timeline
        timeItemList={this.state.timeItemList}
        onEditTime={this.onEditTimeEvent}
      ></Timeline>
    )
  }

  render() {
    const EditTime = this.getEditTime();
    const timeline = this.getTimeline();
    const onAddClick = () => {
      const today = dayjs().format('YYYY-MM-DD');
      this.setState({
        isAdd: true,
        day: {
          id: new Date().getTime(),
          name: '',
          start: today,
          end: today,
          color: '#333333'
        }
      })
    }
    return (
      <div className="parent-container">
        <div
          className="add-btn"
          onClick={onAddClick}
        ></div>
        {timeline}
        {EditTime}
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
