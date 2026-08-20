const todoInput = document.getElementById("todoInput");
const todoBtn = document.getElementById("todoBtn");
const todoList = document.getElementById("todoList");

const checkbox = document.querySelector(".todo-checkbox");

const TODO_LIST_KEY = "todo-list";

let todos = [];

function loadTodos() {
  return JSON.parse(localStorage.getItem(TODO_LIST_KEY)) || [];
}

// 하나의 TODO 요소 추가하기
function addTodo(todo) {
  const li = document.createElement("li");
  li.className = "todo-item";

  // 체크박스, 텍스트를 묶는 그룹
  const leftGroup = document.createElement("div");
  leftGroup.className = "left-todo-group";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "todo-checkbox";
  checkbox.checked = todo.done; // 로컬스토리지의 완료 상태(true/false)를 화면에 적용하기
  checkbox.id = `task${todo.id}`;

  const label = document.createElement("label");
  label.htmlFor = `task${todo.id}`;
  label.className = "todo-text";
  label.textContent = todo.text; // 텍스트 추가

  // 삭제 버튼
  const removeBtn = document.createElement("button");
  removeBtn.textContent = "×";
  removeBtn.className = "delete-btn";

  leftGroup.appendChild(checkbox);
  leftGroup.appendChild(label);

  li.appendChild(leftGroup);
  li.appendChild(removeBtn);

  todoList.appendChild(li);
}

// 로컬 스토리지에 저장하기
function saveTodos(todos) {
  try {
    localStorage.setItem(TODO_LIST_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error("로컬스토리지 백업 실패");
  }
}

// UI 업데이트
function renderTodos(todos) {
  todoList.innerHTML = ""; // UI 초기화

  todos.forEach((todo) => addTodo(todo));
}

// 로컬스토리지에서 데이터를 지우고, 화면을 다시 그린다
function deleteTodo(todoId) {
  todos = loadTodos();
  // filter는 조건에 맞는 요소들을 모아 '새로운 배열'을 만든다.
  todos = todos.filter((todo) => todo.id !== todoId);

  saveTodos(todos);

  renderTodos(todos);
}

// 초기 데이터 불러오기 & 화면 렌더링
window.addEventListener("DOMContentLoaded", () => {
  try {
    todos = loadTodos();
  } catch (error) {
    console.error("로컬스토리지 불러오기 실패", error.name);
    todos = [];
  }

  renderTodos(todos);
});

todoBtn.addEventListener("click", () => {
  const newText = todoInput.value.trim();
  if (!newText) return;

  // 가장 큰 ID 값
  const maxId = todos.length > 0 ? Math.max(...todos.map((t) => t.id)) : 0;
  const newTodo = {
    id: maxId + 1, // 다음 ID
    text: newText,
    done: false,
  };

  // 새 데이터를 배열에 추가
  todos.push(newTodo);

  // UI 업데이트
  addTodo(newTodo);

  // 로컬 스토리지에 저장하기
  saveTodos(todos);

  // 입력창 비우고 커서 두기
  todoInput.value = "";
  todoInput.focus();
});

todoList.addEventListener("change", (event) => {
  // 체크박스에서 이벤트 발생할 때
  if (event.target && event.target.type === "checkbox") {
    const checkboxId = event.target.id; // task1
    if (!checkboxId) return;

    // task 부분을 지우고, 남은 부분을 가져온다.
    const targetId = Number(checkboxId.replace("task", ""));

    // find는 조건에 맞는 객체 '하나'를 그대로 반환한다.
    const target = todos.find((todo) => todo.id === targetId);

    if (target) {
      target.done = event.target.checked; // 체크 상태 동기화

      saveTodos(todos); // 로컬 스토리지에 저장

      renderTodos(todos); // UI 업데이트
    }
  }
});

todoList.addEventListener("click", (event) => {
  // 클릭된 요소가 삭제 버튼(.delete-btn) 일 때
  if (event.target && event.target.classList.contains("delete-btn")) {
    const li = event.target.closest(".todo-item"); // 가장 가까운 부모 요소 'li'를 찾는다.
    if (!li) return;

    const checkbox = li.querySelector(".todo-checkbox"); // 그 li 내부에서 checkbox 요소를 찾는다.
    if (!checkbox) return;

    const checkboxId = checkbox.id;
    const targetId = Number(checkboxId.replace("task", ""));

    deleteTodo(targetId); 
  }
});

// Enter 누를 때 클릭 이벤트 발생
todoInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    todoBtn.click();
  }
});
