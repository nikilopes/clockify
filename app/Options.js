import React, {Component} from 'react'

class Options extends React.Component {

    constructor(props) {
        super(props);
        this.state = {value: ''};
        this.state = {enableCustomHourChecked: false};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {

        const target = event.target;
        const value = target.value;
        const name = target.name;


        if(name === "enableCustomHour" ){
            console.log(name+"|"+this.state.enableCustomHourChecked);
            this.setState({enableCustomHourChecked: !this.state.enableCustomHourChecked});
        }
        else {
            console.log(name+"|"+value);
            this.setState({[name]: value});
        }
    }

    handleSubmit(event) {

        this.save_options(this.state.value,this.state.enableCustomHourChecked,this.state.startTime,this.state.endTime);
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="select-project">X-Api-Key:</label>
                    <input type="text"
                           value={this.state.value}
                           name={"value"}
                           className="form-control custom-input"
                           onChange={this.handleChange} />
                </div>

                <div className="form-group">

                    <label htmlFor="customHour">Enable Custom Hour</label>

                    <input type="checkbox"
                           name={"enableCustomHour"}
                           style={{marginLeft: '0.8rem'}}
                           onChange={this.handleChange}
                           checked={this.state.enableCustomHourChecked}
                    />
                </div>


                {!this.state.enableCustomHourChecked ?
                    <div className="form-group">
                        <div className="form-group">
                            <label htmlFor="startTime">Start Time</label>
                            <input type="time" id="startTime" name="startTime" style={{marginLeft: '0.8rem'}}
                                   min="08:00" max="20:00"
                                   onChange={this.handleChange} required/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="endTime">End Time</label>
                            <input type="time" id="endTime" name="endTime" style={{marginLeft: '0.8rem'}}
                                   min="08:00" max="20:00"
                                   onChange={this.handleChange} required/>
                        </div>
                    </div> : null}

                <input id="button-options" className="btn col-sm-2 btn-primary" type="submit" value="Submit" />
            </form>
        );
    }

    componentDidMount(){
       this.restore_options();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(!this.state.enableCustomHourChecked && this.state.startTime !== "undefined") {
            console.log(this.state.startTime+"|"+this.state.endTime);
            document.getElementById('startTime').value = this.state.startTime;
            document.getElementById('endTime').value = this.state.endTime;
        }
    }

    save_options(apiKey,enableCustomHourChecked,startTimeDef,endTimeDef) {
        console.log("save options", apiKey);
        chrome.storage.sync.set({
            api_key: apiKey,
            enableCustomHourChecked:enableCustomHourChecked,
            startTimeDef:startTimeDef,
            endTimeDef:endTimeDef
        }, function () {});
        this.props.handler;
    }


    restore_options() {
        const $this= this;
        chrome.storage.sync.get({
            api_key: '',
            enableCustomHourChecked:false,
            startTimeDef:"09:00",
            endTimeDef:"17:00"
        }, function (items) {
           $this.setState({value:items.api_key});
            $this.setState({enableCustomHourChecked:items.enableCustomHourChecked});
            $this.setState({startTime:items.startTimeDef});
            $this.setState({endTime:items.endTimeDef});
        });


    }

}

export default Options
