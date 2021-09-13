let bodyHead = document.querySelector("#bodyHead");
let addAThing = document.querySelector("#addAThing");
let inputs = document.querySelector("#inputs");
let tableHead = document.querySelector("#tableHead");
let bodyBody = document.querySelector("#bodyBody");

let inbox = document.querySelector("#inbox");
let today = document.querySelector("#today");
let projects = document.querySelector("#projects");

inbox.addEventListener('click', inboxFunction);
inbox.addEventListener('click', showTaskToTheScreen);

today.addEventListener('click', todayFunction);
projects.addEventListener('click', projectsFunction);
projects.addEventListener('click', showProjectToTheScreen);

inboxFunction();
showTaskToTheScreen();

function Task(title, priority, dueDate, done) {
    this.title = title;
    this.priority = priority;
    this.dueDate = dueDate;
    this.done = false;
}

function Display() { }

Display.prototype.fieldClear = function () {
    let noteDetails = document.querySelector("#noteDetails");
    noteDetails.reset();
};

Display.prototype.checkTaskTrash = function (newTask) {
    if (newTask.title.length < 2 || newTask.dueDate == "") {
        return false;
    }
    else return true;
};

Display.prototype.checkProjectTrash = function (newProject) {
    if (newProject.projectTitle.length < 1) {
        return false;
    }
    else return true;
}

Display.prototype.projectTaskFieldClear = function() {
    let ptFieldClear = document.querySelector("#projectTaskDetails");
    ptFieldClear.reset();
}

Display.prototype.showStatus = function (status, statusMessage) {
    let dismissMessage = document.querySelector('#dismissMessage');
    dismissMessage.innerHTML = `<div class="alert alert-${status} alert-dismissible fade show" role="alert">
                                    <strong>Status /</strong> ${statusMessage}
                                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>`;
    setTimeout(function () {
        dismissMessage.innerHTML = ' '
    }, 3500);
}

