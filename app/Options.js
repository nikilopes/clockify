import React, {Component} from 'react'

class Options extends React.Component {

    constructor(props) {
        super(props);
        this.state = {value: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        this.save_options(this.state.value);
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="select-project">X-Api-Key:</label>
                    <input type="text"
                           value={this.state.value}
                           className="form-control custom-input"
                           onChange={this.handleChange} />
                </div>
                <input id="button-options" className="btn col-sm-2 btn-primary" type="submit" value="Submit" />
            </form>
        );
    }

    componentDidMount(){
       this.restore_options();
    }

    save_options(apiKey) {
        console.log("save options", apiKey);
        chrome.storage.sync.set({
            api_key: apiKey,
        }, function () {});
        this.props.handler;
    }


    restore_options() {
        const $this= this;
        chrome.storage.sync.get({
            api_key: '',
        }, function (items) {
           $this.setState({value:items.api_key});
        });
    }

}

export default Options
