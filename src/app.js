const express = require ('express');
const path = require ('path');

const app = express ();

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname, 'images')));

app.get('/', (req,res) => {
    //res.send('hello world!');
    res.sendFile(path.join(__dirname, 'pages/index.html'));
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on https://localhost:${port}`);
})