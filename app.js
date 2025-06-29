import express from 'express';
import mysql from 'mysql2'; 
import dotenv from 'dotenv';
import  {router as notes}  from './src/routes/notes.js'; // Import the notes router
import  {router as users}  from './src/routes/users.js'; // Import the notes router

dotenv.config();
const app = express();
app.use(express.json());
app.use(notes); // Use the notes router for API routes
app.use(users); // Use the notes router for API routes


export const pool = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}).promise()



app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
