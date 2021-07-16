
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
        case 'addtodocat':

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
    let options = '';

    data.forEach(element => {
        lis += `<li>${element}</li>`;
        options += `<option>${element}</option>`;
    });
    
    //place html into the page
    renderHTML('#myCats', lis);
    renderHTML('#todoCat', options, true);
}

/** 
 * Adds a new category
 */
 function addToDoCat() {
    var todoCat = document.querySelector("#todoCatTitle").value;

    //add it to category select and list
    renderHTML('#myCats', `<li>${todoCat}</li>`, true);
    renderHTML('#todoCat', `<option>${todoCat}</option>`, true);

    //add it to json file
    renderToDoData('addtodocat', 'todoCatTitle=' + todoCat);
}

// Run scripts to load data
renderToDoData('todocats');
