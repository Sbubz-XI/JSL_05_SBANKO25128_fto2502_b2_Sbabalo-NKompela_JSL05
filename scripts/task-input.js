import {
  saveTasksToLocalStorage,
  loadTasksFromLocalStorage,
} from "./storage.js";

const MAX_TASKS = 10;

// Load tasks from storage
let Tasks = loadTasksFromLocalStorage();
let currentTaskId = Tasks.length
  ? Math.max(...Tasks.map((task) => task.id)) + 1
  : 1;

// Ensure initial tasks are stored in local storage if it's empty
if (!localStorage.getItem("kanban_tasks")) {
  saveTasksToLocalStorage(Tasks);
}

// Function to add a new task
const addTaskDetails = () => {
  if (Tasks.length >= MAX_TASKS) {
    alert("Task limit reached!");
    return null;
  }

  let title = prompt("Enter task title:").trim();
  let description = prompt("Enter task description:").trim();
  let status = prompt("Enter task status (TODO, DOING, DONE):")
    .trim()
    .toLowerCase();

  while (!["todo", "doing", "done"].includes(status)) {
    alert("Invalid status! Enter todo, doing, or done.");
    status = prompt("Enter task status (todo, doing, done):")
      .trim()
      .toLowerCase();
  }

  let task = { id: currentTaskId++, title, description, status };
  Tasks.push(task);
  saveTasksToLocalStorage(Tasks);
  updateTaskUI();
  return task;
};

// Function to add task to the board
const addTask = () => {
  let task = addTaskDetails();
  if (!task) return;

  saveTasksToLocalStorage(Tasks);
  updateTaskUI();
};

// Function to update UI
function updateTaskUI() {
  ["todo-column", "doing-column", "done-column"].forEach((columnId) => {
    document.getElementById(columnId).innerHTML = "";
  });

  Tasks.forEach((task) => {
    let taskElement = document.createElement("div");
    taskElement.className =
      "bg-white rounded-lg hover:bg-[#E4EBFA] hover:scale-101 transition-all duration-300 mb-5 py-4 px-4 font-bold shadow-md cursor-pointer";
    taskElement.innerHTML = `<h2 class="text-lg">${task.title}</h2><p class="text-md text-gray-800">${task.description}</p>`;

    document.getElementById(`${task.status}-column`).appendChild(taskElement);
  });
}

// Load tasks on startup
document.addEventListener("DOMContentLoaded", () => {
  Tasks = loadTasksFromLocalStorage();
  updateTaskUI();
});
