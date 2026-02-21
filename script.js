let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let editIndex = -1;
let chart;

const form = document.getElementById("expenseForm");
const expenseList = document.getElementById("expenseList");
const filterCategory = document.getElementById("filterCategory");
const totalAmount = document.getElementById("totalAmount");

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("expenseName").value.trim();
    const amount = document.getElementById("expenseAmount").value;
    const category = document.getElementById("expenseCategory").value;
    const date = document.getElementById("expenseDate").value;

    if (name === "" || amount === "" || category === "" || date === "") {
        alert("Please fill all fields properly.");
        return;
    }

    const expense = {
        name: name,
        amount: parseFloat(amount),
        category: category,
        date: date
    };

    if (editIndex === -1) {
        expenses.push(expense);
    } else {
        expenses[editIndex] = expense;
        editIndex = -1;
    }

    saveToLocalStorage();
    form.reset();
    displayExpenses();
});

function saveToLocalStorage() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

function displayExpenses() {
    expenseList.innerHTML = "";
    const selectedCategory = filterCategory.value;
    let total = 0;

    expenses.forEach(function(expense, index) {

        if (selectedCategory !== "All" && expense.category !== selectedCategory) {
            return;
        }

        total += expense.amount;

        const div = document.createElement("div");
        div.className = "expense-item";

        div.innerHTML = `
            <div>
                <strong>${expense.name}</strong><br>
                ₹${expense.amount} | ${expense.category} | ${expense.date}
            </div>
            <div class="actions">
                <button class="edit-btn" onclick="editExpense(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteExpense(${index})">Delete</button>
            </div>
        `;

        expenseList.appendChild(div);
    });

    totalAmount.textContent = total;
    updateChart();
}

function editExpense(index) {
    const expense = expenses[index];

    document.getElementById("expenseName").value = expense.name;
    document.getElementById("expenseAmount").value = expense.amount;
    document.getElementById("expenseCategory").value = expense.category;
    document.getElementById("expenseDate").value = expense.date;

    editIndex = index;
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    saveToLocalStorage();
    displayExpenses();
}

filterCategory.addEventListener("change", displayExpenses);

function updateChart() {

    const categoryTotals = {
        Food: 0,
        Transport: 0,
        Shopping: 0,
        Bills: 0
    };

    expenses.forEach(function(expense) {
        categoryTotals[expense.category] += expense.amount;
    });

    const ctx = document.getElementById("expenseChart").getContext("2d");

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: Object.keys(categoryTotals),
            datasets: [{
                data: Object.values(categoryTotals),
                backgroundColor: [
                    "#ff6384",
                    "#36a2eb",
                    "#ffcd56",
                    "#4bc0c0"
                ]
            }]
        }
    });
}

displayExpenses();