function inboxFunction() {
    inbox.classList.add("button-clicked");
    today.classList.remove("button-clicked");
    projects.classList.remove("button-clicked");
    bodyHead.innerHTML = `<div id="title">- Inbox -</div><br>`;
    addAThing.innerHTML = `<div id="addTask">
                                <div class="accordion" id="taskAdder">
                                    <div class="accordion-item">
                                        <h2 class="accordion-header" id="taskHeader">
                                            <div class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                + Add A Task
                                            </div>
                                        </h2>
                                        <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="taskHeader" data-bs-parent="#taskAdder">
                                            <div class="accordion-body">
                                                <div id="taskInput" class="container my-2">
                                                    <form class="row g-3 mx-2" id="noteDetails">
                                                        <div class="col-md-3">
                                                            <label for="taskTitle" class="form-label">To-do</label>
                                                            <input type="text" class="form-control" id="taskTitle" placeholder="Enter a title">
                                                        </div>
                                                        <div class="col-md-2">
                                                            <label for="priority" class="form-label">Priority</label>
                                                            <select class="form-select" id="priority">
                                                                <option selected hidden disabled>nil</option>
                                                                <option value="High">High</option>
                                                                <option value="Medium">Medium</option>
                                                                <option value="Low">Low</option>
                                                            </select>
                                                        </div>
                                                        <div class="col-md-4">
                                                            <label for="dueDate" class="form-label">Enter a due date</label>
                                                            <input type="date" class="form-control" id="dueDate">
                                                        </div>
                                                        <div class="col-md-3 buttonAlign">
                                                            <button type="button" id="addTaskBtn" class="btn btn-success">Add</button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;

    let addTaskBtn = document.querySelector("#addTaskBtn");
    addTaskBtn.addEventListener('click', addDetails);
    bodyBody.innerHTML = ``;
    inputs.innerHTML = ``;
    tableHead.innerHTML = `<table class="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col">To-do</th>
                                        <th scope="col">Priority</th>
                                        <th scope="col">Due Date</th>
                                        <th scope="col"> &nbsp; Done</th>
                                        <th scope="col"> &nbsp; Delete</th>
                                    </tr>
                                </thead>
                                <tbody id="details">
                                </tbody>
                            </table>`;
};

function addDetails() {
    let title = document.querySelector("#taskTitle").value;
    let priority = document.querySelector("#priority").value;
    let dueDate = document.querySelector("#dueDate").value;

    let newTask = new Task(title, priority, dueDate);

    let taskData = localStorage.getItem("taskData");
    if (taskData == null) {
        taskDataObject = [];
    }
    else {
        taskDataObject = JSON.parse(taskData);
    }

    let taskDisplay = new Display();

    if (taskDisplay.checkTaskTrash(newTask)) {
        taskDataObject.push(newTask);
        localStorage.setItem("taskData", JSON.stringify(taskDataObject));
        showTaskToTheScreen();
        taskDisplay.fieldClear();
        taskDisplay.showStatus('success', `Success :), your task <strong>${newTask.title}</strong> added successfully.`);
    }
    else {
        taskDisplay.showStatus('danger', `Error :<, check one or more fields`);
    }
};

function showTaskToTheScreen() {
    let taskData = localStorage.getItem("taskData");
    if (taskData == null) {
        taskDataObject = [];
    }
    else {
        taskDataObject = JSON.parse(taskData);
    }

    let viewTaskDetails = " ";

    taskDataObject.forEach(function (element, index) {

        if (element.done == true) {
            viewTaskDetails += `<tr class="viewTaskDetails" id= row${index}>
                                    <th class="strikeDone">${element.title}</th>
                                    <td class="strikeDone">${element.priority}</td>
                                    <td class="strikeDone">${element.dueDate}</td>
                                    <td>
                                        <i class="fa fa-calendar-check-o" style="font-size:60px;color:green"></i>
                                    </td>
                                    <td>
                                        <button class="btn btn-danger" id="delete${index}" onClick="deleteTask(${index})">Delete</button>
                                    </td>
                                </tr>`;
        }
        else {
            viewTaskDetails += `<tr class="viewTaskDetails" id= row${index}>
                                    <th>${element.title}</th>
                                    <td>${element.priority}</td>
                                    <td>${element.dueDate}</td>
                                    <td>
                                        <button class="btn btn-primary" id="done${index}" onClick="doneTask(${index})">Done</button>
                                    </td>
                                    <td>
                                        <button class="btn btn-danger" id="delete${index}" onClick="deleteTask(${index})">Delete</button>
                                    </td>
                                </tr>`;
        }
    });
    let details = document.querySelector("#details");
    details.innerHTML = viewTaskDetails;
}

function doneTask(index) {
    let taskData = localStorage.getItem("taskData");
    if (taskData == null) {
        taskDataObject = [];
    }
    else {
        taskDataObject = JSON.parse(taskData);
    }
    taskDataObject[index].done = true;
    localStorage.setItem("taskData", JSON.stringify(taskDataObject));
    showTaskToTheScreen();
}

function deleteTask(index) {
    let taskData = localStorage.getItem("taskData");
    if (taskData == null) {
        taskDataObject = [];
    }
    else {
        taskDataObject = JSON.parse(taskData);
    }
    taskDataObject.splice(index, 1);
    localStorage.setItem("taskData", JSON.stringify(taskDataObject));
    let taskDeletion = new Display();
    taskDeletion.showStatus('dark', `your task has been deleted`);
    showTaskToTheScreen();
}

function projectsFunction() {
    inbox.classList.remove("button-clicked");
    today.classList.remove("button-clicked");
    projects.classList.add("button-clicked");
    bodyHead.innerHTML = `<div id="title">- Project Titles -</div><br>`;
    tableHead.innerHTML = ``;
    addAThing.innerHTML = `<div id="addProject">
                                <div class="accordion" id="projectAdder">
                                    <div class="accordion-item">
                                        <h2 class="accordion-header" id="projectHeader">
                                            <div class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseProjectHeader" aria-expanded="true" aria-controls="collapseProjectHeader">
                                                + Add A Project
                                            </div>
                                        </h2>
                                        <div id="collapseProjectHeader" class="accordion-collapse collapse" aria-labelledby="projectHeader" data-bs-parent="#projectAdder">
                                            <div class="accordion-body">
                                                <div id="projectInput" class="container my-2">
                                                    <form class="row g-3 mx-2" id="noteDetails">
                                                        <div class="col-md-3">
                                                            <label for="projectTitle" class="form-label">Title</label>
                                                            <input type="text" class="form-control" id="projectTitle" placeholder="Enter a title">
                                                        </div>
                                                        <div class="col-md-3 buttonAlign">
                                                            <button type="button" id="addProjectBtn" class="btn btn-success">Add</button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div><hr>`;

    let addProjectBtn = document.querySelector("#addProjectBtn");
    addProjectBtn.addEventListener('click', addProjectDetails);
}

function Project(projectTitle, done, ppTasks) {
    this.projectTitle = projectTitle;
    this.done = false;
    this.ppTasks = [];
}

function addProjectDetails() {
    let projectTitle = document.querySelector("#projectTitle").value;
    let newProject = new Project(projectTitle);

    let projectData = localStorage.getItem("projectData");
    if (projectData == null) {
        projectDataObject = [];
    }
    else {
        projectDataObject = JSON.parse(projectData);
    }

    let projectDisplay = new Display();
    if (projectDisplay.checkProjectTrash(newProject)) {

        projectDataObject.push(newProject);
        localStorage.setItem("projectData", JSON.stringify(projectDataObject));
        showProjectToTheScreen();
        projectDisplay.fieldClear();
        projectDisplay.showStatus('success', ` Success :), your project <strong>${newProject.projectTitle}</strong> added successfully.`);
    }
    else {
        projectDisplay.showStatus('dark', `Type something to add it as your project title !`)
    }
}


function showProjectToTheScreen() {
    let projectData = localStorage.getItem("projectData");
    if (projectData == null) {
        projectDataObject = [];
    }
    else {
        projectDataObject = JSON.parse(projectData);
    }
    let viewProjectDetails = " ";
    projectDataObject.forEach(function (element, index) {
        if (element.done == true) {
            viewProjectDetails += `<div class="accordion my-3" id="proTitle${index}">
                                    <div class="accordion-item">
                                        <h2 class="accordion-header" id="proHead${index}">
                                            <div class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseproHead${index}" aria-expanded="true" aria-controls="collapseproHead${index}">
                                                <span class="strikeDone">${element.projectTitle}</span>&nbsp;(Project Done, Bravo!)
                                            </div>
                                            <button id="projectDelete-${index}" class="btn btn-danger delete-project" onclick="deleteProject(${index})"><i class="fas fa-trash"></i></button>
                                        </h2>
                                    </div>
                                </div>`;
        }
        else {
            viewProjectDetails += `<div class="accordion my-3" id="proTitle${index}">
                                        <div class="accordion-item">
                                            <h2 class="accordion-header" id="proHead${index}">
                                                <div id="titleNindice" class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseproHead${index}" aria-expanded="true" aria-controls="collapseproHead${index}">
                                                    ${element.projectTitle}
                                                </div>
                                                <button id="projectDelete-${index}" class="btn btn-danger delete-project" onclick="deleteProject(${index})"><i class="fas fa-trash"></i></button>
                                                <button id="projectDone-${index}" class="btn btn-success done-project" onclick="doneProject(${index})"><i class="fas fa-check-double"></i></button>
                                            </h2>
                                        </div>
                                    </div>`;
        }
    });
    bodyBody.innerHTML = viewProjectDetails;
}

function deleteProject(index) {
    let projectData = localStorage.getItem("projectData");
    if (projectData == null) {
        projectDataObject = [];
    }
    else {
        projectDataObject = JSON.parse(projectData);
    }
    projectDataObject.splice(index, 1);
    localStorage.setItem("projectData", JSON.stringify(projectDataObject));
    let projectDeletion = new Display();
    projectDeletion.showStatus('dark', `your project has been deleted`);
    showProjectToTheScreen();
}

function doneProject(index) {
    let projectData = localStorage.getItem("projectData");
    if (projectData == null) {
        projectDataObject = [];
    }
    else {
        projectDataObject = JSON.parse(projectData);
    }
    projectDataObject[index].done = true;
    localStorage.setItem("projectData", JSON.stringify(projectDataObject));
    showProjectToTheScreen();
}

function todayFunction() {
    inbox.classList.remove("button-clicked");
    today.classList.add("button-clicked");
    projects.classList.remove("button-clicked");
    bodyBody.innerHTML = ``;
    bodyHead.innerHTML = `<div id="title">- Today's Inbox -</div><br>`
    tableHead.innerHTML = `<table class="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col">To-do</th>
                                        <th scope="col">Priority</th>
                                        <th scope="col">Due Date</th>
                                        <th scope="col"> &nbsp; Done</th>
                                        <th scope="col"> &nbsp; Delete</th>
                                    </tr>
                                </thead>
                                <tbody id="todayTaskDetails">
                                </tbody>
                            </table>`;

    todayTaskFunction();
}

