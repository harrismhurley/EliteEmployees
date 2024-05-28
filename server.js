const express = require('express');
const { mainMenu } = require('./menu');
const { pool } = require('./db');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

pool.connect()
    .then(() => {
        console.log('Connected to the company_db database!');
        mainMenu();
    })
    .catch(err => console.error('Connection error', err.stack));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
