const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('<h1>Hello, Express.js Server!<h1>');
});

// Include route files
const usersRoute = require('../routes/users');
const productsRoute = require('../routes/products');

// Use routes
app.use('/users', usersRoute);
app.use('/products', productsRoute);

const port = process.env.Port || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})