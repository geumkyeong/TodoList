const todoInput = document.getElementById("todoInput");
const todoBtn = document.getElementById("todoBtn");
const todoList = document.getElementById("todoList");

const checkbox = document.querySelector(".todo-checkbox");

let todos = [];

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
  checkbox.checked = todo.done;
  checkbox.id = `task${todo.id}`;

  const label = document.createElement("label");
  label.htmlFor = `task${todo.id}`;
  label.className = "todo-text";
  label.textContent = todo.text; // 텍스트 추가

  // 삭제 버튼
  const removeBtn = document.createElement("button");
  removeBtn.textContent = "×";
  removeBtn.className = "delete-btn";

  removeBtn.addEventListener("click", function () {
    li.remove();
  });

  leftGroup.appendChild(checkbox);
  leftGroup.appendChild(label);

  li.appendChild(leftGroup);
  li.appendChild(removeBtn);

  todoList.appendChild(li);
}

// UI 업데이트
function renderTodos(todos) {
  todoList.innerHTML = "";  // UI 초기화

  todos.forEach((todo) => addTodo(todo));
}

// 로컬 스토리지에 저장하기
function saveTodos(todos) {
  try {
    localStorage.setItem("todo-list", JSON.stringify(todos));
  } catch (error) {
    console.error("로컬스토리지 백업 실패");
  }
}

// 초기 데이터 불러오기 & 화면 렌더링
window.addEventListener("DOMContentLoaded", () => {
  try {
    const storedTodos = localStorage.getItem("todo-list"); // 기존 데이터 가져오기

    todos = storedTodos ? JSON.parse(storedTodos) : [];

    renderTodos(todos);
  } catch (error) {
    console.error("로컬스토리지 불러오기 실패", error.name);
    todos = [];
  }
});

todoBtn.addEventListener("click", () => {
  const newText = todoInput.value.trim();
  if (!newText) return;

  // 맨 끝 인덱스
  const maxId = todos.length > 0 ? Math.max(...todos.map((t) => t.id)) : 0;
  const newTodo = {
    id: maxId + 1, // 다음 인덱스
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
    console.log("id: ", checkboxId, "체크 여부: ", event.target.checked);

    // task 부분을 지우고, 남은 부분을 가져온다.
    const idNumber = checkboxId.replace("task", "");
    console.log(typeof idNumber); // STRING

    // 체크박스의 id 와 일치하는 todo 객체를 배열에서 가져온다.
    const target = todos.find((todo) => todo.id === Number(idNumber));  

    if (target) {
      target.done = !target.done; // 체크 상태 업데이트

      saveTodos(todos); // 로컬 스토리지에 저장
      
      renderTodos(todos); // UI 업데이트
    }
  }
});

// Enter 누를 때 클릭 이벤트 발생
todoInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    todoBtn.click();
  }
});
