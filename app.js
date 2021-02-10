// constants that can be changed every year
const UMBC_TUITION = 4352;
const SEMESTER_LENGTH = 16;
const COST_PER_CREDIT = 361;

const tuitionInfoEl = document.getElementById("info");
const numCreditsInput = document.getElementById("numCredits");

let totalMoneyLost = 0;

(function initUI() {
    // update information disclosure with up to date stuff
    tuitionInfoEl.innerHTML = tuitionInfoEl.innerHTML.replace("{{SEMESTER_LENGTH}}", SEMESTER_LENGTH);
    tuitionInfoEl.innerHTML = tuitionInfoEl.innerHTML.replace("{{COST_PER_CREDIT}}", COST_PER_CREDIT);

    // update the money lost value whenever something is changed
    document.getElementById("numCredits").addEventListener("input", calculateLoss);
    document.getElementById("numClassMeetings").addEventListener("input", calculateLoss);
    document.getElementById("numSkips").addEventListener("input", calculateLoss);

    // go through each number input div and add the plus/minus buttons
    [...document.querySelectorAll(".numberInput")]
        .forEach(el => {
            // the number input div should only ever have two children
            const [ input, buttonGroup ] = el.children;

            // create an add to number input button
            createElement(buttonGroup, "span", {
                class: "fa fa-plus",
                style: "color: green; font-size: 1.5em",
                onclick: () => {
                    // get the value from the input element and add one to it
                    input.value = parseInt(input.value, 10) + 1;

                    // re-calculate tuition lost figure
                    calculateLoss();
                }
            });

            // create a subtract from number input button
            createElement(buttonGroup, "span", {
                class: "fa fa-minus",
                style: "color: red; font-size: 1.5em; margin-left: 10px",
                onclick: () => {
                    // get the value from the input element
                    const val = parseInt(input.value, 10);

                    // do not allow negatives
                    if (val !== 0)
                    {
                        // get the value from the numCredits input and subtract one from it
                        input.value = val - 1;

                        // re-calculate tuition lost figure
                        calculateLoss();
                    }
                }
            });
        });   
})();

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

/**
 * Create an HTML element and add it to the DOM tree.
 * @param {HTMLElement} parent 
 * @param {String} tag 
 * @param {Object} attributes 
 */
function createElement(parent, tag, attributes={}) {
    // create the element to whatever tag was given
    const el = document.createElement(tag);
    
    // go through all the attributes in the object that was given
    Object.entries(attributes)
        .forEach(([attr, value]) => {
            // handle the various special cases that will cause the Element to be malformed
            if (attr == "innerText") 
            {
                el.innerText = value;
            }
            else if (attr == "innerHTML") 
            {
                el.innerHTML = value;
            }
            else if (attr == "textContent") 
            {
                el.textContent = value;
            }
            else if (attr == "onclick")
            {
                el.onclick = value;
            }
            else if (attr == "onkeydown")
            {
                el.onkeydown = value;
            }
            else
            {
                el.setAttribute(attr, value);
            }
        });
    
    // add the newly created element to its parent
    parent.appendChild(el);

    // return the element in case this element is a parent for later element creation
    return el;
}