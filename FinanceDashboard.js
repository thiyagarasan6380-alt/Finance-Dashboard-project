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

let Balance = document.getElementById("balanceid");
let Income = document.getElementById("incomeid");
let Expense = document.getElementById("expenseid");
let Saving = document.getElementById("savingid");

let Highestincome = document.getElementById("Hincome");
let Highestexpense = document.getElementById("Hexpense");
let NoTransaction = document.getElementById("nooftransaction");

let themeBtn = document.getElementById("themeBtn");

// saved Details to load after refresh//

let savedetails = JSON.parse(localStorage.getItem("Details"));
if (savedetails) {
    savedDetails = savedetails;
    details = savedDetails;

    renderTransaction(details);
    statistic();
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
    let num = Number(input);
    let Transaction = {
        description: desc,
        amount: input,
        timestamp: new Date().toLocaleString()
    };

    details.push(Transaction);
    localStorage.setItem("Details", JSON.stringify(details));
    let tempdetail = [Transaction];
    renderTransaction(tempdetail);
    statistic();
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

    }
});

let time = document.getElementById("date-id");
setInterval(() => {
    let now = new Date();
    time.innerText = now.toLocaleDateString() + "\n" + now.toLocaleTimeString();

}, 1000);