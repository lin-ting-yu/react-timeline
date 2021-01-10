import React from 'react';
import { render } from 'react-dom';
import { Timeline } from './component/timeline.component';
import timelineItems from './data/timelineItems';
import './index.css';

class App extends React.Component {

  render() {
    return (
      <div className="parent-container">
        <Timeline timeItemList={timelineItems}></Timeline>
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
