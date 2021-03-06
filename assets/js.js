
// Call to API
async function getToDoData(todo = '', query = '') {
    let url = 'api.php?todo=' + todo + '&' + query;
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

    let lis = '';
    let options = '<option value="">Select a category</option>';

    //check if the oject has elements
    if(data!=null && Object.keys(data).length>0) {    
        data.forEach(element => {
            lis += `<li>${element}<div class="cross" onclick="delToDoCat(this.parentNode)"></div></li>`;
            options += `<option>${element}</option>`;
        });
    }
    
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
    if (typeof obj == "undefined") {
        return;
    }

    //delete the category from json file
    renderToDoData('deltodocat', 'todoCatTitle=' + obj.innerText);

    //render category list again
    renderToDoData('todocats');
}

/**
 * Removes an object from page
 * @param {*} objID 
 */
function removeObj(objID) {

    var obj = document.querySelector(objID);
    //remove it if it exists
    if (typeof(obj) != 'undefined' && obj != null) {
        obj.remove();
    }
    
}

/**
 * Draw todo menu
 * @param integer to do id
 */
function renderToDoMenu(todoID){
    //set object id for menu
    var todomenuid = "#todoMenu_" + todoID;
    
    // remove it to avoid double menu
    removeObj(todomenuid);
    
    // add menu
    var tr = document.querySelector('tr[todoid="' + todoID + '"]');
    tr.innerHTML += `<div id="todoMenu_${todoID}" class="todoMenuOpen"><div class="cross" onclick="removeObj('${todomenuid}')"></div><span onclick="checkToDo('${todoID}')">Mark as done</span><span onclick="delToDo('${todoID}')">Delete</span></div>`;
    
}

/**
 * To Do row generator
 * @param object to do element
 * @returns string html
 */
function renderToDoRow(element) {
    var html = '';

    html += `<tr todoid="${element.todoID}"`;
    // check the "done" To Dos
    if(element.todoStatus == "done") {
        html += ` class="checked"`;
    // change the background color for new to do
    } else if(element.todoStatus == "new") {
        html += ` class="new"`;
    }
    html += `>`;
    html += `<td>${element.todoText}`;
    //metabox
    html += `<div class="todometa">Due date: ${element.todoDate}</div>`;
    html += `<td>${element.todoCat}<div class="todoMenu" onclick="renderToDoMenu('${element.todoID}')"></div></td>`;
    html += `</tr>`;

    return(html);

}

/** 
 * Render To Do List
 * @param json object data
 */
 function renderToDoList(data) {
    if(data == null || Object.keys(data).length<1) {
        return;
    }


    var id = 0;
    var todos = '';

    data.forEach(element => {
        todos += renderToDoRow(element);

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
 * Add a To Do
 */
function addToDo() {
    //set variables
    var element = {
        todoID: document.querySelector('#todoID').value,
        todoText: document.querySelector('#todoText').value,
        todoDate: document.querySelector('#todoDate').value,
        todoCat: document.querySelector('#todoCat').value,
        todoStatus: "new"
    } 

    //Do checks
    if(element.todoText == '' || element.todoCat == '' || element.todoDate == '') {
        alert('Please fill out all the fields (Title, Category and Date) and try again!\nAdd a new category in case if it is your first time using the app.');
        return;
    }

    var html = renderToDoRow(element);
    //add it to page
    renderHTML('#todoListItems', html, true);

    var query = "todoID=" + element.todoID + "&todoText=" + element.todoText + "&todoDate=" + element.todoDate + "&todoCat=" + element.todoCat + "&todoStatus=newadded";
    
    //add it to json file
    renderToDoData('addtodo', query);

    //cleaning up
    document.querySelector('#todoID').value = parseInt(element.todoID) + 1;
    document.querySelector('#todoText').value = '';
}

/**
 * Delete a To Do
 * @param int id of the To Do
 */
 function delToDo(todoID) {
    //check if the oject is valid
    if (typeof todoID == "undefined") {
        return;
    }

    //delete the to do from json file
    renderToDoData('deletetodo', 'todoID=' + todoID);

    //remove the row
    removeObj(`tr[todoid="${todoID}"]`);
 }

 /**
  * Mark the to do as done
  * @param {*} todoID 
  */
function checkToDo(todoID) {
    //check if the oject is valid
    if (typeof todoID == "undefined") {
        return;
    }

    //change the style in page
    document.querySelector(`tr[todoid="${todoID}"]`).classList.add("checked");

    //remove the menu
    removeObj(`#todoMenu_${todoID}`);

    //delete the to do from json file
    renderToDoData('checktodo', 'todoID=' + todoID);
}

/**
 * Filters todo table by search
 */
 function todoFilter() {
    // Declare variables
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("todoSearch");
    filter = input.value.toUpperCase();
    table = document.getElementById("todoListItems");
    tr = table.getElementsByTagName("tr");
  
    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[1];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }

// Run scripts to load data
//get categories
renderToDoData('todocats');
//get to dos
renderToDoData('todolist');
