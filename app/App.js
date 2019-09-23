import React from 'react'
import Index from "./Index";
import Options from "./Options";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {value: ''};
        this.state= {
            component: window.location.href.indexOf('options')!==-1 ? "options" : "index",
        };
        this.handler = this.handler.bind(this)
    }

    componentDidMount() {
        const $this = this;
        chrome.storage.sync.get({
            api_key: '',
        }, function (items) {
            if (items.api_key) {
                $this.setState({
                    component : $this.state.component === "options" ? "options" : "index"
                });
            }else{
                $this.setState({
                    component : "options"
                });
            }
        });
    }

    handler() {
        console.log("refresh");
        this.setState({
            component: window.location.href.indexOf('options')!==-1 ? "options" : "index",
        });
    }

    render() {
        return(
            this.state.component === "options" ? <Options handler={this.handler}/> : <Index/>
        );
    }
}

export default App
