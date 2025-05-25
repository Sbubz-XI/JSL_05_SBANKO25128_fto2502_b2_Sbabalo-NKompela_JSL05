import {
  saveTasksToLocalStorage,
  loadTasksFromLocalStorage,
} from "./storage.js";

const MAX_TASKS = 10;

// Load tasks from storage or initialize empty
let Tasks = loadTasksFromLocalStorage();
let currentTaskId = Tasks.length
  ? Math.max(...Tasks.map((task) => task.id)) + 1
  : 1;

// Ensure initial tasks are stored in local storage if empty
if (!localStorage.getItem("kanban_tasks")) {
  saveTasksToLocalStorage(Tasks);
}

// Function to add new task via modal
function saveNewTask() {
  let title = document.getElementById("new-task-title").value.trim();
  let description = document.getElementById("new-task-desc").value.trim();
  let status = document.getElementById("new-task-status").value;

  if (!title || !description) {
    alert("Please enter both title and description.");
    return;
  }

  let task = { id: currentTaskId++, title, description, status };
  Tasks.push(task);
  saveTasksToLocalStorage(Tasks);
  updateTaskUI();
  closeAddTaskModal();
}

// Function to update UI and correctly assign tasks
function updateTaskUI() {
  ["todo-column", "doing-column", "done-column"].forEach((columnId) => {
    const column = document.getElementById(columnId);
    if (column) {
      column.innerHTML = ""; // Clear previous content
    }
  });

  Tasks.forEach((task) => {
    let taskElement = document.createElement("div");
    taskElement.className =
      "bg-white rounded-lg hover:bg-[#E4EBFA] hover:scale-101 transition-all duration-300 mb-5 py-4 px-4 font-bold shadow-md cursor-pointer";
    taskElement.innerHTML = `<h2 class="text-lg">${task.title}</h2><p class="text-md text-gray-800">${task.description}</p>`;

    let column = document.getElementById(`${task.status}-column`);
    if (column) {
      column.appendChild(taskElement);
    }
  });
}

// Function to open and close the Add Task Modal
function openAddTaskModal() {
  const modal = document.getElementById("add-task-modal");
  if (modal) {
    modal.showModal();
  }
}

function closeAddTaskModal() {
  const modal = document.getElementById("add-task-modal");
  if (modal) {
    modal.close();
  }
}

// Load tasks on startup
document.addEventListener("DOMContentLoaded", () => {
  Tasks = loadTasksFromLocalStorage();
  updateTaskUI();
});

// Attach event listeners to buttons **after ensuring they exist**
document.addEventListener("DOMContentLoaded", () => {
  const saveTaskBtn = document.getElementById("save-new-task-btn");
  const closeModalBtn = document.getElementById("close-add-modal-btn");
  const addTaskBtn = document.getElementById("add-task-btn");

  if (saveTaskBtn) {
    saveTaskBtn.addEventListener("click", saveNewTask);
  }
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeAddTaskModal);
  }
  if (addTaskBtn) {
    addTaskBtn.addEventListener("click", openAddTaskModal);
  }
});

// ✅ Attach functions to `window` for HTML `onclick` compatibility
window.openAddTaskModal = openAddTaskModal;
window.closeAddTaskModal = closeAddTaskModal;
window.saveNewTask = saveNewTask;
