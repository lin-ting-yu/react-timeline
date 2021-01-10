import React from 'react';
import { TimeItem } from './time-item.component';
import * as dayjs from 'dayjs'

export class Timeline extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            zoom: 1
        }
    }

    get timeItemList() {
        return this.props.timeItemList.sort((a, b) => {
            if (dayjs(a.start).isBefore(b.start)) { return -1; }
            if (dayjs(a.start).isAfter(b.start)) { return 1; }
            return 0;
        })
    }

    render() {
        return (
            <div className="timeline-container">
                <div className="timeline-title">Airtable Timeline</div>
                <div className="timeline-content">
                    <div className="timeline-year">2018</div>
                    <div className="timeline-scroll-container">
                        <div className="timeline-month-list">
                            <div className="timeline-month">10</div>
                        </div>
                        <div className="timeline-day">25</div>
                        <div className="timeline-time-container">
                            <div style={{height: 1000 + 'px'}}>2222</div>
                        </div>
                    </div>



                </div>
            </div>
        );
    }
}