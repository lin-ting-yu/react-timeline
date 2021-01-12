import React from 'react';
import { TimeItem } from './time-item.component';
import * as dayjs from 'dayjs'

export class Timeline extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dayWidth: 20,
            paddingDay: 10,
            year: [], // string[]
            day: [], // { format: string; day: dayjs; pos: 'flex-start' | 'center' | 'flex-end', left: number }
            scrollLeft: 0
        }
        // 排序
        this.timeItemList = this.sortTimeItemList();
        // 設定最早日期
        this.firstDayjs = dayjs(this.timeItemList[0].start);
        this.setRowListAndFindLast();
        this.state.year = this.state.year.sort();
        this.yearReverse = [...this.state.year].reverse();
    }
    // readonly value: start;
    timeItemList = null;
    firstDayjs = null;
    lastDayjs = null;

    timeHeight = 30;
    topPadding = 10;
    rowPadding = 20;

    rowList = [];

    // readonly value: end;
    isMouseEnter = true;
    isItemMouseEnter = false;

    sortTimeItemList() {
        return this.props.timeItemList.sort((a, b) => {
            if (dayjs(a.start).isBefore(b.start)) { return -1; }
            if (dayjs(a.start).isAfter(b.start)) { return 1; }
            return 0;
        });
    }
    setRowListAndFindLast() {
        this.timeItemList.forEach((time) => {
            let isAdd = false;
            let stareYear = time.start.slice(0, 4)
            let endYear = time.end.slice(0, 4)
            if (!this.state.year.find(y => y === stareYear)) {
                this.state.year.push(stareYear);
            }
            if (!this.state.year.find(y => y === endYear)) {
                this.state.year.push(endYear);
            }

            this.rowList.forEach((row, i) => {
                // 設定最晚日期
                if (!this.lastDayjs || this.lastDayjs.isBefore(time.end)) {
                    this.lastDayjs = dayjs(time.end);
                }
                if (isAdd) {
                    return false;
                }
                if (row.length && row[row.length - 1]) {
                    if (dayjs(row[row.length - 1].end).isBefore(time.start)) {
                        row.push(time);
                        isAdd = true;
                    }
                }
            })
            if (!isAdd) {
                this.rowList.push([time]);
            }
        });
    }

    drawItem() {
        const result = [];
        const paddingDay = this.state.paddingDay + 1;
        const onItemMouseEnter = (e) => {
            const rect = e.target.getBoundingClientRect()
            this.isItemMouseEnter = true;
            this.setState({ day: [
                this.calcDay(rect.left, 'M/D', 'flex-end'),
                this.calcDay(rect.right, 'M/D', 'flex-start'),
            ] });
        }
        const onItemMouseLeave = (e) => {
            this.isItemMouseEnter = false;
        }
        this.rowList.forEach((row, rowIndex) => {
            row.forEach(time => {
                const style = {
                    height: `${this.timeHeight}px`,
                    width: `${(dayjs(time.end).diff(time.start, 'day') + 1) * this.state.dayWidth}px`,
                    top: `${this.topPadding + this.rowPadding + rowIndex * (this.timeHeight + this.rowPadding)}px`,
                    left: `${Math.abs(this.firstDayjs.diff(time.start, 'day') - paddingDay) * this.state.dayWidth}px`
                };
                result.push((
                    <div
                        key={time.id}
                        style={style}
                        className="time-item-container"
                        onMouseEnter={onItemMouseEnter}
                        onMouseLeave={onItemMouseLeave}
                    >
                        <TimeItem timeItemData={time}></TimeItem>
                    </div>
                ))
            })
        })
        return result;
    }



    drawYear() {
        const firstDayjs = this.firstDayjs.subtract(this.state.paddingDay, 'day');
        const fourDayWidth = this.state.dayWidth * 8;
        const padding = this.state.dayWidth * 2;
        let nextLeft = window.innerWidth;
        return this.yearReverse.map(year => {
            let left = 0
            if (nextLeft < fourDayWidth) {
                left = padding - (fourDayWidth - nextLeft);
            } else {
                left = (dayjs(`${year}-1-1`).diff(firstDayjs, 'day') + 1) * this.state.dayWidth - this.state.scrollLeft - 5;
                if (left < padding) {
                    left = padding;
                } else if (left > window.innerWidth) {
                    left = window.innerWidth + 10;
                }
            }
            nextLeft = left;
            const style = { left: left + 'px' };
            return (<div key={year} style={style} className="timeline-year">{year}</div>)
        })
    }

    drawMonth() {
        const monthList = [];
        const firstDayjs = this.firstDayjs.subtract(this.state.paddingDay, 'day');
        const lastDayjs = this.lastDayjs.add(this.state.paddingDay, 'day');
        this.state.year.forEach(year => {
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].forEach(month => {
                const monthFirstDayjs = dayjs(`${year}-${month}-1`);
                if (
                    monthFirstDayjs.isBefore(firstDayjs) ||
                    monthFirstDayjs.isAfter(lastDayjs)
                ) {
                    return false;
                }
                monthList.push(monthFirstDayjs);
            })
        });
        return monthList.map((month, i) => {
            let style;
            if (!i) {
                style = {
                    marginLeft: ((month.diff(firstDayjs, 'day') + 1) * this.state.dayWidth) + 'px'
                };
            } else {
                style = {
                    marginLeft: ((month.diff(monthList[i - 1], 'day')) * this.state.dayWidth) + 'px'
                };
            }
            return (
                <div key={month.format('YYYY-MM-DD')} style={style} className="timeline-month">{month.format('M')}</div>
            )
        });
    }

    calcDay(pageX, format, pos) {
        const dayLength = ~~((pageX + this.state.scrollLeft) / this.state.dayWidth);
        return {
            format,
            day: this.firstDayjs.add(dayLength - this.state.paddingDay - 1, 'day'),
            pos,
            left: pageX + this.state.scrollLeft
        }
    }
    drawDay() {
        return this.state.day.map(dayData => {
            return (
                <div
                    key={dayData.day.format('YYYY-MM-DD')}
                    style={{
                        left: `${dayData.left}px`,
                        alignItems: dayData.pos
                    }}
                    className="timeline-day"
                ><div className="text">{dayData.day.format(dayData.format)}</div></div>
            )
        })

    }

    render() {
        const timeItemList = this.drawItem();
        const yearList = this.drawYear();
        const monthList = this.drawMonth();
        const dayList = this.drawDay();
        const dayStyle = {
            width: (this.lastDayjs.diff(this.firstDayjs, 'day') + 1 + this.state.paddingDay * 2) * this.state.dayWidth + 'px'
        };
        const onTimeScroll = (e) => {
            this.setState({ scrollLeft: e.target.scrollLeft });
        };
        const onTimeMouseMove = (e) => {
            if (this.isItemMouseEnter) {
                return;
            }
            this.setState({ day: [this.calcDay(e.pageX, 'D', 'center')] });
        };
        const onTimeMouseEnter = (e) => {
            this.isMouseEnter = true;
            this.setState({ day: [this.calcDay(e.pageX, 'D', 'center')] });
        };
        const onTimeMouseLeave = (e) => {
            this.isMouseEnter = false;
            this.setState({ day: [] });
        };
        return (
            <div className="timeline-container">
                <div
                    className="timeline-title"
                    style={{ padding: `20px ${this.state.dayWidth * 2}px` }}
                >Airtable Timeline</div>
                <div className="timeline-content">
                    <div className="timeline-year-list">
                        {yearList}
                    </div>
                    <div
                        className="timeline-scroll-container"
                        onScroll={onTimeScroll}
                        onMouseEnter={onTimeMouseEnter}
                        onMouseLeave={onTimeMouseLeave}
                        onMouseMove={onTimeMouseMove}
                    >
                        <div className="timeline-month-list">
                            {monthList}
                        </div>
                        <div
                            className="timeline-day-list"
                            style={dayStyle}
                        >
                            <div className="timeline-day">
                                {dayList}
                            </div>
                        </div>
                        <div
                            className="timeline-time-container"
                            style={dayStyle}
                        >
                            {timeItemList}
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}