// 可爱待办事项应用 - JavaScript功能

class TodoApp {
  constructor() {
    this.tasks = [];
    this.currentTab = 'all';
    this.init();
  }

  init() {
    this.bindEvents();
    this.loadTasks();
    this.renderTasks();
  }

  bindEvents() {
    // 表单提交事件
    const form = document.getElementById('todo-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.addTask();
    });

    // 标签页切换事件
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.switchTab(e.target.dataset.tab);
      });
    });
  }

  addTask() {
    const input = document.getElementById('new-task');
    const text = input.value.trim();
    
    if (text) {
      const task = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date()
      };
      
      this.tasks.push(task);
      input.value = '';
      this.saveTasks();
      this.renderTasks();
    }
  }

  toggleTask(id) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.saveTasks();
      this.renderTasks();
    }
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.saveTasks();
    this.renderTasks();
  }

  switchTab(tab) {
    this.currentTab = tab;
    
    // 更新标签页按钮状态
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    
    // 更新任务列表容器显示
    document.querySelectorAll('.task-list-container').forEach(container => {
      container.classList.remove('active');
    });
    document.getElementById(`${tab}-tasks`).classList.add('active');
    
    this.renderTasks();
  }

  getFilteredTasks() {
    switch (this.currentTab) {
      case 'pending':
        return this.tasks.filter(task => !task.completed);
      case 'completed':
        return this.tasks.filter(task => task.completed);
      default:
        return this.tasks;
    }
  }

  renderTasks() {
    const filteredTasks = this.getFilteredTasks();
    
    // 更新所有列表
    this.updateTaskList('all-list', this.tasks);
    this.updateTaskList('pending-list', this.tasks.filter(task => !task.completed));
    this.updateTaskList('completed-list', this.tasks.filter(task => task.completed));
  }

  updateTaskList(listId, tasks) {
    const list = document.getElementById(listId);
    list.innerHTML = '';
    
    if (tasks.length === 0) {
      const emptyState = document.createElement('li');
      emptyState.className = 'empty-state';
      emptyState.textContent = '暂无任务';
      list.appendChild(emptyState);
      return;
    }
    
    tasks.forEach(task => {
      const li = this.createTaskElement(task);
      list.appendChild(li);
    });
  }

  createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.dataset.id = task.id;
    
    li.innerHTML = `
      <span class="task-text">${task.text}</span>
      <div class="task-buttons">
        <button class="task-btn ${task.completed ? 'incomplete-btn' : 'complete-btn'}" 
                onclick="todoApp.toggleTask(${task.id})">
          ${task.completed ? '🔄 未完成' : '✅ 完成'}
        </button>
        <button class="task-btn delete-btn" 
                onclick="todoApp.deleteTask(${task.id})">
          🗑️ 删除
        </button>
      </div>
    `;
    
    return li;
  }

  saveTasks() {
    localStorage.setItem('cute-todo-tasks', JSON.stringify(this.tasks));
  }

  loadTasks() {
    const saved = localStorage.getItem('cute-todo-tasks');
    if (saved) {
      this.tasks = JSON.parse(saved);
    }
  }

  clearCompleted() {
    if (this.tasks.some(task => task.completed)) {
      if (confirm('确定要清除所有已完成的任务吗？')) {
        this.tasks = this.tasks.filter(task => !task.completed);
        this.saveTasks();
        this.renderTasks();
        this.showMessage('已清除所有已完成的任务！', 'success');
      }
    } else {
      this.showMessage('没有已完成的任务需要清除！', 'info');
    }
  }

  clearAll() {
    if (this.tasks.length > 0) {
      if (confirm('⚠️ 确定要清除所有任务吗？此操作不可恢复！')) {
        this.tasks = [];
        this.saveTasks();
        this.renderTasks();
        this.showMessage('已清除所有任务！', 'success');
      }
    } else {
      this.showMessage('没有任务需要清除！', 'info');
    }
  }

  showMessage(text, type = 'info') {
    // 创建消息提示元素
    const message = document.createElement('div');
    message.className = `message message-${type}`;
    message.textContent = text;
    
    // 添加样式
    message.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 25px;
      border-radius: 10px;
      color: white;
      font-weight: bold;
      z-index: 1000;
      animation: slideIn 0.3s ease;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    `;
    
    // 根据类型设置背景色
    switch (type) {
      case 'success':
        message.style.background = 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)';
        break;
      case 'info':
        message.style.background = 'linear-gradient(135deg, #ffa726 0%, #ff9800 100%)';
        break;
      case 'error':
        message.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)';
        break;
    }
    
    // 添加到页面
    document.body.appendChild(message);
    
    // 3秒后自动移除
    setTimeout(() => {
      message.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        if (message.parentNode) {
          message.parentNode.removeChild(message);
        }
      }, 300);
    }, 3000);
  }
}

// 添加消息动画样式
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// 初始化应用
const todoApp = new TodoApp();