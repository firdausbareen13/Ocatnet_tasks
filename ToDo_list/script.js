const input= document.querySelector("input");
const addbutton= document.querySelector(".add-button");
const todosHtml= document.querySelector(".todos");
const emptyImage= document.querySelector(".empty-image");
let todosJson= JSON.parse(localStorage.getItem("todos"))||[];
const deleteAllButton= document.querySelector(".delete-all");
const filters= document.querySelectorAll(".filter");
const todosWrapper = document.querySelector(".todo-wrapper");
const errorText = document.querySelector(".error-msg");
let filter='';
showTodos();

function getTodoHtml(todo, index) {
    if (filter && filter !== todo.status) {
        return '';
    }

    let checked = todo.status === "completed" ? "checked" : "";
    return /*html*/ `
    <li class="todo">
        <label for="${index}">
            <input id="${index}" onclick="updateStatus(this)" type="checkbox" ${checked}>
            <span class="todo-span ${checked}">${todo.name}</span>
        </label>
        <input class="edit-input" type="text" value="${todo.name}" style="display: none;">
        <button class="edit-btn" data-index="${index}" onclick="edit(this)">
            <i class="bi bi-pencil-square"></i>
        </button>
        <button class="save-btn" data-index="${index}" onclick="save(this)" style="display: none;">
            <i class="bi bi-save"></i>
        </button>
        <button class="delete-btn" data-index="${index}" onclick="remove(this)">
            <i class="fa-light fa-x"></i>
        </button>
    </li>
`;
}

function showTodos() {
    if (todosJson.length === 0) {
        todosHtml.innerHTML = '';
        emptyImage.style.display = 'block';
    } else {
        todosHtml.innerHTML = todosJson.map(getTodoHtml).join('');
        emptyImage.style.display = 'none';
    }
}
function addTodo(todo){
    input.value="";
    todosJson.unshift({name:todo,status:"pending"});
    localStorage.setItem("todos",JSON.stringify(todosJson));
    showTodos(); 
}

input.addEventListener("keyup", e=>{
    let todo=input.value.trim();
    errorText.style.display = 'none';
    if (e.key === "Enter") {
        let todo = input.value.trim();
        if (!todo) {
            errorText.style.display = 'block'; 
            return;
        }
    }
    if(!todo|| e.key!="Enter")
    {
        return;
    }
    addTodo(todo);
});

addbutton.addEventListener("click",()=>{
    let todo=input.value.trim();
    if (!todo) {
        errorText.style.display = 'block';
        return;
    }
    if(!todo){
        return;
    }
    addTodo(todo)
});

function updateStatus(todo){
    let todoName=todo.parentElement.lastElementChild;
    if(todo.checked){
        todoName.classList.add("checked");
        todosJson[todo.id].status="completed";
    }else{
        todoName.classList.remove("checked");
        todosJson[todo.id].status="pending";
    }
    localStorage.setItem("todos",JSON.stringify(todosJson));
}

function remove(todo){
    const index= todo.dataset.index;
    todosJson.splice(index,1);
    showTodos();
    localStorage.setItem("todos",JSON.stringify(todosJson));
}

filters.forEach(function(el){
    el.addEventListener("click",(e)=>{
        if(el.classList.contains('active')){
            el.classList.remove('active');
            filter='';
        }else{
            filters.forEach(tag=> tag.classList.remove('active'));
            el.classList.add('active');
            filter=e.target.dataset.filter;
        }
        showTodos();
    });
});

deleteAllButton.addEventListener("click",()=>{
    todosJson=[];
    localStorage.setItem("todos",JSON.stringify(todosJson));
    showTodos();
});

function edit(todo) {
    const index = todo.dataset.index;
    const listItem = todo.parentElement;
    const editInput = listItem.querySelector('.edit-input');
    const todoSpan = listItem.querySelector('.todo-span');
    const saveButton = listItem.querySelector('.save-btn');

    todoSpan.style.display = 'none';
    editInput.style.display = 'inline-block';
    saveButton.style.display = 'inline-block';
    todo.style.display = 'none';
}

function save(todo) {
    const index = todo.dataset.index;
    const listItem = todo.parentElement;
    const editInput = listItem.querySelector('.edit-input');
    const todoSpan = listItem.querySelector('.todo-span');
    const editButton = listItem.querySelector('.edit-btn');

    const updatedTodo = editInput.value.trim();
    if (updatedTodo) {
        todosJson[index].name = updatedTodo;
        localStorage.setItem("todos", JSON.stringify(todosJson));
        showTodos();
    }

    editInput.style.display = 'none';
    todoSpan.style.display = 'inline-block';
    todo.style.display = 'none';
    editButton.style.display = 'inline-block';
}

