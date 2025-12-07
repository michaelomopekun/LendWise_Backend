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
        // bank table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS banks (
                id VARCHAR(36) PRIMARY KEY,
                bankName VARCHAR(255) NOT NULL,
                licenseNumber VARCHAR(255) NOT NULL UNIQUE,
                headOfficeAddress VARCHAR(255),
                contactEmail VARCHAR(255),
                contactPhone VARCHAR(255),
                passwordHash VARCHAR(255) NOT NULL,
                dateRegistered DATETIME DEFAULT CURRENT_TIMESTAMP,
                status VARCHAR(255) DEFAULT 'active'
            )        
        `);
        console.log("✓ 'bank' table created or already exists");

        // customer table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS customers (
                id VARCHAR(36) PRIMARY KEY,
                bankId VARCHAR(36) NOT NULL,
                firstName VARCHAR(255) NOT NULL,
                lastName VARCHAR(255) NOT NULL,
                phoneNumber VARCHAR(20),
                email VARCHAR(255) NOT NULL UNIQUE,
                passwordHash VARCHAR(255) NOT NULL,
                income DECIMAL(12, 2),
                occupation VARCHAR(255),
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (bankId) REFERENCES banks(id) ON DELETE CASCADE
            )        
        `);
        console.log("✓ 'customer' table created or already exists");

        // loan_type table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS loan_types (
                id VARCHAR(36) PRIMARY KEY,
                bankId VARCHAR(36) NOT NULL,
                name VARCHAR(255) NOT NULL,
                description VARCHAR(255),
                interestRate DECIMAL(5, 2) NOT NULL,
                minAmount DECIMAL(12, 2) NOT NULL,
                maxAmount DECIMAL(12, 2) NOT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (bankId) REFERENCES banks(id) ON DELETE CASCADE
            ) 
        `);
        console.log("✓ 'loan_type' table created or already exists");

        // loan_officer table
        // await pool.query(`
        //     CREATE TABLE IF NOT EXISTS loan_officers (
        //         id VARCHAR(36) PRIMARY KEY,
        //         bankId VARCHAR(36) NOT NULL,
        //         firstName VARCHAR(255) NOT NULL,
        //         lastName VARCHAR(255) NOT NULL,
        //         email VARCHAR(255) NOT NULL UNIQUE,
        //         passwordHash VARCHAR(255) NOT NULL,
        //         createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        //         updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        //         FOREIGN KEY (bankId) REFERENCES bank(id) ON DELETE CASCADE
        //     )        
        // `);
        // console.log("✓ 'loan_officer' table created or already exists");

        // loan table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS loans (
                id VARCHAR(36) PRIMARY KEY,
                customerId VARCHAR(36) NOT NULL,
                loan_typeId VARCHAR(36) NOT NULL,
                bankId VARCHAR(36) NOT NULL,
                amount DECIMAL(12, 2) NOT NULL,
                interestRate DECIMAL(5, 2) NOT NULL,
                tenureMonth INT NOT NULL,
                applicationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
                approvalDate DATETIME,
                disbursementDate DATETIME,
                status ENUM('pending', 'approved', 'rejected', 'active', 'completed') DEFAULT 'pending',
                outStandingBalance DECIMAL(12, 2) NOT NULL,
                dueDate DATETIME,
                approved_by VARCHAR(36),
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (customerId) REFERENCES customers(id) ON DELETE CASCADE,
                FOREIGN KEY (loan_typeId) REFERENCES loan_types(id) ON DELETE CASCADE,
                FOREIGN KEY (bankId) REFERENCES banks(id) ON DELETE CASCADE,
                FOREIGN KEY (approved_by) REFERENCES banks(id) ON DELETE CASCADE
            )
        `);
        console.log("✓ 'loan' table created or already exists");

        // repayment table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS repayments (
                id VARCHAR(36) PRIMARY KEY,
                loanId VARCHAR(36) NOT NULL,
                amountPaid DECIMAL(12, 2) NOT NULL,
                paymentDate DATETIME DEFAULT CURRENT_TIMESTAMP,
                remainingBalance DECIMAL(12, 2) NOT NULL,
                dueDate DATETIME,
                status ENUM('pending', 'completed', 'overdue') DEFAULT 'pending',
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (loanId) REFERENCES loans(id) ON DELETE CASCADE
            )
        `);
        console.log("✓ 'repayment' table created or already exists");

        // wallet table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS wallets (
                id VARCHAR(36) PRIMARY KEY,
                bankId VARCHAR(36) NOT NULL,
                customer_id VARCHAR(36) NULL,
                wallet_type VARCHAR(255) NOT NULL,
                balance DECIMAL(12, 2) DEFAULT 0,
                date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
                status VARCHAR(255) DEFAULT 'active',
                FOREIGN KEY (bankId) REFERENCES banks(id) ON DELETE CASCADE,
                FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
            )
        `);
        console.log("✓ 'wallet' table created or already exists");

        // wallet_transaction table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS wallet_transactions (
                id VARCHAR(36) PRIMARY KEY,
                wallet_id VARCHAR(36) NOT NULL,
                amount DECIMAL(12, 2) NOT NULL,
                transaction_type VARCHAR(255) NOT NULL,
                reference VARCHAR(255),
                description VARCHAR(255),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE
            )
        `);
        console.log("✓ 'wallet_transaction' table created or already exists");

        console.log("\n============================================================================");
        console.log("=-=-=-=-=-=✓ All tables created successfully=-=-=-=-=-=");
        console.log("============================================================================\n");
    }
    catch (error)
    {
        console.error("✗ Error creating tables:", error);
    }
}