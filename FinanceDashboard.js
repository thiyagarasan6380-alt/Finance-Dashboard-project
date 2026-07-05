let savedName = localStorage.getItem("username")

let username = document.getElementById("nameid");

if (savedName) {
    setUsername(savedName)
}
else {
    let name = prompt("Enter your name:")
    localStorage.setItem("username", name)
    setUsername(name);

}
function setUsername(name) {
    username.innerText = "Welcome," + name;

}

let details = [];
let savedDetails = []

let total = 0;
let income = 0;
let expense = 0;
let maxexpense = 0;
let maxincome = 0;
let average = 0;

let description = document.getElementById("description-id");
let amount = document.getElementById("Amount-id");
let addBtn = document.getElementById("addBtn");
let list = document.getElementById("Recent-list");

let category=document.getElementById("categorylist");

let Balance = document.getElementById("balanceid");
let Income = document.getElementById("incomeid");
let Expense = document.getElementById("expenseid");
let Saving = document.getElementById("savingid");

let Highestincome = document.getElementById("Hincome");
let Highestexpense = document.getElementById("Hexpense");
let NoTransaction = document.getElementById("nooftransaction");

let foodId=document.getElementById("category1");
let travelId=document.getElementById("category2");
let shoppingId=document.getElementById("category3");
let billsId=document.getElementById("category4");
let healthId=document.getElementById("category5");
let othersId=document.getElementById("category6");

let currentMonthText=document.getElementById("currentMonth");
let previousMonthText=document.getElementById("previousMonth");
let differenceMonthText=document.getElementById("difference");
let statusMonthText=document.getElementById("monthStatus");

let themeBtn = document.getElementById("themeBtn");
let expenseChart = document.getElementById("expenseChart");
let ctx = expenseChart.getContext("2d");
let expenseGraph;
let categoryGraph;
console.log(ctx);

// saved Details to load after refresh//

let savedetails = JSON.parse(localStorage.getItem("Details"));
if (savedetails) {
    savedDetails = savedetails;
    details = savedDetails;

    renderTransaction(details);
    statistic();
    categoryStatus();
    monthlyComparison();
};

function statistic() {
    for (let i = 0; i < details.length; i++) {
        let amount = Number(details[i].amount)

        if (amount > maxincome) {
            maxincome = amount;
        }
        if (amount < maxexpense) {
            maxexpense = amount;
        }
    }
    let count = details.length;
    if (count > 0) {
        average = Math.round(total / count);
    }

    Highestincome.innerText = "Highest Income : ₹" + maxincome;
    Highestexpense.innerText = "Highest Expenses : ₹" + Math.abs(maxexpense);
    NoTransaction.innerText = "Total Transaction : " + count;
    averageid.innerText = "Average Transaction : ₹" + average;
}
function categoryStatus() {

    let food = 0;
    let travel = 0;
    let shopping = 0;
    let bills = 0;
    let health = 0;
    let others = 0;

    for (let i = 0; i < details.length; i++) {

        let amount = Number(details[i].amount);
        if (amount >= 0) {
            continue;
        }
        if (details[i].category === "Food") {
            food += Math.abs(amount);
        }
        else if (details[i].category === "Travel") {
            travel += Math.abs(amount);
        }
        else if (details[i].category === "Shopping") {
            shopping += Math.abs(amount);
        }
        else if (details[i].category === "Bills") {
            bills += Math.abs(amount);
        }
        else if (details[i].category === "Health") {
            health += Math.abs(amount);
        }
        else if (details[i].category === "Others") {
            others += Math.abs(amount);
        }
    }

    foodId.innerText = "🍔 Food : ₹" + food;
    travelId.innerText = "✈️ Travel : ₹" + travel;
    shoppingId.innerText = "🛍 Shopping : ₹" + shopping;
    billsId.innerText = "💡 Bills : ₹" + bills;
    healthId.innerText = "🏥 Health : ₹" + health;
    othersId.innerText = "📦 Others : ₹" + others;

    drawCategoryChart(food, travel, shopping, bills, health, others);
}

