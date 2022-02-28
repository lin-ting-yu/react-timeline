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
        window.addEventListener('keydown', this.windowKeydown);
        window.addEventListener('keyup', this.wondowKeyup);

        this.oldTimeItemList = props.timeItemList;
        this.init(this.props, this.state);

        let prevMode = ''; // M || L

        const checkSize = () => {
            let mode = '';
            if (window.innerWidth < 768) {
                this.titlePadding = 20;
                mode = 'M';
            } else {
                this.titlePadding = 40;
                mode = 'L';
            }
            if (mode !== prevMode) {
                prevMode = mode;
                this.setState({});
            }
        }
        window.addEventListener('resize', () => {
            checkSize();
        })
        checkSize();
    }

    // readonly value: start;
    timeItemList = null;
    firstDayjs = null;
    lastDayjs = null;

    timeHeight = 30;
    topPadding = 20;
    rowPadding = 20;
    titlePadding = 40;

    rowList = [];

    // readonly value: end;
    isKeydown = false;
    isMouseEnter = true;
    isItemMouseEnter = false;
    oldTimeItemList = null

    windowKeydown = (e) => {
        if (this.isKeydown) {
            return;
        }
        this.isKeydown = true;
        if (e.code === 'Minus') {
            if (this.state.dayWidth > 10) {
                this.setState({
                    dayWidth: this.state.dayWidth - 5,
                    day: []
                });
            }
        } else if (e.code === 'Equal') {
            if (this.state.dayWidth < 100) {
                this.setState({
                    dayWidth: this.state.dayWidth + 5,
                    day: []
                });
            }
        }
    };

    wondowKeyup = (e) => {
        if (e.code === 'Minus' || e.code === 'Equal') {
            this.isKeydown = false;
        }
    };

    shouldComponentUpdate(props, state) {
        if (this.oldTimeItemList !== props.timeItemList) {
            this.oldTimeItemList = props.timeItemList;
            this.init(props, state);
        }
        return true;
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.windowKeydown);
        window.removeEventListener('keyup', this.wondowKeyup);
    }

    init(props, state) {
        this.rowList = [];
        // 排序
        this.timeItemList = this.sortTimeItemList(props, state);
        // 設定最早日期
        this.firstDayjs = dayjs(this.timeItemList[0].start);
        this.lastDayjs = null;
        this.setRowListAndFindLast(props, state);
        const firstDayjs = this.firstDayjs.subtract(this.state.paddingDay, 'day').format('YYYY');
        const lastDayjs = this.lastDayjs.add(this.state.paddingDay, 'day').format('YYYY');
        state.year = [];
        for (let year = +firstDayjs; year <= +lastDayjs; year++){
            state.year.push(year + '');
        }
        this.yearReverse = [...state.year].reverse();
    }
   
    sortTimeItemList(props, state) {
        return props.timeItemList.sort((a, b) => {
            if (dayjs(a.start).isBefore(b.start)) { return -1; }
            if (dayjs(a.start).isAfter(b.start)) { return 1; }
            return 0;
        });
    }

    setRowListAndFindLast(props, state) {
        this.timeItemList.forEach((time) => {
            let isAdd = false;
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
            const isText = e.target.classList.contains('text-container');
            const target = isText ? e.target.parentElement : e.target;
            const rect = target.getBoundingClientRect();
            this.isItemMouseEnter = true;
            this.setState({
                day: [
                    this.calcDay(rect.left, 'M/D', 'flex-end'),
                    this.calcDay(rect.right, 'M/D', 'flex-start', -1),
                ]
            });
        }
        const onItemMouseLeave = (e) => {
            this.isItemMouseEnter = false;
        }
        this.rowList.forEach((row, rowIndex) => {
            row.forEach(time => {
                const onClick = () => {
                    this.props.onEditTime(time);
                };
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
                        onClick={onClick}
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
        const fourDayWidth = 20 * 8;
        let nextLeft = window.innerWidth;
        return this.yearReverse.map(year => {
            let left = 0
            if (nextLeft < fourDayWidth) {
                left = this.titlePadding - (fourDayWidth - nextLeft);
            } else {
                left = (dayjs(`${year}-1-1`).diff(firstDayjs, 'day') + 1) * this.state.dayWidth - this.state.scrollLeft - 5;
                if (left < this.titlePadding) {
                    left = this.titlePadding;
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

    calcDay(pageX, format, pos, transform = 0) {
        const dayLength = ~~((pageX + this.state.scrollLeft) / this.state.dayWidth);
        return {
            format,
            day: this.firstDayjs.add(dayLength - this.state.paddingDay - 1 + transform, 'day'),
            pos,
            left: pageX + this.state.scrollLeft
        }
    }

    drawDay() {
        return this.state.day.map(dayData => {
            return (
                <div
                    key={dayData.left}
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
        const timeContainerStyle = {
            ...dayStyle,
            backgroundImage: `repeating-linear-gradient(${'90deg, ' +
                '#cccccc 0px, ' +
                '#cccccc 1px, ' +
                '#dedede 1px, ' +
                `#dedede ${this.state.dayWidth}px`
                })`
        }
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
                    style={{ padding: `20px ${this.titlePadding}px` }}
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
                        onContextMenu={(e) => e.preventDefault()}
                    >
                        <div className="timeline-month-list">
                            {monthList}
                        </div>
                        <div
                            className="timeline-day-list"
                            style={dayStyle}
                        >
                            {dayList}
                        </div>
                        <div
                            className="timeline-time-container"
                            style={timeContainerStyle}
                        >
                            {timeItemList}
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}