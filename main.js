const todoInput = document.getElementById("todoInput");
const todoBtn = document.getElementById("todoBtn");

const container = document.querySelector(".todo-container");

const todoList = document.getElementById("todo-list");
const doneList = document.getElementById("done-list");
const toggleBtn = document.getElementById("toggle-done-btn");

const checkbox = document.querySelector(".todo-checkbox");

const TODO_LIST_KEY = "todo-list";

let isShowCompleted = false;
let todos = [];

function loadTodos() {
  return JSON.parse(localStorage.getItem(TODO_LIST_KEY)) || [];
}

// 하나의 TODO 요소 추가하기
function addTodo(todo, isCompleted = false) {
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

  // 매개변수의 값(true/false)에 따라 각각 다른 리스트에 todo 요소가 추가된다.
  if (isCompleted) {
    doneList.appendChild(li);
  } else {
    todoList.appendChild(li);
  }
}

// 로컬 스토리지에 저장하기
function saveTodos(todos) {
  try {
    localStorage.setItem(TODO_LIST_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error("로컬스토리지 백업 실패");
  }
}

// 안내 메시지 생성 유틸 함수
const createMessage = (text) => {
  const li = document.createElement("li");
  li.className = "empty-message";
  li.textContent = text;
  return li;
};

// UI 업데이트
function renderTodos(todos) {
  todoList.innerHTML = ""; // UI 초기화
  doneList.innerHTML = "";
  
  // todos라는 객체 배열을 돌면서, 특정 조건에 따라 객체들을 그룹별로 묶어 분류(Grouping)할 수 있다.
  const { completed, incompleted } = todos.reduce(
    (acc, todo) => {
      if (todo.done) {
        acc.completed.push(todo); // done이 true면, completed 배열에 추가
      } else {
        acc.incompleted.push(todo); // done이 false면, incompleted 배열에 추가
      }
      return acc;
    },
    { completed: [], incompleted: [] },
  );

  incompleted.forEach((todo) => addTodo(todo, false)); // 미완료된 할 일 리스트 보여주기

  // isShowCompleted 가 true일 때,
  if (isShowCompleted) {
    completed.forEach((todo) => addTodo(todo, true)); // 완료된 할 일 리스트 보여주기
  }
}

// 로컬스토리지에서 데이터를 지우고, 화면을 다시 그린다
function deleteTodo(todoId) {
  todos = loadTodos();

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

container.addEventListener("change", (event) => {
  if (event.target && event.target.type === "checkbox") {
    const checkboxId = event.target.id; // task1
    if (!checkboxId) return;

    const targetId = Number(checkboxId.replace("task", ""));

    const target = todos.find((todo) => todo.id === targetId);

    if (target) {
      target.done = event.target.checked; // 체크 상태 동기화

      saveTodos(todos); // 로컬 스토리지에 저장

      renderTodos(todos); // UI 업데이트
    }
  }
});

container.addEventListener("click", (event) => {
  if (event.target && event.target.classList.contains("delete-btn")) {
    const li = event.target.closest(".todo-item"); // 가장 가까운 부모 요소 'li'를 찾는다.
    if (!li) return;

    const checkbox = li.querySelector(".todo-checkbox"); // 해당 li 내부에서 checkbox를 찾는다.
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

//
toggleBtn.addEventListener("click", () => {
  isShowCompleted = !isShowCompleted; // true <-> false

  toggleBtn.classList.toggle("active"); // 클릭할 때마다 active 클래스 추가/제거

  // 화면을 새로 그린다.
  renderTodos(todos);
});
