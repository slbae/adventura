const express = require('express');

const app = express();
const PORT = process.env.PORT || 80;

app.use(express.static('static'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

const apiRouter = require('./APIRoutes.js');

// mounted already via /api on the setup
app.use(apiRouter);
// Asking this server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));