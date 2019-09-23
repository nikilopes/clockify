import React, {Component} from 'react'
import Options from "./Options";

const CLOCKIFY_ENDPOINT = 'https://api.clockify.me/api/v1/';
const headersClockify = {
    "x-api-key": "",
    "content-type": "application/json"
};


class Index extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            description: '',
            project: '',
            tag: '',
            projects: [],
            tags: [],
            loaderEnabled: false,
            startTime: "08:00",
            endTime: "08:00"
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        });

        document.getElementById('button-send').disabled = !(this.state.description!=="" && this.state.project && this.state.tag);
    }

    handleSubmit(event) {
        const description = this.state.description;
        const project = this.state.project;
        const tag = this.state.tag;
        const startTime = this.state.startTime;
        const endTime = this.state.endTime;

        this.sendTimeTracker(project, tag, description,startTime,endTime);
        event.preventDefault();
    }

    static formatDate(date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }
    
    sendTimeTracker(project, tag, description,startTime,endTime) {
        this.setState({loaderEnabled: true});

        let timeStart;
        let timeEnd;

        if(!this.state.enableCustomHourChecked)
        {
            timeStart = this.state.startTimeDef;
            timeEnd = this.state.endTimeDef;
        }
        else
        {
            timeStart = startTime;
            timeEnd = endTime;
        }

        console.log(startTime+"|"+endTime);
        const now = Date.now();
        const dateStart = Index.formatDate(now)+"T"+timeStart+":00";
        const dateEnd = Index.formatDate(now)+"T"+timeEnd+":00";

        console.log(dateStart+"|"+dateEnd);

        const $this = this;

        var body = {
            "start": new Date(dateStart).toISOString(),
            "billable": "true",
            "description": description,
            "projectId": project,
            "end": new Date(dateEnd).toISOString(),
            "tagIds": [tag]
        };

        fetch(`${CLOCKIFY_ENDPOINT}workspaces/${workspaceID}/time-entries`,
            {
                method: 'POST',
                headers: headersClockify,
                body: JSON.stringify(body)
            })
            .then(response => {
                $this.setState({
                    description: '',
                    loaderEnabled: false,
                    startTime: "08:00",
                    endTime: "08:00"
                });
                document.getElementById('button-send').disabled = true;
            })
    }

    componentDidMount() {
        const $this = this;
        chrome.storage.sync.get({
            api_key: '',
            enableCustomHourChecked: false,
            startTimeDef:"09:00",
            endTimeDef:"17:00"
        }, function (items) {
            headersClockify['x-api-key'] = items.api_key;
            $this.setState({enableCustomHourChecked:items.enableCustomHourChecked});
            $this.setState({startTimeDef:items.startTimeDef});
            $this.setState({endTimeDef:items.endTimeDef});
            console.log("items.api_key;", items.api_key);
            if (items.api_key){
                getWorkspaceID();
            }
        });


        function getWorkspaceID() {
            fetch(`${CLOCKIFY_ENDPOINT}workspaces`,
                {
                    method: 'GET',
                    headers: headersClockify
                })
                .then(response => response.json())
                .then(data => {
                    getProjects(data[0].id);
                    getTags(data[0].id);
                    window.workspaceID = data[0].id;
                })
        }

        function getProjects(workspaceID) {
            fetch(`${CLOCKIFY_ENDPOINT}workspaces/${workspaceID}/projects`,
                {
                    method: 'GET',
                    headers: headersClockify
                })
                .then(response => response.json())
                .then(data => {
                    $this.setState({
                        projects: data,
                        project: data[0].id
                    });

                });
        }

        function getTags(workspaceID) {
            fetch(`${CLOCKIFY_ENDPOINT}workspaces/${workspaceID}/tags`,
                {
                    method: 'GET',
                    headers: headersClockify
                })
                .then(response => response.json())
                .then(data => {
                    $this.setState({
                        tags: data,
                        tag: data[0].id
                    });
                });
        }

    }



    render() {
        const projectItems = this.state.projects.map((project) =>
            <option value={project.id}>{project.name}</option>
        );

        const tagsItems = this.state.tags.map((tag) =>
            <option value={tag.id}>{tag.name}</option>
        );

        return (
            <form onSubmit={this.handleSubmit}>
                <div className="content-form">
                    <div className="form-group">
                        <label htmlFor="select-project">Projects</label>
                        <select
                            id="select-project"
                            name="project"
                            value={this.state.project}
                            className="form-control custom-input"
                            onChange={this.handleInputChange}>
                            {projectItems}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="select-task">Task</label>
                        <select
                            id="select-task"
                            name="tag"
                            value={this.state.tag}
                            className="form-control custom-input"
                            onChange={this.handleInputChange}>
                            {tagsItems}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            className="form-control custom-input"
                            value={this.state.description}
                            onChange={this.handleInputChange}/>
                    </div>
                    {this.state.enableCustomHourChecked ?
                    <div className="form-group">
                        <div className="form-group">
                            <label htmlFor="startTime">Start Time</label>
                            <input type="time" id="startTime" name="startTime" style={{marginLeft: '0.8rem'}}
                                   min="08:00" max="20:00" defaultValue={"08:00"}
                                   onChange={this.handleInputChange} required/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="endTime">End Time</label>
                            <input type="time" id="endTime" name="endTime" style={{marginLeft: '0.8rem'}}
                                   min="08:00" max="20:00"  defaultValue={"08:00"}
                                   onChange={this.handleInputChange} required/>
                        </div>
                    </div> : null}

                    <input id="button-send" className="btn col-sm-2 btn-primary" type="submit" value="Submit" disabled/>
                    {this.state.loaderEnabled ?
                        <div className="loader_content">
                            <div className="lds-ellipsis">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </div> : null}
                    <div className="hero__content__item-image">
                        <img className="hero__extra-img animate-relaxation"
                             src="https://clockify.me/assets/images/extra-features-work-illustration.svg"/>
                    </div>
                </div>
            </form>
        );
    }
}

export default Index
