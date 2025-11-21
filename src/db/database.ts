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

    await createTables(pool);

    return pool;
}

async function createTables(pool: any)
{
    try
    {
        // customers table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS customers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                firstName VARCHAR(100) NOT NULL,
                lastName VARCHAR(100) NOT NULL,
                phoneNumber VARCHAR(20) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                income DECIMAL(12, 2) NOT NULL,
                occupation VARCHAR(100),
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )        
        `);

        console.log("✓ 'customers' table created or already exists");

        // loan_officers table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS loan_officers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                firstName VARCHAR(100) NOT NULL,
                lastName VARCHAR(100) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )        
        `);

        console.log("✓ 'loan_officers' table created or already exists");

        
        // loan_types table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS loan_types (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                interestRate DECIMAL(5, 2) NOT NULL,
                minAmount DECIMAL(12, 2) NOT NULL,
                maxAmount DECIMAL(12, 2) NOT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )            
        `);
                
        console.log("✓ 'loan_types' table created or already exists");

        // loans table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS loans (
                id INT AUTO_INCREMENT PRIMARY KEY,
                customerId INT NOT NULL,
                officerId INT,
                loan_typeId INT NOT NULL,
                amount DECIMAL(12, 2) NOT NULL,
                interestRate DECIMAL(5, 2) NOT NULL,
                tenure_month INT NOT NULL,
                applicationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                approvalDate TIMESTAMP,
                status ENUM('pending', 'approved', 'rejected', 'active', 'completed') DEFAULT 'pending',
                outStandingBalance DECIMAL(12, 2) NOT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (customerId) REFERENCES customers(id) ON DELETE CASCADE,
                FOREIGN KEY (officerId) REFERENCES loan_officers(id) ON DELETE SET NULL,
                FOREIGN KEY (loan_typeId) REFERENCES loan_types(id) ON DELETE CASCADE
            )
        `);

        console.log("✓ 'loans' table created or already exists");

        // repayments table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS repayments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                loanId INT NOT NULL,
                amountPaid DECIMAL(12, 2) NOT NULL,
                paymentDate TIMESTAMP,
                remainingBalance DECIMAL(12, 2) NOT NULL,
                dueDate TIMESTAMP NOT NULL,
                status ENUM('pending', 'approved', 'completed', 'overdue') DEFAULT 'pending',
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (loanId) REFERENCES loans(id) ON DELETE CASCADE
            )
        `);

        console.log("✓ 'repayments' table created or already exists");

        console.log("\n============================================================================");
        console.log("=-=-=-=-=-=✓ All tables exists or has been created successfully-=-=-=-=-=-=");
        console.log("============================================================================\n");
    }
    catch (error)
    {
        console.error("✗ Error creating tables:", error);
    }
} 