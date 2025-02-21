function saveList(tasks){
    localStorage.setItem('list', JSON.stringify(tasks));
}

function getList(){
    const tasks = localStorage.getItem('list');
    let taskslist = JSON.parse(tasks);
    return taskslist;
}

function clear(){
    localStorage.setItem('list', JSON.stringify({}));
}

let list=getList()||{};

const prompt=(e)=>{
    e.target.classList.add("hide");
    e.target.nextElementSibling.classList.remove("hide");
    let clear=e.target.nextElementSibling.nextElementSibling;
    if(clear!=null){
        clear.classList.add("hide");
    }
    
    e.target.nextElementSibling.firstElementChild.focus();
}

const cancelPrompt=(e)=>{
    let elToHide=e.target.parentElement;
    elToHide.firstElementChild.value=null;
    elToHide.classList.add("hide");
    elToHide.previousElementSibling.classList.remove("hide");
    let clear=elToHide.nextElementSibling;
    if(clear!=null){
        clear.classList.remove("hide");
    }
}

function createCat(catName){
    let cat=document.createElement("div");
    cat.classList.add("category");

    cat.innerHTML=`
    <div class="heading">${catName}</div>
    <div class="listOfTasks"></div>
        <div class="newTaskGen">
        <button class="newBtn">+ New Task</button>
        <div id="taskBox" class="promt hide">
            <input class="taskEnter" type="text" placeholder="task">
            <button class="add">✔</button>
            <button class="cancel">✘</button>
        </div>
    </div>  `
    
    cat.querySelector(".newBtn").addEventListener("click",prompt);
    cat.querySelector(".cancel").addEventListener("click",cancelPrompt);
    cat.querySelector(".add").addEventListener("click",addTask);
    cat.querySelector(".add").addEventListener("click",cancelPrompt);
     
    return cat;      
}

let index=0;
function createTask(task,catName){
    let li=document.createElement("li");
    li.innerHTML=`
        <input type="checkbox" id= "id${index}">
        <label for="id${index++}">${task}</label>`
    let chbox=li.querySelector("input");
    chbox.addEventListener("click",checked);
    // console.log(`id = ${catName+task}`);
    return li;
}

document.querySelector("#newCatbtn").addEventListener("click",prompt);

document.querySelector("#cancelCat").addEventListener("click",cancelPrompt);

const addCat=(e)=>{
    let catName=e.target.previousElementSibling.value.trim();
    if (catName==""){
        // console.log("yes");
        return;
    }
    if (catName in list){
        alert(`${catName} is already exist`);
        return;
    }
    let container=document.querySelector("#catContainer");

    let cat=createCat(catName);
    container.append(cat);

    list[catName]={};
    saveList(list);
}

const addTask=(e)=>{
    let task=e.target.previousElementSibling.value.trim();
    let listOfTasks=e.target.parentElement.parentElement.previousElementSibling;
    let catName=listOfTasks.previousElementSibling.innerHTML;
    if (task==""){
        // console.log("yes");
        return;
    }
    if (task in list[catName]){
        alert(`${task} is already exist in ${catName}`);
        return;
    }

    let li=createTask(task,catName);
    listOfTasks.append(li);
    list[catName][task]=false;
    saveList(list);
}

document.querySelector("#saveCat").addEventListener("click",addCat);
document.querySelector("#saveCat").addEventListener("click",cancelPrompt);

const render=()=>{
    let taskslist = list;

    let container=document.querySelector("#catContainer");
    container.innerHTML=""

    for(const [category, tasks] of Object.entries(taskslist)){
        let cat=createCat(category);
        container.append(cat); 
        let liContainer=cat.querySelector(".listOfTasks");

        for(const [task, completed] of Object.entries(tasks)){
            // console.log(`${task}: ${completed}`);

            let li=createTask(task,category);
            let chbox=li.querySelector("input");
            if (completed){
                chbox.setAttribute("checked","checked");
                chbox.nextElementSibling.classList.add("completed");
            }
            liContainer.append(li);
        }
    }
}

const checked=(e)=>{
    let box=e.target;
    let catName=box.parentElement.parentElement.previousElementSibling.innerHTML;
    let task=box.nextElementSibling.innerHTML;
    
    if(box.checked){
        box.nextElementSibling.classList.add("completed");
        list[catName][task]=true;
        saveList(list)
    }else{
        box.nextElementSibling.classList.remove("completed");
        list[catName][task]=false;
        saveList(list);
    }
}

const clearCompleted=()=>{
    for(const [category, tasks] of Object.entries(list)){
        for(const [task, completed] of Object.entries(tasks)){
            if (completed){
                delete list[category][task];
            }

        }
    }
    for(const [category, tasks] of Object.entries(list)){
        if (Object.keys(tasks).length==0){
            delete list[category];
        }
    }
    console.log(list);
    saveList(list);
    render();
}

document.querySelector("#clearComp").addEventListener("click",clearCompleted);

render(); //for refresh and at starting