function todayTaskFunction() {
    let dateObj = new Date()
    addAThing.innerHTML = `<div class="text-center">${dateObj}</div>`;
    let date = dateObj.getDate().toString();
    let month = dateObj.getMonth();
    month = month + 1;
    if(month.toString().length == 1) {
        month = `0${month}`;
    }
    let year = dateObj.getFullYear().toString();
    
    let todayDate = `${year}-${month}-${date}`;

    let taskData = localStorage.getItem("taskData");
    if (taskData == null) {
        taskDataObject = [];
    }
    else {
        taskDataObject = JSON.parse(taskData);
    }

    let viewTodayInbox = " ";

    taskDataObject.forEach(function (element, index) {
        if (element.dueDate == todayDate) {
            if(element.done == true) {
                viewTodayInbox +=  `<tr class="viewTaskDetails" id= row${index}>
                                        <th class="strikeDone">${element.title}</th>
                                        <td class="strikeDone">${element.priority}</td>
                                        <td class="strikeDone">${element.dueDate}</td>
                                        <td>
                                            <i class="fa fa-calendar-check-o" style="font-size:60px;color:green"></i>
                                        </td>
                                        <td>
                                            <button class="btn btn-danger" id="delete${index}" onClick="deleteTaskToday(${index})">Delete</button>
                                        </td>
                                    </tr>`;
            }
            else {
                viewTodayInbox += `<tr class="viewTaskDetails" id= row${index}>
                                <th>${element.title}</th>
                                <td>${element.priority}</td>
                                <td>${element.dueDate}</td>
                                <td>
                                    <button class="btn btn-primary" id="done${index}" onClick="doneTaskToday(${index})">Done</button>
                                </td>
                                <td>
                                    <button class="btn btn-danger" id="delete${index}" onClick="deleteTaskToday(${index})">Delete</button>
                                </td>
                            </tr>`;
            }
        }
    });
    let todayTaskDetails = document.querySelector("#todayTaskDetails");
    todayTaskDetails.innerHTML = viewTodayInbox;
}

function doneTaskToday(index) {
    let taskData = localStorage.getItem("taskData");
    if (taskData == null) {
        taskDataObject = [];
    }
    else {
        taskDataObject = JSON.parse(taskData);
    }
    taskDataObject[index].done = true;
    localStorage.setItem("taskData", JSON.stringify(taskDataObject));
    todayTaskFunction();
}

function deleteTaskToday(index) {
    let taskData = localStorage.getItem("taskData");
    if (taskData == null) {
        taskDataObject = [];
    }
    else {
        taskDataObject = JSON.parse(taskData);
    }
    taskDataObject.splice(index, 1);
    localStorage.setItem("taskData", JSON.stringify(taskDataObject));
    let taskDeletion = new Display();
    taskDeletion.showStatus('dark', `your task has been deleted`);
    todayTaskFunction();
}
