// Set current date when page loads
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Initialize progress for all sections
    ['morning', 'afternoon', 'evening'].forEach(section => {
        updateProgress(section);
    });

    // Add Enter key functionality to all input fields
    document.querySelectorAll('.task-input').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const section = this.getAttribute('data-section');
                addTask(section);
            }
        });
    });
});

// Function to format time for display
function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
}

// Add task function
function addTask(section) {
    const input = document.querySelector(`input[data-section="${section}"]`);
    const startTimeInput = document.querySelector(`input[data-section="${section}"][data-time="start"]`);
    const endTimeInput = document.querySelector(`input[data-section="${section}"][data-time="end"]`);
    
    const taskText = input.value.trim();
    const startTime = startTimeInput.value;
    const endTime = endTimeInput.value;
    
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    if (!startTime || !endTime) {
        alert('Please select both start and end times!');
        return;
    }

    if (startTime >= endTime) {
        alert('End time must be after start time!');
        return;
    }

    const taskList = document.getElementById(`${section}-tasks`);
    const taskItem = document.createElement('li');
    taskItem.className = `task-item ${section}`;
    
    const formattedStartTime = formatTime(startTime);
    const formattedEndTime = formatTime(endTime);
    
    taskItem.innerHTML = `
        <input type="checkbox" class="task-checkbox" onchange="toggleTask(this)">
        <span class="task-text">${taskText}</span>
        <span class="task-time">(${formattedStartTime} - ${formattedEndTime})</span>
        <button class="delete-btn" onclick="deleteTask(this)">×</button>
    `;

    taskList.appendChild(taskItem);
    input.value = '';
    updateProgress(section);
}

// Toggle task completion
function toggleTask(checkbox) {
    const taskItem = checkbox.parentElement;
    const section = taskItem.closest('.section').className.split(' ')[1];
    
    if (checkbox.checked) {
        taskItem.classList.add('completed');
    } else {
        taskItem.classList.remove('completed');
    }
    
    updateProgress(section);
}

// Delete task
function deleteTask(button) {
    const taskItem = button.parentElement;
    const section = taskItem.closest('.section').className.split(' ')[1];
    taskItem.remove();
    updateProgress(section);
}

// Update progress bar and stats
function updateProgress(section) {
    const taskList = document.getElementById(`${section}-tasks`);
    const tasks = taskList.querySelectorAll('.task-item');
    const completedTasks = taskList.querySelectorAll('.task-item.completed');
    
    const totalTasks = tasks.length;
    const completed = completedTasks.length;
    const percentage = totalTasks === 0 ? 0 : (completed / totalTasks) * 100;
    
    const progressBar = document.getElementById(`${section}-progress`);
    const stats = document.getElementById(`${section}-stats`);
    
    progressBar.style.width = percentage + '%';
    stats.textContent = `${completed}/${totalTasks} tasks completed (${Math.round(percentage)}%)`;
}