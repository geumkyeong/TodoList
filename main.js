const todoInput = document.getElementById("todoInput");
const todoBtn = document.getElementById("todoBtn");
const todoList = document.getElementById("todoList");

let todos = [];

// TODO 요소 추가하기, UI 업데이트
function addTodo(todo) {
  const li = document.createElement("li");
  li.className = "todo-item";

  // 체크박스, 텍스트를 묶는 그룹
  const leftGroup = document.createElement("div");
  leftGroup.className = "left-todo-group";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "todo-checkbox";
  checkbox.id = `task${todo.id}`;

  const label = document.createElement("label");
  label.htmlFor = `task${todo.id}`;
  label.className = "todo-text";
  label.textContent = todo.text;  // 텍스트 추가

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

// 초기 데이터 불러오기 & 화면 렌더링
window.addEventListener("DOMContentLoaded", () => {
  try {
    const storedTodos = localStorage.getItem("todo-list"); // 기존 데이터 가져오기

    todos = storedTodos ? JSON.parse(storedTodos) : [];
  } catch (error) {
    console.error("로컬스토리지 불러오기 실패", error.name);
    todos = [];
  }

  todos.forEach((todo) => addTodo(todo)); // UI 업데이트
});

todoBtn.addEventListener("click", () => {
  const newText = todoInput.value.trim();
  if (!newText) return;

  const maxId = todos.length > 0 ? Math.max(...todos.map((t) => t.id)) : 0; // 배열에서 추출한 id 값 중 가장 큰 숫자를 반환함

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
  try {
    localStorage.setItem("todo-list", JSON.stringify(todos));
  } catch (error) {
    console.error("로컬스토리지 백업 실패");
  }

  // 입력창 비우고 커서 두기
  todoInput.value = "";
  todoInput.focus();
});

// 엔터 키 입력 시 클릭 이벤트 발생
todoInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    todoBtn.click();
  }
});