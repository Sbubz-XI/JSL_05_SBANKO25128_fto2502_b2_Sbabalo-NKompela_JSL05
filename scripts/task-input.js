import {
  saveTasksToLocalStorage,
  loadTasksFromLocalStorage,
} from "./storage.js";

const MAX_TASKS = 10;

// Load stored tasks, but keep initial tasks if storage is empty
const initialTasks = [
  {
    id: 1,
    title: "Launch Epic Career 🚀",
    description: "Create a killer Resume",
    status: "todo",
  },
  {
    id: 2,
    title: "Master JavaScript 💛",
    description: "Get comfortable with the fundamentals",
    status: "doing",
  },
  {
    id: 3,
    title: "Keep on Going 🏆",
    description: "You're almost there",
    status: "doing",
  },
  {
    id: 11,
    title: "Learn Data Structures and Algorithms 📚",
    description: "Solve coding problems efficiently",
    status: "todo",
  },
  {
    id: 12,
    title: "Contribute to Open Source 🌐",
    description: "Gain practical experience and collaborate",
    status: "done",
  },
  {
    id: 13,
    title: "Build Portfolio Projects 🛠️",
    description: "Showcase skills to potential employers",
    status: "done",
  },
];

let storedTasks = loadTasksFromLocalStorage();
let Tasks = storedTasks.length ? storedTasks : initialTasks; // Keep initial tasks if storage is empty
let currentTaskId = Tasks.length + 1;

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
  saveTasksToLocalStorage(Tasks); // Save to local storage
  updateTaskUI();
  return task;
};

// Function to add task to the board
const addTask = () => {
  let task = addTaskDetails();
  if (!task) return;
  updateTaskUI();
};

// Function to open modal with task details
function openModal(taskId) {
  currentTaskId = taskId;
  let task = Tasks.find((t) => t.id === taskId);
  if (!task) return;

  document.getElementById("task-title").value = task.title;
  document.getElementById("task-desc").value = task.description;
  document.getElementById("task-status").value = task.status;

  document.getElementById("task-modal").showModal();
}

// Function to close modal
function closeModal() {
  document.getElementById("task-modal").close();
}

// Function to save task changes
function saveTask() {
  let task = Tasks.find((t) => t.id === currentTaskId);
  if (!task) return;

  task.title = document.getElementById("task-title").value;
  task.description = document.getElementById("task-desc").value;
  task.status = document.getElementById("task-status").value;

  saveTasksToLocalStorage(Tasks); // Persist changes
  updateTaskUI();
  closeModal();
}

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

    taskElement.addEventListener("click", () => openModal(task.id));
    document.getElementById(`${task.status}-column`).appendChild(taskElement);
  });
}

// Load tasks on startup
document.addEventListener("DOMContentLoaded", () => {
  Tasks = loadTasksFromLocalStorage() || initialTasks; // Ensure initial tasks are kept if storage is empty
  updateTaskUI();
});
