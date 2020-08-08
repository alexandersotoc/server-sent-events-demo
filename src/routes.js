const { Router } = require('express');
const router = Router();

const { getCurrentDate } = require('./utils');

let orders = [];
let globalVersion = 0;

const WWW = './src/pages';

router.get('/', (req, res) => {
    res.sendFile('index.html', { root: WWW });
});

router.get('/customer', (req, res) => {
    res.sendFile('orders-customer.html', { root: WWW });
});

router.post('/sendOrder', (req, res) => {
    orders.push({
        customerName: req.body.customerName,
        price: req.body.price,
    });
    globalVersion++;
    res.redirect('/customer');
});

router.get('/seller', (req, res) => {
    res.sendFile('orders-seller.html', { root: WWW });
});

router.get('/orders', (req, res) => {
    res.status(200).json(orders);
});

router.delete('/orders', (req, res) => {
    orders = [];
    globalVersion = 0;
    res.status(200).json({
        message: 'All orders were deleted'
    });
})

router.get('/sse', (req, res) => {
    console.log(`New connection on ${ getCurrentDate() }`)
    var localVersion = globalVersion;
    res.set("Content-Type", "text/event-stream");
    res.set("Connection", "keep-alive");
    res.set("Cache-Control", "no-cache");
    res.set("Access-Control-Allow-Origin", "*") 
    setInterval(function(){
        if (localVersion < globalVersion) {
            res.status(200).write(`data: ${ JSON.stringify(orders[orders.length - 1]) }\n\n`)
            localVersion = globalVersion;
        }
    }, 1000);
})

router.get('*', (req, res) => {
    res.redirect('/');
});

module.exports = router;