require('dotenv').config();
const nodemailer = require('nodemailer');
const bodyparser = require('body-parser');
const express = require('express');
const path = require('path');
const JOBS = require('./jobs');
const mustacheExpress = require('mustache-express');

const app = express();

app.use(bodyparser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'pages'));
app.set('view engine', 'mustache');
app.engine('mustache', mustacheExpress());


app.get('/', (req, res) => {
    //res.send('hello world!');
    //res.sendFile(path.join(__dirname, 'pages/index.html'));
    res.render('index', { jobs: JOBS });
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/jobs/:id', (req, res) => {
    const id = req.params.id;
    const matchedJob = JOBS.find(job => job.id.toString() === id);
    res.render('jobs', { job: matchedJob });
})

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Gmail SMTP host
    port: 465, // SMTP port for secure connection
    secure: true,
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD
    }
});

app.post('/jobs/:id/apply', (req, res) => {
    const { name, email, phone, address, message } = req.body;

    const id = req.params.id;
    const matchedJob = JOBS.find(job => job.id.toString() === id);

    const mailOption = {
        From: process.env.EMAIL_ID,
        To: process.env.EMAIL_ID,
        Subject: `new application for ${matchedJob.title}`,
        Html: `<p><strong>name:</strong> ${name}</p>
          <p><strong>email:</strong> ${email}</p>
          <p><strong>phone:</strong> ${phone}</p>
          <p><strong>address:</strong> ${address}</p>
          <p><strong>message:</strong> ${message}</p>`
    };
});

    const port = process.env.PORT || 3000;

    app.listen(port, () => {
        console.log(`Server running on https://localhost:${port}`);
    });