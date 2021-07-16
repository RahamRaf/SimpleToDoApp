
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
    let html = '';

    switch (todo) {
        // Get To Do categories
        case 'todocats':
            //console.log(data);
            renderToDoCats(data);
            break;
    }

}

/** 
 * Renders html into page
 * @param string container
 * @param string html code
 */
function renderHTML(container, html) {
    let thecontainer = document.querySelector(container);
    thecontainer.innerHTML = html;
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
        lis += `<li>${element}</li>`;
        options += `<option>${element}</option>`;
    });
    
    //place html into the page
    renderHTML('#myCats', lis);
    renderHTML('#todoCat', options);
}

// Run scripts to load data
renderToDoData('todocats');
