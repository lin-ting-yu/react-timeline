import React from 'react';
import './edit-time.css';

export class EditTime extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            timeData: this.props.timeData
        }
        
    }
    render() {
        const innerValue = { ...this.state.timeData };
        const onChange = (key, e) => {
            innerValue[key] = e.target.value;
            this.setState({
                timeData: innerValue
            });
        };
        const onConfirm = () => {
            this.props.onConfirmEdit(innerValue);
        }
        const onClose = () => {
            this.props.onCloseEdit();
        }
        const onDelete = () => {
            this.props.onConfirmEdit(innerValue, true);
        }
        return (
            <div className="edit-time-container">
                <div className="edit-time">
                    <div className="row">
                        <div className="col">Name</div>
                        <div className="col">
                            <input
                                name="name"
                                type="text"
                                autoComplete="off"
                                defaultValue={innerValue.name}
                                placeholder="name"
                                onChange={onChange.bind(null, 'name')}
                            ></input>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">Day</div>
                        <div className="col">
                            <input
                                name="start"
                                type="date"
                                autoComplete="off"
                                max={innerValue.end}
                                defaultValue={innerValue.start}
                                onChange={onChange.bind(null, 'start')}
                            ></input>
                            <div className="wave">~</div>
                            <input
                                name="end"
                                type="date"
                                autoComplete="off"
                                min={innerValue.start}
                                defaultValue={innerValue.end}
                                onChange={onChange.bind(null, 'end')}
                            ></input>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">Color</div>
                        <div className="col">
                            <input
                                name="color"
                                type="color"
                                autoComplete="off"
                                defaultValue={innerValue.color}
                                onChange={onChange.bind(null, 'color')}
                            ></input>
                        </div>
                    </div>
                    <div className="row">
                        <div
                            className="btn"
                            onClick={onConfirm}
                        >Confirm</div>
                    </div>
                    {
                        this.props.isCanDelete
                            ? (
                                <div className="row">
                                    <div
                                        className="delete"
                                        onClick={onDelete}
                                    >Delete</div>
                                </div>
                            )
                            : ''
                    }

                    <div
                        className="close"
                        onClick={onClose}
                    ></div>
                </div>
            </div >
        );
    }
}