// Load transactions from localStorage or initialize empty array
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Get DOM elements
const descInput = document.getElementById('desc');
const amountInput = document.getElementById('amount');
const typeSelect = document.getElementById('type');
const addBtn = document.getElementById('addBtn');
const transactionList = document.getElementById('transactionList');
const totalBalance = document.getElementById('totalBalance');
const totalIncome = document.getElementById('totalIncome');
const totalExpense = document.getElementById('totalExpense');

// Add new transaction
addBtn.addEventListener('click', () => {
    const desc = descInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const type = typeSelect.value;

    if(desc === '' || isNaN(amount)) return;

    const transaction = { desc, amount, type };
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    descInput.value = '';
    amountInput.value = '';

    render();
});

// Render transactions and update totals
function render() {
    transactionList.innerHTML = '';
    let income = 0, expense = 0;

    transactions.forEach((t, index) => {
        const li = document.createElement('li');
        li.textContent = `${t.desc}: $${t.amount.toFixed(2)} (${t.type})`;

        // Delete button
        const delBtn = document.createElement('button');
        delBtn.textContent = '🗑';
        delBtn.addEventListener('click', () => {
            transactions.splice(index,1);
            localStorage.setItem('transactions', JSON.stringify(transactions));
            render();
        });
        li.appendChild(delBtn);
        transactionList.appendChild(li);

        if(t.type === 'income') income += t.amount;
        else expense += t.amount;
    });

    totalIncome.textContent = `$${income.toFixed(2)}`;
    totalExpense.textContent = `$${expense.toFixed(2)}`;
    totalBalance.textContent = `$${(income - expense).toFixed(2)}`;

    renderChart();
}

// Render pie chart of expenses
function renderChart() {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    const expenseAmounts = transactions.filter(t => t.type === 'expense').map(t => t.amount);
    const expenseLabels = transactions.filter(t => t.type === 'expense').map(t => t.desc);

    if(window.expenseChart) window.expenseChart.destroy();

    window.expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: expenseLabels,
            datasets: [{
                label: 'Expenses',
                data: expenseAmounts,
                backgroundColor: ['#f87171','#fbbf24','#60a5fa','#34d399','#a78bfa','#f472b6'],
            }]
        }
    });
}


render();
