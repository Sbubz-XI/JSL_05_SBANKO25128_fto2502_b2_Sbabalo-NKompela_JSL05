const STORAGE_KEY = "kanban_tasks";

// Function to save tasks to local storage
export function saveTasksToLocalStorage(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Function to load tasks from local storage
export function loadTasksFromLocalStorage() {
  const storedTasks = localStorage.getItem(STORAGE_KEY);
  return storedTasks ? JSON.parse(storedTasks) : [];
}
