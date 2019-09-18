window.onload = function() {
  const headersClockify = {
    "x-api-key" : "XVwL9ZeGHwYZChX9",
    "content-type": "application/json"
  };

  const CLOCKIFY_URL = 'https://api.clockify.me/api/v1/';

  getWorkspaceID();

  function getWorkspaceID() {
    fetch(`${CLOCKIFY_URL}workspaces`,
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
    fetch(`${CLOCKIFY_URL}workspaces/${workspaceID}/projects`,
        {
          method: 'GET',
          headers: headersClockify
        })
        .then(response => response.json())
        .then(data =>initProjectsSelect(data))
  }

  function getTags(workspaceID) {
    fetch(`${CLOCKIFY_URL}workspaces/${workspaceID}/tags`,
        {
          method: 'GET',
          headers: headersClockify
        })
        .then(response => response.json())
        .then(data =>initTagSelect(data))
  }

  function initProjectsSelect(projects){
    let htmlProjects="";
    projects.map(project=>{
      htmlProjects+= `<option value="${project.id}">${project.name}</option>`;
     });
    document.getElementById('projects').innerHTML = htmlProjects;
    //getTaskId(projects[0].id);
  }

  function initTagSelect(tags){
    let htmlTags="";
    tags.map(tag=>{
      htmlTags+= `<option value="${tag.id}">${tag.name}</option>`;
    });
    document.getElementById('tags').innerHTML = htmlTags;
  }

  $("#projects").change(function(e){
   // getTaskId(e.target.value)
  });

  function getTaskId( projectID){
    fetch(`${CLOCKIFY_URL}workspaces/${workspaceID}/projects/${projectID}/tasks`,
        {
          method: 'GET',
          headers: headersClockify
        })
        .then(response => response.json())
        .then(data => {
//          initTaskSelect(data);
        })

  }

  $('#sendTimeEntry').off('click');
  $('#sendTimeEntry').on('click', ()=>{

    const timeStart = new Date().setHours(9,0,0,0);
    const timeEnd = new Date().setHours(17,0,0,0);

    var body = {
      "start": new Date(timeStart).toISOString(),
      "billable": "true",
      "description":$('#description').val(),
      "projectId": $('#projects').val(),
      "end": new Date(timeEnd).toISOString(),
      "tagIds":[$('#tags').val()]
    };

    fetch(`${CLOCKIFY_URL}workspaces/${workspaceID}/time-entries`,
        {
          method: 'POST',
          headers: headersClockify,
          body:JSON.stringify(body)
        })
        .then(response => {
          if(response.status === 201){
            document.getElementById('result-success').innerHTML = "Creato";
            document.getElementById('result-success').hidden = false;
          }else{
            document.getElementById('result').innerHTML = "Errore "+ response.status;
            document.getElementById('result-error').hidden = false;
          }
        })




  })
};
