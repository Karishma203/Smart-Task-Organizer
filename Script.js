const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const priority = document.getElementById('priority');
const addBtn = document.getElementById('addBtn');
const wellDone = document.getElementById('wellDone');
const toggleMode = document.getElementById('toggleMode');

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
tasks.forEach(task => createTaskElement(task.text, task.priority, task.completed));

// Add Task
addBtn.addEventListener('click', () => {
    const text = taskInput.value.trim();
    if (!text) return alert("Please enter a task!");
    createTaskElement(text, priority.value);
    tasks.push({ text, priority: priority.value, completed: false });
    saveTasks();
    taskInput.value = '';
});

// Dark/Light mode
toggleMode.addEventListener('change', () => {
    document.body.classList.toggle('dark');
});

// Function to create task element
function createTaskElement(text, prio, completed=false){
    const li = document.createElement('li');
    li.textContent = text;
    li.className = prio;
    if(completed) li.classList.add('completed');

    // Toggle completed & show Well Done
    li.addEventListener('click', () => {
        li.classList.toggle('completed');
        const index = Array.from(taskList.children).indexOf(li);
        tasks[index].completed = li.classList.contains('completed');
        saveTasks();

        if(li.classList.contains('completed')){
            wellDone.classList.remove('hidden');
            wellDone.classList.add('show');
            setTimeout(() => {
                wellDone.classList.remove('show');
                wellDone.classList.add('hidden');
            }, 2000);
        }
    });

    // Delete button
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.className = 'deleteBtn';
    delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = Array.from(taskList.children).indexOf(li);
        tasks.splice(index,1);
        saveTasks();
        li.remove();
    });

    li.appendChild(delBtn);

    // Drag-and-drop
    li.setAttribute('draggable', true);
    li.addEventListener('dragstart', () => li.classList.add('dragging'));
    li.addEventListener('dragend', () => li.classList.remove('dragging'));

    taskList.appendChild(li);
}

// Drag and Drop logic
taskList.addEventListener('dragover', e => {
    e.preventDefault();
    const dragging = document.querySelector('.dragging');
    const afterElement = getDragAfterElement(taskList, e.clientY);
    if(afterElement == null) taskList.appendChild(dragging);
    else taskList.insertBefore(dragging, afterElement);
    updateTaskOrder();
});

// Get element after current drag position
function getDragAfterElement(container, y){
    const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];
    return draggableElements.reduce((closest, child)=>{
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height/2;
        if(offset < 0 && offset > closest.offset) return {offset: offset, element: child};
        else return closest;
    }, {offset: Number.NEGATIVE_INFINITY}).element;
}

// Save tasks to localStorage
function saveTasks(){
    const savedTasks = Array.from(taskList.children).map(li => ({
        text: li.firstChild.textContent,
        priority: li.classList.contains('High') ? 'High' : li.classList.contains('Medium') ? 'Medium' : 'Low',
        completed: li.classList.contains('completed')
    }));
    localStorage.setItem('tasks', JSON.stringify(savedTasks));
}

// Update task order after drag
function updateTaskOrder(){ saveTasks(); }
