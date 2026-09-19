// 待辦清單資料的儲存鍵名稱
const STORAGE_KEY = 'todo-list-items';

// 取得 DOM 元素
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const todoCount = document.getElementById('todoCount');

// 從 localStorage 讀取資料，若沒有資料則預設為空陣列
let todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

// 保存待辦資料到 localStorage
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// 計算未完成項目數量並更新底部文字
function updateTodoCount() {
  const remainingCount = todos.filter((todo) => !todo.completed).length;
  todoCount.textContent = `未完成: ${remainingCount} 項`;
}

// 根據資料內容顯示空白提示與列表
function renderTodos() {
  todoList.innerHTML = '';

  // 若待辦清單為空，顯示提示文字
  if (todos.length === 0) {
    emptyState.classList.add('is-visible');
  } else {
    emptyState.classList.remove('is-visible');
  }

  // 依序建立每一筆待辦項目
  todos.forEach((todo) => {
    const item = document.createElement('li');
    item.className = `todo-item ${todo.completed ? 'completed' : ''}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.setAttribute('aria-label', `標記 ${todo.text} 完成`);

    // 勾選事件：更新完成狀態並重新渲染
    checkbox.addEventListener('change', () => {
      todo.completed = checkbox.checked;
      saveTodos();
      renderTodos();
    });

    const text = document.createElement('span');
    text.className = 'todo-text';
    text.textContent = todo.text;

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-btn';
    deleteButton.textContent = '刪除';

    // 刪除事件：移除這筆待辦並更新儲存與畫面
    deleteButton.addEventListener('click', () => {
      todos = todos.filter((todoItem) => todoItem.id !== todo.id);
      saveTodos();
      renderTodos();
    });

    item.appendChild(checkbox);
    item.appendChild(text);
    item.appendChild(deleteButton);
    todoList.appendChild(item);
  });

  updateTodoCount();
}

// 新增待辦事項
function addTodo(event) {
  event.preventDefault();

  const text = todoInput.value.trim();

  // 若輸入為空白，直接忽略
  if (!text) {
    todoInput.focus();
    return;
  }

  // 建立新的待辦物件
  const newTodo = {
    id: Date.now() + Math.random(),
    text,
    completed: false,
  };

  todos.unshift(newTodo);
  saveTodos();
  renderTodos();

  // 清空輸入框並重新聚焦
  todoInput.value = '';
  todoInput.focus();
}

// 註冊新增表單送出事件
todoForm.addEventListener('submit', addTodo);

// 首次載入時渲染目前資料
renderTodos();
