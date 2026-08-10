const todoInput = document.getElementById("todoInput");
const todoBtn = document.getElementById("todoBtn");
const todoList = document.getElementById("todoList");

function addTodo(text) {
  const li = document.createElement("li");
  li.textContent = text;
  todoList.appendChild(li);
}

window.addEventListener("DOMContentLoaded", () => {
  const storedTodos = localStorage.getItem("todo-list") || "";
  if (!storedTodos.trim()) return;

  const todoItems = storedTodos
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item !== "");

  todoItems.forEach((todo) => addTodo(todo));
});

todoBtn.addEventListener("click", (event) => {
  const newText = todoInput.value.trim();
  if (!newText) return;

  const existingText = localStorage.getItem("todo-list") || "";
  const updatedText = existingText ? `${existingText},${newText}` : newText;

  localStorage.setItem("todo-list", updatedText);

  addTodo(newText);

  todoInput.value = "";
});
