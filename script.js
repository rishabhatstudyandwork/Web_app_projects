// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// DOM Elements
const taskInput = document.getElementById('task-input');
const categorySelect = document.getElementById('category');
const dueDateInput = document.getElementById('due-date');
const prioritySelect = document.getElementById('priority');
const addBtn = document.getElementById('add-btn');
const searchInput = document.getElementById('search');
const filterSelect = document.getElementById('filter');
const taskList = document.getElementById('task-list');
const themeToggle = document.getElementById('theme-toggle');

// Theme Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeToggle.innerHTML = document.body.classList.contains('dark-mode') 
        ? '<i class="fas fa-sun"></i>' 
        : '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
});

// Load saved theme
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

// Add Task
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    const newTask = {
        id: Date.now(),
        text,
        category: categorySelect.value,
        dueDate: dueDateInput.value,
        priority: prioritySelect.value,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = '';
}

// Render Tasks
function renderTasks() {
    const searchTerm = searchInput.value.toLowerCase();
    const filter = filterSelect.value;

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.text.toLowerCase().includes(searchTerm);
        const matchesFilter = filter === 'all' || task.category === filter;
        return matchesSearch && matchesFilter;
    });

    taskList.innerHTML = '';
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <div>
                <div class="task-text">${task.text}</div>
                <div class="task-info">
                    <span class="category">${task.category}</span>
                    ${task.dueDate ? `<span>📅 ${task.dueDate}</span>` : ''}
                    <span class="priority-${task.priority}">${task.priority}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="complete-btn" onclick="toggleComplete(${task.id})">
                    <i class="fas fa-check"></i>
                </button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

// Toggle Complete
function toggleComplete(id) {
    const task = tasks.find(task => task.id === id);
    if (task) task.completed = !task.completed;
    saveTasks();
    renderTasks();
}

// Delete Task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

// Save to LocalStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Search & Filter Events
searchInput.addEventListener('input', renderTasks);
filterSelect.addEventListener('change', renderTasks);

// Initial Render
renderTasks();