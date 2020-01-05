// Constants that can be changed every year
const UMBC_TUITION = 4352;
const SEMESTER_LENGTH = 16;
const COST_PER_CREDIT = 361;

let totalMoneyLost = 0;

// update information disclosure with up to date stuff
let info = document.getElementById("info");
info.innerHTML = info.innerHTML.replace("{{SEMESTER_LENGTH}}", SEMESTER_LENGTH);
info.innerHTML = info.innerHTML.replace("{{COST_PER_CREDIT}}", COST_PER_CREDIT);

// Update the money lost value whenever something is changed
document.getElementById("numCredits").addEventListener("input", calculateLoss);
document.getElementById("numClassMeetings").addEventListener("input", calculateLoss);
document.getElementById("numSkips").addEventListener("input", calculateLoss);

function addToRunningTotal() {
    // get input values
    let className = document.getElementById("className").value;
    let numCredits = document.getElementById("numCredits").value;
    let numClassMeetings = document.getElementById("numClassMeetings").value;
    let numSkips = document.getElementById("numSkips").value;

    // calculate some stuff
    let totalClassValue = numCredits * COST_PER_CREDIT
    let totalNumClassMeetings = SEMESTER_LENGTH * numClassMeetings;

    // calculate money lost by ratio of number of skipped class to actual classes could attend
    let moneyLost = totalClassValue * (numSkips / totalNumClassMeetings);

    // do not allow user go to above the total number of class meetings
    if (!isNaN(totalNumClassMeetings))
        document.getElementById("numSkips").max = totalNumClassMeetings;

    // if the number calc is valid, positive, and less or eq to total class value
    if (!isNaN(moneyLost) && moneyLost >= 0 && moneyLost <= totalClassValue) {
        document.getElementById("tuitionLost").innerHTML = moneyLost.toLocaleString(undefined, { style: 'currency',minimumFractionDigits: 2, maximumFractionDigits: 2, currency: 'USD' });
    }

    // if the number calc is valid, positive, and less or eq to total class value
    if (!isNaN(moneyLost) && moneyLost >= 0 && moneyLost <= totalClassValue) {
        // add money lost to total money lost to keep track of it
        totalMoneyLost += moneyLost;

        // show the running total list
        document.getElementById("runningTotal").style.display = "";

        // format total money lost and show it
        document.getElementById("totalMoneyLost").innerHTML = totalMoneyLost.toLocaleString(undefined, { style: 'currency',minimumFractionDigits: 2, maximumFractionDigits: 2, currency: 'USD' });

        // create a list item to show the class loss
        let el = document.createElement("LI");
        el.className = "list-group-item";
        el.innerHTML = className + ": -" + moneyLost.toLocaleString(undefined, { style: 'currency', minimumFractionDigits: 2, maximumFractionDigits: 2, currency: 'USD' });
        el.innerHTML += "<button class='btn btn-danger' onclick='removeClassFromTotal(this)'>Remove</button>";
        
        // add class lost li to list
        document.getElementById("runningTotalList").append(el);
    }
}

function removeClassFromTotal(el) {
    let listGroup = el.parentNode.parentNode;

    let test = el.parentNode;
    let cost = test.innerHTML;
    cost = cost.replace(cost.substring(cost.indexOf("<")), "");
    cost = parseFloat(cost.split(": -$")[1]);

    totalMoneyLost -= cost;

    // format total money lost and show it
    document.getElementById("totalMoneyLost").innerHTML = totalMoneyLost.toLocaleString(undefined, { style: 'currency',minimumFractionDigits: 2, maximumFractionDigits: 2, currency: 'USD' });


    listGroup.removeChild(el.parentNode);
}

/**
* Calculate how much money would be lost if you skipped class.
*/
function calculateLoss() {
    // get input values
    let numCredits = document.getElementById("numCredits").value;
    let numClassMeetings = document.getElementById("numClassMeetings").value;
    let numSkips = document.getElementById("numSkips").value;

    // calculate some stuff
    let totalClassValue = numCredits * COST_PER_CREDIT
    let totalNumClassMeetings = SEMESTER_LENGTH * numClassMeetings;

    // calculate money lost by ratio of number of skipped class to actual classes could attend
    let moneyLost = totalClassValue * (numSkips / totalNumClassMeetings);

    // do not allow user go to above the total number of class meetings
    if (!isNaN(totalNumClassMeetings))
        document.getElementById("numSkips").max = totalNumClassMeetings;

    // if the number calc is valid, positive, and less or eq to total class value
    if (!isNaN(moneyLost) && moneyLost >= 0 && moneyLost <= totalClassValue) {
        document.getElementById("tuitionLost").innerHTML = moneyLost.toLocaleString(undefined, { style: 'currency',minimumFractionDigits: 2, maximumFractionDigits: 2, currency: 'USD' });
    }
}