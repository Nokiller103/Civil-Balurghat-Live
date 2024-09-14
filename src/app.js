require('dotenv').config();
const nodemailer = require('nodemailer');
const bodyparser = require('body-parser');
const express = require('express');
const path = require('path');
const JOBS = require('./jobs');
const mustacheExpress = require('mustache-express');

const app = express();

app.use(bodyparser.urlencoded({ extended: true}));

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

// Route to handle job application form submission
app.post('/jobs/:id/apply', (req, res) => {
    const {name, email, phone, address, message} = req.body; // Adjust based on your form fields
    
    // Set up Nodemailer
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_ID, // your Gmail account
            pass: process.env.EMAIL_PASSWORD // your Gmail password or App Password
        }
    });
    
    const mailOptions = {
        from: email,
        to: process.env.EMAIL_ID,
        subject: `Job Application for Job ID ${req.params.id}`,
        text: `
            Name: ${name}
            Email: ${email}
            Phone: ${phone}
            Address: ${address}
            Message: ${message}
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error sending email');
        } else {
            res.status(200).render('applied');
        }
    });
});

// Route to handle contact form submission
app.post('/submit', (req, res) => {
    const { name, email, phone, address, message } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_ID,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    
    const mailOptions = {
        from: email,
        to: process.env.EMAIL_ID,
        subject: 'Contact Form Submission',
        text: `
            Name: ${name}
            Email: ${email}
            Phone: ${phone}
            Address: ${address}
            Message: ${message}
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error sending email');
        } else {
            res.status(200).render('thankyou');
        }
    });
});

    const port = process.env.PORT || 3000;

    app.listen(port, () => {
        console.log(`Server running on https://localhost:${port}`);
    });