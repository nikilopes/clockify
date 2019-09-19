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
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    X-Api-Key:
                    <input type="text" value={this.state.value} onChange={this.handleChange} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        );
    }

    componentDidMount(){
       this.restore_options();
    }

    save_options(apiKey) {
        chrome.storage.sync.set({
            api_key: apiKey,
        }, function () {});
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
