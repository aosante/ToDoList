//si hay algo en el LS, se lo asigna al objeto data, si no, crea el objeto para tenerlo listo
let data = localStorage.getItem('todoList') ? JSON.parse(localStorage.getItem('todoList')) : {
    todo: [],
    completed: []
};

//este string llama a los svg's
//va a ser el innerHTML de los botones creados dinamicamente
let removeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect class="noFill" width="22" height="22"/><g><g><path class="fill" d="M16.1,3.6h-1.9V3.3c0-1.3-1-2.3-2.3-2.3h-1.7C8.9,1,7.8,2,7.8,3.3v0.2H5.9c-1.3,0-2.3,1-2.3,2.3v1.3c0,0.5,0.4,0.9,0.9,1v10.5c0,1.3,1,2.3,2.3,2.3h8.5c1.3,0,2.3-1,2.3-2.3V8.2c0.5-0.1,0.9-0.5,0.9-1V5.9C18.4,4.6,17.4,3.6,16.1,3.6z M9.1,3.3c0-0.6,0.5-1.1,1.1-1.1h1.7c0.6,0,1.1,0.5,1.1,1.1v0.2H9.1V3.3z M16.3,18.7c0,0.6-0.5,1.1-1.1,1.1H6.7c-0.6,0-1.1-0.5-1.1-1.1V8.2h10.6L16.3,18.7L16.3,18.7z M17.2,7H4.8V5.9c0-0.6,0.5-1.1,1.1-1.1h10.2c0.6,0,1.1,0.5,1.1,1.1V7z"/></g><g><g><path class="fill" d="M11,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6s0.6,0.3,0.6,0.6v6.8C11.6,17.7,11.4,18,11,18z"/></g><g><path class="fill" d="M8,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8C7.4,10.2,7.7,10,8,10c0.4,0,0.6,0.3,0.6,0.6v6.8C8.7,17.7,8.4,18,8,18z"/></g><g><path class="fill" d="M14,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C14.6,17.7,14.3,18,14,18z"/></g></g></g></svg>';
let completeSVG = ' <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect y="0" class="noFill" width="22" height="22"/><g><path class="fill" d="M9.7,14.4L9.7,14.4c-0.2,0-0.4-0.1-0.5-0.2l-2.7-2.7c-0.3-0.3-0.3-0.8,0-1.1s0.8-0.3,1.1,0l2.1,2.1l4.8-4.8c0.3-0.3,0.8-0.3,1.1,0s0.3,0.8,0,1.1l-5.3,5.3C10.1,14.3,9.9,14.4,9.7,14.4z"/></g></svg>';

renderList();
//se ejecuta la funcion agregar si se presiona enter
window.addEventListener('keyup', function(e) {
    e.preventDefault();
    if(e.keyCode == 13) {
        add();
    }
});
document.getElementById('add').addEventListener('click', add);

//agrega el valor del input y lo agrega al array de todos
//crea el li item junto con los botones
//guarda el valor en localstorage en el array de todos
function add() {
    let value = document.getElementById('item').value;
    if(value) {
        addItemTodo(value);
        document.getElementById('item').value = '';

        data.todo.push(value);//adds task to the todo array inside the data object
        dataObjectUpdated();
    }
}

/*Muestra la lista actualizada recorriendo los arrays del objeto guardado
en localSrorage. Se recorre el array proveniente del ls y se pasa cada item
a la funcion addItemTodo para render la ul. Esa funcion
le agrega la clase dependiendo de si es todo o completed. Por eso
se le pasa el booleano en el segundo for loop*/ 
function renderList() {
    if(!data.todo.length && !data.completed.length) return;

    for(let i = 0; i < data.todo.length; i++) {
        let value = data.todo[i];
        addItemTodo(value);
    }

    for(let j = 0; j < data.completed.length; j++) {
        let value = data.completed[j];
        addItemTodo(value, true);
    }


}

//setea el objeto de data en el ls. Se llama cada vez que se agrega o elimina un task
function dataObjectUpdated() {
    localStorage.setItem('todoList', JSON.stringify(data));
}


/*Se le quita el li al ul. Se guarda el id para ver si es de la lista todo,
y luego se guarda el innertext o el task que el li tenga. Luego se 
elimina del array usando el texto para encontrar el índice. Luego se actualiza el ls*/ 
function removeItem() {
    //parentNode.parentNode es el li element
    let item = this.parentNode.parentNode; //li
    let parent = item.parentNode; //ul
    let id = parent.id;
    let value = item.innerText;

     parent.removeChild(item);

     if(id === 'todo') {
         let index = data.todo.indexOf(value);
        data.todo.splice(index, 1);//removes value from the todo array
    } else {
        index = data.completed.indexOf(value);
        data.completed.splice(index, 1);
    }

    dataObjectUpdated();


}


function completeTask()  { //complete or uncomplete task
    let item = this.parentNode.parentNode; //li
    let parent = item.parentNode; //ul
    let id = parent.id;
    let value = item.innerText;

    if(id === 'todo') {
        //remueve el valor del array al accesar el objeto data, la propiedad todo, y encontrando el índice de este
        let index = data.todo.indexOf(value);
        data.todo.splice(index, 1);
        data.completed.push(value);//pushes the completed task to the completed array
    } else {
        index = data.completed.indexOf(value);
        data.completed.splice(index, 1);
        data.todo.push(value);
    }

    dataObjectUpdated()

    let target = (id === 'todo') ? document.getElementById('completed') : document.getElementById('todo');

    parent.removeChild(item);
    target.insertBefore(item, target.childNodes[0]);




}


/*Selecciona la unordered list dependiendo de si el item a agregar es un item de todo
o completed. Crea un elemento li, junto con el div de los botones, crea los botones de remove y de complete
con sus respectibas clases y los SVGs. Tambien se le agrega los event listeners a los botones*/
function addItemTodo(text, completed) {
//la unordered list
let list = (completed) ? document.getElementById('completed') : document.getElementById('todo');

    let item = document.createElement('li');
    item.innerText = text; //para llenar con el texto del usuario

    let buttons = document.createElement('div');
    buttons.classList.add('buttons');

    let remove = document.createElement('button');
    remove.classList.add('remove');
    remove.innerHTML = removeSVG;

    //agregar evento click para el boton de remove
    remove.addEventListener('click', removeItem);



    let complete = document.createElement('button');
    complete.classList.add('complete');
    complete.innerHTML = completeSVG;

    //agregar evento para boton de completar
    complete.addEventListener('click', completeTask);

    //mete los botones en el div creado
    buttons.appendChild(remove);
    buttons.appendChild(complete);

    item.appendChild(buttons);

    //esto para que el item se inserte en la parte de arriba
    list.insertBefore(item, list.childNodes[0]);

}

