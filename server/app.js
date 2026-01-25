const express = require('express');
const session = require('express-session');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDb = require('./db/ConnectDb');
require('dotenv').config();

// Import the separated modules
const passport = require('./config/passport');  // Import passport config
const authRouter = require('./routers/userRouter');  // Import auth routes

const app = express();

// Middleware - EXACT same as before
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 // 1 gün
    }
}));

connectDb();

// Initialize passport (same as before, but imported)
app.use(passport.initialize());
app.use(passport.session());

// Use the auth router (routes are exactly the same, just moved to separate file)
app.use('/api/v1/auth', authRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda işləyir`);
});