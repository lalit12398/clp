/**
 * HANDLE MODAL
 */
function Task(title = "", desc = "") {
  this.title = title;
  this.desc = desc;
  this.subTasks = [];
}

Task.parseArray = function (taskArray) {
  return taskArray.map((item) => {
    let task = new this(item.title, item.desc);
    task.subTasks = this.parseArray(item.subTasks);
    return task;
  });
};

// Task.prototype.createSubTask = function (title, desc) {
//   let subTask = new Task(title, desc);
//   this.subTasks.push(subTask);
// };
// Task.prototype.removeSubTask = function (indexOfSubTask) {
//   let filteredSubTask = this.subTasks.filter((item, index) => {
//     return index !== indexOfSubTask;
//   });
//   this.subTasks = filteredSubTask;
// };

function _initTasks() {
  let tasks = JSON.parse(window.localStorage.getItem("taskList"));
  if (tasks) window.tasks = tasks;
  console.log(tasks);
  window.tasks = Task.parseArray(tasks);
}

window.tasks = [];
_initTasks();
renderTaks();

function createTask(cb) {
  let title = document.getElementById("title").value;
  let description = document.getElementById("description").value;
  let newTask = new Task(title, description);
  if (typeof cb === "function") cb(newTask);
}

window._currentRef = null;
// creates main tasks
function addMainTask() {
  createTask(function (task) {
    window.tasks.push(task);
  });
}

function addSubtasks(task) {
  createTask(function (newtask) {
    task.subTasks.push(newtask);
  });
}

function onModalOpenHandler(e, taskRef) {
  if (taskRef instanceof Task) window._currentRef = taskRef;
  else window._currentRef = null;
  modalHandler(e, "show");
}

function onModalSaveHandler(e) {
  if (window._currentRef instanceof Task) addSubtasks(window._currentRef);
  else addMainTask();
  window.localStorage.setItem("taskList", JSON.stringify(window.tasks));
  modalHandler(e, "hide");
  renderTaks();
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
}

function renderTaks() {
  let content = getTasksListView(window.tasks);
  document.getElementById("taskContainer").innerHTML = "";
  document.getElementById("taskContainer").appendChild(content);
}

// renderTasks on view
function getTasksListView(tasks) {
  let content = document.createElement("div");
  if (!tasks) return content;

  tasks.map((task, index) => {
    let buttonHandler = document.createElement("a");
    buttonHandler.innerHTML = `<i class="fa fa-plus" aria-hidden="true"></i
  >`;
    buttonHandler.onclick = function () {
      onModalOpenHandler(this, task);
    };
    buttonHandler.setAttribute("data-modal", "createTaskModal");
    buttonHandler.setAttribute("title", "Add Sub-Task");
    buttonHandler.setAttribute("href", "javascript:void(0)");

    let taskView = document.createElement("div");
    taskView.innerHTML = `<button class="accordion" onclick=accordionHandler(event)>${task.title}<div class="f-right addSubtaskButton" ></div></button><div class="panel active"><p>${task.desc}</p><div class="subtasks"></div></div>`;
    var fragment = document.createDocumentFragment();
    fragment.appendChild(taskView);

    let taskViewDomObject = fragment.querySelector(".addSubtaskButton");
    taskViewDomObject.innerHTML = "";
    taskViewDomObject.appendChild(buttonHandler);

    taskViewDomObject = fragment.querySelector(".subtasks");
    taskViewDomObject.innerHTML = "";
    taskViewDomObject.appendChild(getTasksListView(task.subTasks));

    // content.innerHTML = "";/
    content.append(fragment);
  });
  return content;
}

function modalHandler(that, action = "show") {
  let selectedModal = document.getElementById(that.dataset.modal);
  if (action === "show") {
    selectedModal.classList.add("show");
  } else if (action === "hide") {
    selectedModal.classList.remove("show");
    document.getElementById("taskForm").reset();
  }
}

/**
 * HANDLE ACCORDION
 */
function accordionHandler(e) {
  let that = e.target;
  that.classList.toggle("active");
  let panel = that.nextElementSibling;
  if (panel.style.display === "block") {
    panel.style.display = "none";
    panel.style.visibility = "hidden";
  } else {
    panel.style.display = "block";
    panel.style.visibility = "visible";
  }
}
