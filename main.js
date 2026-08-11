const todoInput = document.getElementById("todoInput");
const todoBtn = document.getElementById("todoBtn");
const todoList = document.getElementById("todoList");

let todos = [];

// TODO 요소 추가하기, UI 업데이트
function addTodo(text) {
  const li = document.createElement("li");
  li.textContent = text;
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

  // 새 데이터를 배열에 추가
  todos.push(newText); 

  // UI 업데이트
  addTodo(newText); 

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

