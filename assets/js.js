
// Call to API
async function getToDoData(todo = '', query = '') {
    let url = 'http://localhost/teamblue/api.php?todo=' + todo + '&' + query;
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

// Process the response
async function renderToDoData(todo = '', query = '') {
    let data = await getToDoData(todo, query);

    switch (todo) {
        // Get To Do Categories
        case 'todocats':
            renderToDoCats(data);
            break;

        // Add a To Do Category
        case 'todolist':
            renderToDoList(data);
            break;
    }

}

/** 
 * Renders html into page
 * @param string container
 * @param string html code
 */
function renderHTML(container, html, isAppend = false) {
    let thecontainer = document.querySelector(container);
    if(isAppend==true) {
        thecontainer.innerHTML += html;
    } else {
        thecontainer.innerHTML = html;
    }
}

/** 
 * Render To Do categories
 * @param json object data
 */
function renderToDoCats(data) {
    //check if the oject has elements
    if(Object.keys(data).length<1) {
        return;
    }

    let lis = '';
    let options = '<option value="">Select a category</option>';

    data.forEach(element => {
        lis += `<li>${element}<div class="cross" onclick="delToDoCat(this.parentNode)"></div></li>`;
        options += `<option>${element}</option>`;
    });
    
    //place html into the page
    renderHTML('#myCats', lis);
    renderHTML('#todoCat', options);
}

/** 
 * Adds a new category
 */
 function addToDoCat() {
    var todoCat = document.querySelector("#todoCatTitle").value;

    //add it to category select and list
    renderHTML('#myCats', `<li>${todoCat}<div class="cross" onclick="delToDoCat(this.parentNode)"></div></li>`, true);
    renderHTML('#todoCat', `<option>${todoCat}</option>`, true);

    //add it to json file
    renderToDoData('addtodocat', 'todoCatTitle=' + todoCat);
}

/**
 * Delete a category
 * @param DOM object
 */
function delToDoCat(obj) {
    //check if the oject is valid
    if (typeof maybeObject == "undefined") {
        return;
    }

    //delete the category from json file
    renderToDoData('deltodocat', 'todoCatTitle=' + obj.innerText);

    //render category list again
    renderToDoData('todocats');
}

/** 
 * Render To Do List
 * @param json object data
 */
 function renderToDoList(data) {
    //check if the oject has elements
    if(Object.keys(data).length<1) {
        return;
    }

    var id = 0;
    let todos = `<tr><td class="tableTodoName">Task</td><td class="tableTodoCat">Category</td></tr>`;

    data.forEach(element => {
        todos += `<tr todoid="${element.todoID}"`;
        // check the "done" To Dos
        if(element.todoStatus == "done") {
            todos += ` class="checked"`;
        }
        todos += `>`;
        todos += `<td>${element.todoText}`;
        //metabox
        todos += `<div class="todometa">Due date: ${element.todoDate}</div>`;
        todos += `<td>${element.todoCat}<div class="cross" onclick="delToDo('${element.todoID}')"></div></td>`;
        todos += `</tr>`;

        //get id
        if(id < parseInt(element.todoID)) {
            id = parseInt(element.todoID);
        }
    });
    
    //set id for next to do
    document.querySelector('#todoID').value = id + 1;
    
    //place html into the page
    renderHTML('#todoListItems', todos);
}

/**
 * Adds a To Do
 */
function addToDo() {
    //set variables
    var todoID = document.querySelector('#todoID').value;
    var todoText = document.querySelector('#todoText').value;
    var todoDate = document.querySelector('#todoDate').value;
    var todoCat = document.querySelector('#todoCat').value;

    var html = `<tr class="new" todoid="${todoID}">`;
    html += `<td>${todoText}<div class="todometa">Due date: ${todoDate}</div></td>`;
    html += `<td>${todoCat}<div class="cross" onclick="delToDo('${todoID}')"></div></td>`;
    html += `</tr>`;
    //add it to page
    renderHTML('#todoListItems', html, true);

    var query = "todoID=" + todoID + "&todoText=" + todoText + "&todoDate=" + todoDate + "&todoCat=" + todoCat + "&todoStatus=new";
    
    //add it to json file
    renderToDoData('addtodo', query);

    //cleaning up
    document.querySelector('#todoID').value = parseInt(todoID) + 1;
    document.querySelector('#todoText').value = '';
}

// Run scripts to load data
//get categories
renderToDoData('todocats');
//get to dos
renderToDoData('todolist');