function renderTransaction(information) {

    information.forEach((t) => {

        let desc = t.description;
        let input = t.amount;
        let num = Number(input);

        let li = document.createElement("li");
        let span1 = document.createElement("span");
        let span2 = document.createElement("span");


        if (num > 0) {
            span1.innerHTML = `<div>
                <strong>${desc}</strong><br>
                <small>${t.timestamp}</small>
            </div>`;
            span2.innerText = "+" + "₹" + input;
            span2.style.color = "lightgreen";
            income = income + num;
        }
        else if (num < 0) {
            span1.innerHTML = `<div>
                <strong>${desc}</strong><br>
                <small>${t.timestamp}</small>
            </div>`;
            span2.innerText = "-" + "₹" + String(Math.abs(input));
            span2.style.color = "red";
            expense = expense + num;
        }

        total = total + num;

        let save;

        if (income > 0) {
            save = Math.round(((income + expense) / income) * 100);
        }
        else {
            save = 0;
        }

        let delBtn = document.createElement("button");
        delBtn.innerText = "Delete";
        delBtn.classList.add("delete-btn");
        delBtn.addEventListener("click", () => {
            let index = details.indexOf(t);

            if (index !== -1) {
                details.splice(index, 1);
            }

            localStorage.setItem("Details", JSON.stringify(details));
            li.remove();


            statistic();
            categoryStatus();
            monthlyComparison();

        })

        let editBtn = document.createElement("button");
        editBtn.innerText = "Edit";
        editBtn.classList.add("edit-btn");
        editBtn.addEventListener("click", () => {
            let newName=prompt("Enter new description:", t.description);
            let newAmount=prompt("Enter new amount:", t.amount);
            if (
                newName === null ||newAmount === null ||newName.trim() === "" ||newAmount.trim() === "" ) {return;}

            t.description=newName;
            t.amount=newAmount;
            localStorage.setItem("Details",JSON.stringify(details));
            location.reload();
            monthlyComparison();
        });

        li.appendChild(span1);
        li.appendChild(span2);
        li.appendChild(editBtn);
        li.appendChild(delBtn);
        list.appendChild(li)

        amount.value = "";
        description.value = "";

        Balance.innerText = "₹" + total;
        Income.innerText = "₹" + income;
        Expense.innerText = "₹" + Math.abs(expense);
        Saving.innerText = save + "%";

    })
};

addBtn.addEventListener("click", (event) => {

    event.preventDefault();
    let desc = description.value;
    let input = amount.value;
    let cat=category.value;
    if (category.value===""){
        alert("Please select a category");
        return;
    }
    let num = Number(input);
    let Transaction = {
        description: desc,
        amount: input,
        category:cat,
        timestamp: new Date().toLocaleString()
    };

    details.push(Transaction);
    localStorage.setItem("Details", JSON.stringify(details));
    let tempdetail = [Transaction];
    renderTransaction(tempdetail);
    statistic();
    categoryStatus();
    monthlyComparison();
});

let clearBtn = document.getElementById("clearBtn");

clearBtn.addEventListener("click", () => {

    let confirmClear = confirm("Are you sure");
    if (!confirmClear) return;
    {
        details = [];

        localStorage.removeItem("Details");

        list.innerHTML = "";

        total = 0;
        income = 0;
        expense = 0;
        maxincome = 0;
        maxexpense = 0;
        average = 0;

        Balance.innerText = "₹0";
        Income.innerText = "₹0";
        Expense.innerText = "₹0";
        Saving.innerText = "0%";

        Highestincome.innerText = "Highest Income : ₹0";
        Highestexpense.innerText = "Highest Expenses : ₹0";
        NoTransaction.innerText = "Total Transaction : 0";
        averageid.innerText = "Average Transaction : ₹0";
        monthlyComparison();

    }
});

let time = document.getElementById("date-id");
setInterval(() => {
    let now = new Date();
    time.innerText = now.toLocaleDateString() + "\n" + now.toLocaleTimeString();

}, 1000);

