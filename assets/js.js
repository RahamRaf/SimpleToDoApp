
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

    let todos = `<tr><td class="tableTodoName">Task</td><td class="tableTodoCat">Category</td></tr>`;

    data.forEach(element => {
        todos += `<tr`;
        // check the "done" To Dos
        if(element.status == "done") {
            todos += ` class="checked"`;
        }
        todos += `>`;
        todos += `<td todoid="${element.id}">${element.todoText}`;
        //metabox
        todos += `<div class="todometa">Due date: ${element.todoDate}</div>`;
        todos += `<td>${element.todoCat}</td>`;
        todos += `</td></tr>`;
    });
    
    //place html into the page
    renderHTML('#todoListItems', todos);
}



// Run scripts to load data
//get categories
renderToDoData('todocats');
//get to dos
renderToDoData('todolist');
