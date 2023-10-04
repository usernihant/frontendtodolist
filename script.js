const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const lastActionParagraph = document.getElementById("last-action");
const historyList = document.getElementById("history-list");

let actionHistory = [];

function getCurrentTimestamp() {
    const now = new Date();
    return now.toLocaleString();
}

function addTask() {
    if (inputBox.value == '') {
        alert("You must write something!");
    } else {
        let li = document.createElement("li");
        li.innerHTML = inputBox.value;
        listContainer.appendChild(li);

        let span = document.createElement("span");
        span.innerHTML = "\u00d7";

        li.appendChild(span);
        updateLastAction("Task added: " + inputBox.value);
    }

    inputBox.value = "";
    saveData();
}

listContainer.addEventListener("click", function (e) {
    if (e.target.tagName == "LI") {
        e.target.classList.toggle("checked");
        updateLastAction("Task completed: " + e.target.textContent);
        saveData();
    } else if (e.target.tagName == "SPAN") {
        const removedTask = e.target.parentElement.textContent;
        e.target.parentElement.remove();
        updateLastAction("Task removed: " + removedTask);
        saveData();
    }
}, false);

function updateLastAction(action) {
    const timestamp = getCurrentTimestamp();
    lastActionParagraph.textContent = action + " at " + timestamp;
    addToHistory(action, timestamp);
}

function addToHistory(action, timestamp) {
    actionHistory.push(action + " at " + timestamp);
    refreshHistoryList();
}

function refreshHistoryList() {
    historyList.innerHTML = "";
    actionHistory.forEach((action) => {
        const historyItem = document.createElement("li");
        historyItem.textContent = action;
        historyList.appendChild(historyItem);
    });
}

function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
}

function downloadHistory() {
    const formattedHistory = actionHistory.map((action, index) => {
        return `${index + 1}. ${action}`;
    }).join("\n");

    const blob = new Blob([formattedHistory], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'action_history.txt';
    a.click();
    URL.revokeObjectURL(url);
}


function clearAll() {
    listContainer.innerHTML = "";
    actionHistory = [];
    historyList.innerHTML = "";
    updateLastAction("All tasks cleared");
    saveData();
}



function removeAllTasks() {
    listContainer.innerHTML = ""; // Remove all tasks
    updateLastAction("All tasks removed");
    saveData();
}

function showTask() {
    listContainer.innerHTML = localStorage.getItem("data");
    // History is loaded from localStorage in case you want to persist it
}

let historyVisible = false;

function toggleHistory() {
    const historySection = document.querySelector(".history-section");
    if (historyVisible) {
        historySection.style.display = "none";
    } else {
        historySection.style.display = "block";
    }
    historyVisible = !historyVisible;
}

showTask();
