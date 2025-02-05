//! ========== Define ParentNodes DOM ========== //
const time = document.getElementById('time');
const contain = document.getElementById('container');

const main = document.createElement('main');
const menu = document.createElement('ul');
menu.setAttribute('id', 'menu');
main.appendChild(menu);

const footer = document.createElement('footer');
const notify = document.createElement('span');
notify.setAttribute('id', 'complete');
footer.appendChild(notify);


//! ========== Light - Dark Mode ========== //
let body = document.body;
let placeHolder = document.getElementById('task');
placeHolder.classList.add('sun');

let mode = document.getElementById('light-dark-mode');
let lightMode = mode.firstElementChild;
lightMode.setAttribute('mode', 'sun');

mode.addEventListener('click', () => {
    let getMode = lightMode.getAttribute('mode');

    if (getMode === 'sun') {
        lightMode.setAttribute('mode', 'moon');
        body.style.background = "#2F323C";
        placeHolder.style.color = "#FFF";
        notify.style.color = "#FFF";
        placeHolder.classList.replace('sun', 'moon');
    }
    else {
        lightMode.setAttribute('mode', 'sun');
        body.style.background = "#fafafa";
        placeHolder.style.color = "#3ED7B8";
        notify.style.color = "#3ED7B8";
        placeHolder.classList.replace('moon', 'sun');
    }
});


const input = document.getElementById('task');
const button = document.forms.yourTask;
//! ========== Setup database ========== //
let Database = "Database";
let ListTask = "ListTask";
let TimeEstablish = "TimeEstablish";
let TimeCompleteTask = "TimeCompleteTask";
// let History = "History";
let editMode = false, editing;

//* ---------- Name Tasks Database ---------- //
const saveTask = (data) => {
    localStorage.setItem(ListTask, JSON.stringify(data));
};

const loadTask = () => {
    let data = JSON.parse(localStorage.getItem(ListTask));
    data = (data !== null && data !== undefined) ? data : [];
    return data;
};

const addTask = (nameTask) => {
    let data = loadTask();
    data = [...data, nameTask];
    saveTask(data);
};

//* ---------- Properties of Task Database ---------- //
const saveData = (data) => {
    localStorage.setItem(Database, JSON.stringify(data));
};

const loadData = () => {
    let data = JSON.parse(localStorage.getItem(Database));
    data = (data !== null && data !== undefined) ? data : [];
    return data;
};

const addData = (newTask) => {
    let data = loadData();
    data = [...data, newTask];
    saveData(data);
};

//* ---------- Time Establish Database ---------- //
const saveTime = (data) => {
    localStorage.setItem(TimeEstablish, JSON.stringify(data));
};

const loadTime = () => {
    let data = JSON.parse(localStorage.getItem(TimeEstablish));
    data = (data !== null && data !== undefined) ? data : [];
    return data;
};

const addTime = (time) => {
    let data = loadTime();
    data = [...data, time];
    saveTime(data);
};

//* ---------- Time Completed Task Database ---------- //
const saveLastTime = (data) => {
    localStorage.setItem(TimeCompleteTask, JSON.stringify(data));
};

const loadLastTime = () => {
    let data = JSON.parse(localStorage.getItem(TimeCompleteTask));
    data = (data !== null && data !== undefined) ? data : [];
    return data;
};

const addLastTime = (time) => {
    let data = loadLastTime();
    data = [...data, time];
    saveLastTime(data);
};

// * ---------- History Database ---------- //
// const saveInputTask = (data) => {
//     localStorage.setItem(TimeEstablish, JSON.stringify(data));
// };

// const loadInputTask = () => {
//     let data = JSON.parse(localStorage.getItem(TimeEstablish));
//     data = (data !== null && data !== undefined) ? data : [];
//     return data;
// };

// const addInputTask = (task) => {
//     let data = loadTime();
//     data = [...data, task];
//     saveTime(data);
// };


//! ---------- Mark Complete Task ---------- //
const markTaskComplete = (index) => {
    if (editMode === false) {
        let data = loadData();

        if (data[index].isCompleted === "false") {
            data[index].isCompleted = "true";
        }
        else {
            data[index].isCompleted = "false";
        };

        saveData(data);
        render();
    }
};

//! ---------- Delete Task Tool ---------- //
const deleteTask = (index) => {
    if (editMode === false) {
        let accept = confirm("Are you sure to want to delete task?");
        if (accept == true) {
            let data = loadData();
            let task = loadTask();
            let time = loadTime();
            let completed = loadLastTime();

            data.splice(index, 1);
            task.splice(index, 1);
            time.splice(index, 1);
            completed.splice(index, 1);

            saveData(data);
            saveTask(task);
            saveTime(time);
            saveLastTime(completed);
        }
        render();
    }
};

