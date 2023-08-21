require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const port = process.env.PORT || 3001;
const mongoose = require('mongoose');
const morgan = require('morgan');

const authRoutes = require('./routes/auth.routes');
const testRoutes = require('./routes/test.routes');
const questionRoutes = require('./routes/question.routes');
const registrationRoutes = require('./routes/registration.routes')
const asnwerRoutes = require('./routes/answer.routes')

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.static(path.join(__dirname, '../client/build')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Use morgan middleware for logging requests
app.use(morgan('dev'));


// Use the auth route
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/question', questionRoutes)
app.use('/api/registration', registrationRoutes)
app.use('/api/answer', asnwerRoutes)


app.get('/api', (req, res) => {
    res.json({ message: "Hello from server!" });
});


// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

// Connect to MongoDB
mongoose.connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true, useUnifiedTopology: true},
).then(() => {
    console.log('Connected to MongoDB');
    startApp()
})
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });

const startApp = () => {
    app.listen(port, () => {
        console.log('Listening on port ' + port);
    });
}