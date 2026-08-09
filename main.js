const textInput = document.getElementById("textInput");
const todoBtn = document.getElementById("todoBtn");
const todoList = document.getElementById("todoList");

todoBtn.addEventListener("click", (event) => {
  const li = document.createElement("li");
  li.innerText = textInput.value;
  todoList.appendChild(li);
});