function monthlyComparison() {

    let currentMonth = new Date().getMonth();
    let previousMonth = currentMonth - 1;

    let currentExpense = 0;
    let previousExpense = 0;

    let difference = 0;
    let percentage = 0;
    let status = "";

    for (let i = 0; i < details.length; i++) {

        let date = new Date(details[i].timestamp);
        let month = date.getMonth();
        let amount = Number(details[i].amount);

        console.log(details[i].timestamp);
        console.log(month);
        console.log(amount);
        console.log(details[i].category);

        if (amount > 0) {
            continue;
        }

        if (month === currentMonth) {
            currentExpense += Math.abs(amount);
        }
        else if (month === previousMonth) {
            previousExpense += Math.abs(amount);
        }
    }

    if (currentExpense < previousExpense) {

        difference = previousExpense - currentExpense;

        if (previousExpense > 0) {
            percentage = Math.round((difference / previousExpense) * 100);
        }

        status = "🟢 Great! Expenses are under control.";

    }
    else if (currentExpense > previousExpense) {

        difference = currentExpense - previousExpense;

        if (previousExpense > 0) {
            percentage = Math.round((difference / previousExpense) * 100);
        }

        status = "🔴 Warning! Expenses increased.";

    }
    else {

        difference = 0;
        percentage = 0;
        status = "🟡 Expenses remained the same.";
    }

    currentMonthText.innerText = "Current Month : ₹" + currentExpense;
    previousMonthText.innerText = "Previous Month : ₹" + previousExpense;
    differenceMonthText.innerText = "Difference : ₹" + difference + " (" + percentage + "%)";
    statusMonthText.innerText = status;

//-----------------------for chart-------------------//
    if (expenseGraph) {
        expenseGraph.destroy();
                        }

        expenseGraph = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Previous Month", "Current Month"],
            datasets: [{
                label: "Expenses (₹)",
                data: [previousExpense, currentExpense],

                backgroundColor: [
                    "#ff4d4d",
                    "#00ff88"
                ],

                borderRadius: 15,
                borderSkipped: false,
                barThickness: 80
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    labels: {
                        color: "white",
                        font: {
                            size: 13
                        }
                    }
                }
            },

            scales: {
                x: {
                    ticks: {
                        color: "white",
                        maxRotation:0,
                        minRotation:0,
                        font: {
                            size: 14
                        }
                    },
                    grid: {
                        display: false
                    }
                },

                y: {
                    beginAtZero: true,
                    ticks: {
                        color: "white",
                        maxRotation:0,
                        minRotation:0,
                    },
                    grid: {
                        color: "rgba(255,255,255,.08)"
                    }
                }
            },
            animation: {
                duration: 1500
            }
        }
        });
        
}
    function drawCategoryChart(food, travel, shopping, bills, health, others){

        if(categoryGraph){
            categoryGraph.destroy();
        }

        const piectx = document.getElementById("categoryChart");

        categoryGraph = new Chart(piectx,{
            type:"pie",

            data:{
                labels:[
                    "Food",
                    "Travel",
                    "Shopping",
                    "Bills",
                    "Health",
                    "Others"
                ],

                datasets:[{
                    data:[
                        food,
                        travel,
                        shopping,
                        bills,
                        health,
                        others
                    ],

                    backgroundColor:[
                        "#00ff99",
                        "#00c8ff",
                        "#ff9800",
                        "#ff5252",
                        "#ba68c8",
                        "#ffd54f"
                    ],

                    borderWidth:3,
                    borderColor:"#08111f",

                    radius: "80%"
                }]
            },

            options:{
                responsive:true,
                maintainAspectRatio:false,

                plugins:{
                    legend: {
                            position: "bottom",
                            labels: {
                                color: "white",
                                font: {
                                    size: 11
                                },
                                boxWidth: 18,
                                padding: 5
                                    }
                            }
                }
            }
        });
    }