//! ---------- Edit Task Tool ---------- //
const editTask = (index) => {
    if (editing === undefined || editing === null) editing = index;

    if (editing == index) {
        let edit = document.getElementById('addTask');
        let tools = document.querySelectorAll('.action')[index];
        input.setAttribute('index', index);

        let data = loadData();
        let task = loadTask();

        input.value = data[index].task;
        edit.firstElementChild.innerText = "EDIT TASK";
        console.log(edit.firstChild);

        data[index].task = "";
        task[index] = "";
        saveData(data);
        saveTask(task);

        tools.innerHTML = "";

        input.focus();
    }

    editMode = true;
};

//! ---------- Time Complete Task ---------- //
const setupTimeComplete = (index) => {
    if (editMode === false) {
        let data = loadData();
        let timeEstablishTask = loadTime();
        let completedTime = loadLastTime();
        let node, clock;

        /*
        *#1. Trường hợp nhiệm vụ được đánh dấu hoàn thành
            1. Lần đầu hoàn thành nhiệm vụ
                - Cập nhật thời gian hoàn thành
            2. Vẫn là lần đầu hoàn thành nhiệm vụ vì chưa sửa lại trạng thái hoàn thành
                - Tái sử dụng
        *#2. Trường hợp nhiệm vụ chưa được hoàn thành
            1. Vừa mới thêm nhiệm vụ vào danh sách
                - Sửa lại trạng thái từ hoàn thành sang chưa hoàn thành nhiệm vụ
            2. Trường hợp sửa lại trạng thái nhiệm vụ từ hoàn thành sang chưa hoàn thành
                - Cập nhật thời gian bắt đầu nhiệm vụ
                - Reset thời gian hoàn thành nhiệm vụ
        */

        if (data[index].isCompleted === "true") {
            if (completedTime[index] == "0") {
                let timeFinish = Date.now();
                completedTime[index] = timeFinish;
                saveLastTime(completedTime);

                function setTime() {
                    let totalTime = Number(timeFinish) - Number(timeEstablishTask[index]);

                    let days = Math.floor(totalTime / (1000 * 60 * 60 * 24));
                    totalTime -= days * 24 * 60 * 60 * 1000;
                    let hours = Math.floor(totalTime / (1000 * 60 * 60));
                    totalTime -= hours * 60 * 60 * 1000;
                    let minutes = Math.floor(totalTime / (1000 * 60));
                    totalTime -= minutes * 60 * 1000;
                    let seconds = Math.floor(totalTime / 1000);

                    time.innerHTML = `<b>${days}:${hours}:${minutes}:${seconds}</b>`;

                    time.setAttribute('set', "true");
                };

                clock = setInterval(setTime, 1000);
                node = menu.children[index].lastElementChild.children[1];

                node.addEventListener('blur', () => {
                    time.setAttribute('set', "false");
                    clearInterval(clock);
                });
            }
            else {
                let timeFinish = completedTime[index];

                function setTime() {
                    let totalTime = Number(timeFinish) - Number(timeEstablishTask[index]);

                    let days = Math.floor(totalTime / (1000 * 60 * 60 * 24));
                    totalTime -= days * 24 * 60 * 60 * 1000;
                    let hours = Math.floor(totalTime / (1000 * 60 * 60));
                    totalTime -= hours * 60 * 60 * 1000;
                    let minutes = Math.floor(totalTime / (1000 * 60));
                    totalTime -= minutes * 60 * 1000;
                    let seconds = Math.floor(totalTime / 1000);

                    time.innerHTML = `<b>${days}:${hours}:${minutes}:${seconds}</b>`;

                    time.setAttribute('set', "true");
                };

                clock = setInterval(setTime, 1000);
                node = menu.children[index].lastElementChild.children[1];

                node.addEventListener('blur', () => {
                    time.setAttribute('set', "false");
                    clearInterval(clock);
                });
            };
        }
        else {
            if (completedTime[index] == "0") {
                function setTime() {
                    let timeClick = Date.now();
                    let totalTime = Number(timeClick) - Number(timeEstablishTask[index]);

                    let days = Math.floor(totalTime / (1000 * 60 * 60 * 24));
                    totalTime -= days * 24 * 60 * 60 * 1000;
                    let hours = Math.floor(totalTime / (1000 * 60 * 60));
                    totalTime -= hours * 60 * 60 * 1000;
                    let minutes = Math.floor(totalTime / (1000 * 60));
                    totalTime -= minutes * 60 * 1000;
                    let seconds = Math.floor(totalTime / 1000);

                    time.innerHTML = `<b>${days}:${hours}:${minutes}:${seconds}</b>`;

                    time.setAttribute('set', "true");
                };

                clock = setInterval(setTime, 1000);
                node = menu.children[index].lastElementChild.children[1];

                node.addEventListener('blur', () => {
                    time.setAttribute('set', "false");
                    clearInterval(clock);
                });
            }
            else {
                let timeClick = Date.now();
                timeEstablishTask[index] = Number(timeClick) - (Number(completedTime[index]) - Number(timeEstablishTask[index]));
                saveTime(timeEstablishTask);
                completedTime[index] = 0;
                saveLastTime(completedTime);

                function setTime() {
                    timeClick = Date.now();
                    let totalTime = Number(timeClick) - Number(timeEstablishTask[index]);

                    let days = Math.floor(totalTime / (1000 * 60 * 60 * 24));
                    totalTime -= days * 24 * 60 * 60 * 1000;
                    let hours = Math.floor(totalTime / (1000 * 60 * 60));
                    totalTime -= hours * 60 * 60 * 1000;
                    let minutes = Math.floor(totalTime / (1000 * 60));
                    totalTime -= minutes * 60 * 1000;
                    let seconds = Math.floor(totalTime / 1000);

                    time.innerHTML = `<b>${days}:${hours}:${minutes}:${seconds}</b>`;

                    time.setAttribute('set', "true");
                };

                clock = setInterval(setTime, 1000);
                node = menu.children[index].lastElementChild.children[1];

                node.addEventListener('blur', () => {
                    time.setAttribute('set', "false");
                    clearInterval(clock);
                });
            };
        };
    }
};

