import React from 'react';
import { TimeItem } from './time-item.component';
import * as dayjs from 'dayjs'

export class Timeline extends React.Component {

    constructor(props) {
        super(props);
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
            <div>
                <h1>Airtable Timeline</h1>
                <h3>{this.timeItemList.length} timeline items to render</h3>
                <div><TimeItem name="aaaa"></TimeItem></div>
            </div>
        );
    }
}