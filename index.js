const express = require('express');
const cors = require('cors');
const app = express();

// use this port variable to map with the PORT variable in the env file.
const port = process.env.PORT || 5000;

// use this command to configure the dotenv file.
require('dotenv').config();

app.use(cors());

app.listen(port, () => {
    console.log(`server is running on ${port}`);
})
