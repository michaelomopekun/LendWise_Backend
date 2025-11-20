import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export async function dbSetUp() 
{
    const initialConnection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT || "3306")
    });
    
    try 
    {
        await initialConnection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        console.log(`✓ Database '${process.env.DB_NAME}' created or already exists`);
    } 
    catch (error) 
    {
        console.error("✗ Failed to create database:", error);
    } 
    finally 
    {
        await initialConnection.end();
    }
    
    const pool = await mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: parseInt(process.env.DB_PORT || ""),
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    return pool;
}

// export default dbSetUp();