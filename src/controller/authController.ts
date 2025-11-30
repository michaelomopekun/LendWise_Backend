import { Request, Response } from 'express';
import {dbSetUp} from '../db/database';
import { v4 as uuidv4 } from 'uuid';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { Bank } from '../models/Bank';


export class AuthController
{

    async Register(req: Request, res: Response)
    {
        try
        {
            const { firstName, lastName, email, phoneNumber, password, income, occupation } = req.body;

            // Validate input
            if (!firstName || !lastName || !email || !phoneNumber || !password || !income) 
            {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            // Check if email already exists
            const pool = await dbSetUp();
            
            const [existingUser] = await pool.query(
                'SELECT id FROM customers WHERE email = ?',
                [email]
            );

            if (Array.isArray(existingUser) && existingUser.length > 0) 
            {
                return res.status(409).json({ message: 'Email already registered' });
            }

            // Hash password
            const hashedPassword = await hashPassword(password);

            //generate user id
            const customerId = uuidv4();

            // Create customer
            const [result] = await pool.query(
                `INSERT INTO customers (id, firstName, lastName, email, phoneNumber, passwordHash, income, occupation) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [customerId, firstName, lastName, email, phoneNumber, hashedPassword, income, occupation || null]
            );


            // Generate token
            const token = generateToken({ id: customerId, email, role: 'customer'});

            res.status(201).json({
                message: 'Registration successful',
                token,
                user: {
                    id: customerId,
                    firstName,
                    lastName,
                    email
                }
            });
        }
        catch (error)
        {
            console.error('Registration error:', error);

            res.status(500).json({ message: 'Server error', error: error });
        }
    }


    async Login(req: Request, res: Response)
    {
        try
        {
            const { email, password } = req.body;

            // Validate input
            if (!email || !password) 
            {
                return res.status(400).json({ message: 'Email and password required' });
            }

            const pool = await dbSetUp();

            // Find customer
            const [customer] = await pool.query(
                'SELECT id, firstName, lastName, email, passwordHash FROM customers WHERE email = ?',
                [email]
            );

            if (!Array.isArray(customer) || customer.length === 0) 
            {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            const user = customer[0] as any;

            // Compare password
            const isPasswordValid = await comparePassword(password, user.passwordHash);

            if (!isPasswordValid) 
            {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            // Generate token
            const token = generateToken({ id: user.id, email: user.email, role: 'customer' });

            res.status(200).json({
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                }
            });
        }
        catch (error)
        {
            console.error('Login error:', error);
            
            res.status(500).json({ message: 'Login failed', error });
        }
    }


    async BankLogin(req: Request, res: Response)
    {
        try
        {
            const { contactEmail, passwordHash } = req.body;

            // Validate input
            if (!contactEmail || !passwordHash) 
            {
                return res.status(400).json({ message: 'Email and password required' });
            }

            const pool = await dbSetUp();

            // Find bank
            const [bank] = await pool.query(
                'SELECT id, bankName, contactEmail, contactPhone, passwordHash FROM banks WHERE contactEmail = ?',
                [contactEmail]
            );

            if (!Array.isArray(bank) || bank.length === 0) 
            {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            const bankData = bank[0] as any;

            // Compare password
            const isPasswordValid = await comparePassword(passwordHash, bankData.passwordHash);

            if (!isPasswordValid) 
            {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            // Generate token
            const token = generateToken({ id: bankData.id, email: bankData.contactEmail, role: 'bank' });

            res.status(200).json({
                message: 'Login successful',
                token,
                bank: {
                    id: bankData.id,
                    bankName: bankData.bankName,
                    contactEmail: bankData.contactEmail,
                    contactPhone: bankData.contactPhone
                }
            });
        }
        catch (error)
        {
            console.error('Login error:', error);
            
            res.status(500).json({ message: 'Login failed', error });
        }
    }


    async RegisterBank(req: Request, res: Response)
    {
        try
        {
            const { bankName, licenseNumber, headOfficeAddress, contactEmail, contactPhone, passwordHash} :Bank = req.body;

            // Validate input
            if (!bankName || !licenseNumber || !headOfficeAddress || !contactEmail || !contactPhone || !passwordHash) 
            {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            // Check if email already exists
            const pool = await dbSetUp();
            
            const [existingUser] = await pool.query(
                'SELECT id FROM banks WHERE contactEmail = ?',
                [contactEmail]
            );

            if (Array.isArray(existingUser) && existingUser.length > 0) 
            {
                return res.status(409).json({ message: 'Email already registered' });
            }

            // Hash password
            const hashedPassword = await hashPassword(passwordHash);

            //generate user id
            const bankId = uuidv4();

            //
            const dateRegistered = Date.now()

            // Create customer
            const [result] = await pool.query(
                `INSERT INTO banks (id, bankName, contactEmail, contactPhone, passwordHash, licenseNumber, headOfficeAddress, status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [bankId, bankName, contactEmail, contactPhone, hashedPassword,licenseNumber, headOfficeAddress, 'active' ]
            );

            // Generate token
            const token = generateToken({ id: bankId, email: contactEmail, role: 'bank'});

            res.status(201).json({
                message: 'Registration successful',
                token,
                bank: {
                    id: bankId,
                    bankName,
                    licenseNumber,
                    headOfficeAddress,
                    contactEmail,
                    contactPhone,
                    dateRegistered,
                    status: 'active'
                }
            });
        }
        catch (error)
        {
            console.error('Registration error:', error);

            res.status(500).json({ message: 'Server error', error: error });
        }
    }
}