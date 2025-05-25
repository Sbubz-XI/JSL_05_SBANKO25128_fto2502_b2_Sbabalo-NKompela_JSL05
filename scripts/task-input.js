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

    // Attach event to open edit modal
    taskElement.addEventListener("click", () => openEditTaskModal(task.id));
  });
}

// Function to open the Add Task Modal
function openAddTaskModal() {
  const modal = document.getElementById("add-task-modal");
  if (modal) {
    modal.showModal();
  }
}

// Function to close the Add Task Modal
function closeAddTaskModal() {
  const modal = document.getElementById("add-task-modal");
  if (modal) {
    modal.close();
  }
}

// Function to save a new task via modal
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

// Function to open the Edit Task Modal
function openEditTaskModal(taskId) {
  const modal = document.getElementById("task-modal");
  if (!modal) return;

  const task = Tasks.find((t) => t.id === taskId);
  if (!task) return;

  document.getElementById("task-title").value = task.title;
  document.getElementById("task-desc").value = task.description;
  document.getElementById("task-status").value = task.status;

  modal.dataset.taskId = taskId; // ✅ Store task ID for reference when saving
  modal.showModal();
}

// Function to close the Edit Task Modal
function closeEditTaskModal() {
  const modal = document.getElementById("task-modal");
  if (modal) {
    modal.close();
  }
}

// Function to save changes to an existing task
function saveTask() {
  const modal = document.getElementById("task-modal");
  const taskId = parseInt(modal.dataset.taskId, 10); // ✅ Retrieve stored task ID

  let task = Tasks.find((t) => t.id === taskId);
  if (!task) return;

  task.title = document.getElementById("task-title").value;
  task.description = document.getElementById("task-desc").value;
  task.status = document.getElementById("task-status").value;

  saveTasksToLocalStorage(Tasks);
  updateTaskUI();
  closeEditTaskModal();

  // ✅ Log message when task moves to "done"
  if (task.status === "done") {
    console.log("Well-done, task has been completed");
  }
}

// Load tasks on startup
document.addEventListener("DOMContentLoaded", () => {
  Tasks = loadTasksFromLocalStorage();
  updateTaskUI();

  // ✅ Log all tasks on page load
  console.log("All Current Tasks:", Tasks);

  // ✅ Display "Done" tasks filter
  const doneTasks = Tasks.filter((task) => task.status === "done");
  console.log("Completed Tasks:", doneTasks);
});

// Attach event listeners after ensuring elements exist
document.addEventListener("DOMContentLoaded", () => {
  const saveTaskBtn = document.getElementById("save-new-task-btn");
  const closeAddModalBtn = document.getElementById("close-add-modal-btn");
  const addTaskBtn = document.querySelectorAll(
    "[onclick='openAddTaskModal()']"
  );
  const saveEditedTaskBtn = document.getElementById("save-task-btn");
  const closeEditModalBtn = document.getElementById("close-modal-btn");

  if (saveTaskBtn) saveTaskBtn.addEventListener("click", saveNewTask);
  if (closeAddModalBtn)
    closeAddModalBtn.addEventListener("click", closeAddTaskModal);
  if (addTaskBtn.length)
    addTaskBtn.forEach((btn) =>
      btn.addEventListener("click", openAddTaskModal)
    );
  if (saveEditedTaskBtn) saveEditedTaskBtn.addEventListener("click", saveTask);
  if (closeEditModalBtn)
    closeEditModalBtn.addEventListener("click", closeEditTaskModal);
});

// ✅ Attach functions to `window` for HTML `onclick` compatibility
window.openAddTaskModal = openAddTaskModal;
window.closeAddTaskModal = closeAddTaskModal;
window.saveNewTask = saveNewTask;
window.openEditTaskModal = openEditTaskModal;
window.closeEditTaskModal = closeEditTaskModal;
window.saveTask = saveTask;
