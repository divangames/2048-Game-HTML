const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = 3000;
const RECORDS_FILE = path.join(__dirname, 'records.json');

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Загрузка записей из файла
async function loadRecords() {
    try {
        const data = await fs.readFile(RECORDS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

// Сохранение записей в файл
async function saveRecords(records) {
    await fs.writeFile(RECORDS_FILE, JSON.stringify(records, null, 2));
}

// Получение всех записей
app.get('/api/records', async (req, res) => {
    const records = await loadRecords();
    res.json(records);
});

// Добавление новой записи
app.post('/api/records', async (req, res) => {
    const { nickname, score, time, date } = req.body;

    if (!nickname || !score || !time || !date) {
        return res.status(400).send({ error: 'Missing required fields' });
    }

    const newRecord = { nickname, score, time, date };
    let records = await loadRecords();
    records.push(newRecord);
    await saveRecords(records);

    res.status(201).json(newRecord);
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});