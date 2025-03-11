// Initialize global variables
let myLeads = [];

// Get DOM elements
const inputEl = document.getElementById("input-el");
const inputBtn = document.getElementById("input-btn");
const ulEl = document.getElementById("ul-el");
const deleteBtn = document.getElementById("delete-btn");
const tabBtn=document.getElementById("tab-btn")

// Load leads from localStorage (if available)
const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads")) || [];

if (leadsFromLocalStorage.length > 0) {
    myLeads = leadsFromLocalStorage;
    render(myLeads);
}

tabBtn.addEventListener("click", function () {
    if (!chrome.runtime || !chrome.runtime.sendMessage) {
        console.error("Chrome runtime not available!");
        return;
    }

    chrome.runtime.sendMessage({ action: "getActiveTab" }, function (response) {
        if (chrome.runtime.lastError) {
            console.error("Error in sendMessage:", chrome.runtime.lastError.message);
            return;
        }

        if (response && response.url) {
            myLeads.push(response.url);
            localStorage.setItem("myLeads", JSON.stringify(myLeads));
            render(myLeads);
        } else {
            console.warn("No URL received from background script.");
        }
    });
});

// 🎯 Function to render leads in the UI
function render(leads) {
    ulEl.innerHTML = leads
        .map(
            lead => `
            <li>
                <a target="_blank" href="${lead}">
                    ${lead}
                </a>
            </li>
        `
        )
        .join(""); // More efficient than string concatenation
}

// 📌 Event: Save new lead
inputBtn.addEventListener("click", function () {
    const lead = inputEl.value.trim(); // Remove extra spaces

    if (lead) { // Prevent empty values
        myLeads.push(lead);
        inputEl.value = "";
        localStorage.setItem("myLeads", JSON.stringify(myLeads));
        render(myLeads);
    }
});

// 📌 Event: Delete all leads (double-click)
deleteBtn.addEventListener("dblclick", function () {
    localStorage.clear();
    myLeads = [];
    render(myLeads);
});