//! ---------- Render Tasks to HTML ---------- //
const render = () => {
    const loadDatabase = loadData();
    let numberTaskComplete = 0;

    let newMenu = loadDatabase.map((element, index) => {
        if (element.isCompleted === "true") {
            numberTaskComplete++;
        }
        return `
        <li class="taskBox" value=${index} isCompleted=${element.isCompleted}>
            <span onclick="markTaskComplete(${index})">${element.task}</span>
            <div class="action">
                <button id="edit" onclick="editTask(${index})">
                    <svg class="icon edit" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        stroke-width="2.5" stroke="#5C5C5C" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                    </svg>
                </button>
                <button id="notify" onclick="setupTimeComplete(${index})">
                    <svg class="icon notify" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        stroke-width="2.5" stroke="#5C5C5C" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </button>
                <button id="del" onclick="deleteTask(${index})">
                    <svg class="icon del" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        stroke-width="2.5" stroke="#5C5C5C" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                </button>
            </div>
        </li>
        `;
    });

    menu.innerHTML = newMenu.join("");
    contain.appendChild(main);

    if (loadDatabase.length == 0) {
        contain.removeChild(main);
    }
    else {
        contain.appendChild(main);
    }

    if (numberTaskComplete > 1) {
        notify.innerHTML = `Yeah, ${numberTaskComplete} tasks completed!`;
    }
    else {
        notify.innerHTML = `Yeah, ${numberTaskComplete} task completed!`;
    }

    if (numberTaskComplete > 0) {
        contain.appendChild(footer);
    }
    else {
        contain.appendChild(footer);
        contain.removeChild(footer);
    }
};

//! ---------- Submit ---------- //
button.addEventListener('submit', (e) => {
    const menuTask = loadTask();

    if (menuTask.includes(input.value)) {
        alert('This task was existed!');
        e.preventDefault();
    }
    // Edit
    else if (input.value !== "") {
        const index = input.getAttribute('index');
        let edit = document.getElementById('addTask');

        if (index !== undefined && index !== null) {
            let data = loadData();
            let task = loadTask();

            data[index].task = input.value;
            task[index] = input.value;

            saveData(data);
            saveTask(task);

            edit.firstElementChild.innerText = "ADD TASK";

            input.removeAttribute('index');

            editMode = false;
            editing = null;
        }
        // Add task
        else {
            let timeEstablishTask = Date.now();

            const newTask = {
                task: input.value,
                isCompleted: false
            };

            addTask(input.value);
            addData(newTask);
            addTime(timeEstablishTask);
            addLastTime(0);
        };

        render();

        input.value = "";
        e.preventDefault();
    }
    else {
        alert('Please enter your task!');
        e.preventDefault();
    }
});

//* Render Task if at least 1 task exists //
let list = loadData();
if (list.length) {
    render();
};