const scoreDisplay = document.getElementById('score');
const recordsList = document.getElementById('records-list');
const nicknameInput = document.getElementById('nickname');

async function fetchRecords() {
    const response = await fetch('/api/records');
    const records = await response.json();
    renderRecords(records);
}

function renderRecords(records) {
    recordsList.innerHTML = '';
    records.sort((a, b) => b.score - a.score).forEach(record => {
        const li = document.createElement('li');
        li.textContent = `${record.nickname}: ${record.score} points, Time: ${record.time}, Date: ${record.date}`;
        recordsList.appendChild(li);
    });
}

async function submitRecord() {
    const nickname = nicknameInput.value.trim();
    const score = parseInt(scoreDisplay.textContent, 10);
    if (!nickname || isNaN(score)) {
        alert('Please enter a valid nickname and make sure you have a score.');
        return;
    }
    const { date, time } = getCurrentDateTime();

    const response = await fetch('/api/records', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nickname, score, time, date })
    });

    if (response.ok) {
        nicknameInput.value = '';
        fetchRecords();
    } else {
        alert('Failed to submit the record.');
    }
}

// Fetch records when the page loads
window.onload = fetchRecords;