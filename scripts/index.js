const storeKey = 'TODO_LIST';
const completedStoreKey = 'COMPLETED_TODO_LIST';

function extractFormData(formdata) {
    let obj = {};
    for (const [key, value] of formdata.entries()) {
        obj[key] = value;
    }
    return obj;
}

function updateLocalStore(value) {
    const store = localStorage.getItem(storeKey) ? JSON.parse(localStorage.getItem(storeKey)) : [];
    store.push(value);
    localStorage.setItem(storeKey, JSON.stringify(store));
}

function generateTodo(todo, parent = 'pending-todos') {
    const todos = document.getElementById(parent);
    const todoEle = document.createElement('div');
    todoEle.className = 'todo';
    const checkboxEle = document.createElement('input');
    checkboxEle.type = 'checkbox';
    checkboxEle.name = `complete-${todo.title}`;
    checkboxEle.id = `complete-${todo.title}`;
    if (parent === 'completed-todos') {
        checkboxEle.checked = true;
    }
    todoEle.appendChild(checkboxEle);
    const titleEle = document.createElement('span');
    titleEle.textContent = todo.title;
    todoEle.appendChild(titleEle);
    checkboxEle.onclick = function () {
        const isChecked = checkboxEle.checked; 
        const isCompleted = parent === 'completed-todos'; 

        if (!isCompleted) {
            const key = storeKey;
            const store = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : [];
            const newStore = store.filter((item) => item.title !== todo.title);
            localStorage.setItem(key, JSON.stringify(newStore));

            const completedTodoStore = localStorage.getItem(completedStoreKey) ? JSON.parse(localStorage.getItem(completedStoreKey)) : [];
            completedTodoStore.push(todo);
            localStorage.setItem(completedStoreKey, JSON.stringify(completedTodoStore));

            todoEle.remove();
            generateTodo(todo, 'completed-todos');
            updateCompletedCount();
        } else if ( isCompleted) {
            const completedStore = localStorage.getItem(completedStoreKey) ? JSON.parse(localStorage.getItem(completedStoreKey)) : [];
            const newCompletedStore = completedStore.filter((item) => item.title !== todo.title);
            localStorage.setItem(completedStoreKey, JSON.stringify(newCompletedStore));

            const store = localStorage.getItem(storeKey) ? JSON.parse(localStorage.getItem(storeKey)) : [];
            store.push(todo);
            localStorage.setItem(storeKey, JSON.stringify(store));

            todoEle.remove();
            generateTodo(todo, 'pending-todos');
        }

        updateCompletedCount();
    };

    todos.insertBefore(todoEle, todos.firstChild);
}



function addTodo(todo) {
    generateTodo(todo);
}

function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formdata = new FormData(form);
    const formValues = extractFormData(formdata);
    updateLocalStore(formValues);
    form.reset();
    addTodo(formValues);
    return false;
}

function loadTodos() {
    const store = localStorage.getItem(storeKey) ? JSON.parse(localStorage.getItem(storeKey)) : [];
    if (store.length > 0) {
        store.forEach((todo) => {
            generateTodo(todo);
        });
    }

    const completedTodoStore = localStorage.getItem(completedStoreKey) ? JSON.parse(localStorage.getItem(completedStoreKey)) : [];
    if (completedTodoStore.length > 0) {
        completedTodoStore.forEach((todo) => {
            generateTodo(todo, 'completed-todos');
        });
    }

    updateCompletedCount();
}

function updateCompletedCount() {
    const completedCount = JSON.parse(localStorage.getItem(completedStoreKey)).length;
    document.getElementById('completed-count').textContent = completedCount;
}

loadTodos();
