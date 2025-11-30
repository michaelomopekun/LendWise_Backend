/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new customer
 *     description: Create a new customer account with personal and financial information
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - phoneNumber
 *               - password
 *               - income
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               phoneNumber:
 *                 type: string
 *                 example: "08012345678"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "SecurePass123"
 *               income:
 *                 type: number
 *                 example: 500000
 *               occupation:
 *                 type: string
 *                 example: "Software Engineer"
 *     responses:
 *       201:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Registration successful"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "550e8400-e29b-41d4-a716-446655440000"
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing required fields"
 *       409:
 *         description: Email already registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email already registered"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 *                 error:
 *                   type: object
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a customer
 *     description: Authenticate a customer with email and password
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "SecurePass123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "550e8400-e29b-41d4-a716-446655440000"
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                     lastName:
 *                       type: string
 *                       example: "Doe"
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *       400:
 *         description: Email and password required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email and password required"
 *       401:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid email or password"
 *       500:
 *         description: Login failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login failed"
 *                 error:
 *                   type: object
 */


/**
 * @swagger
 * /api/auth/bankRegister:
 *   post:
 *     summary: Register a new bank
 *     description: Create a new bank account with institutional and contact information
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bankName
 *               - licenseNumber
 *               - headOfficeAddress
 *               - contactEmail
 *               - contactPhone
 *               - passwordHash
 *             properties:
 *               bankName:
 *                 type: string
 *                 example: "First National Bank"
 *               licenseNumber:
 *                 type: string
 *                 example: "BNK-2024-001234"
 *               headOfficeAddress:
 *                 type: string
 *                 example: "123 Banking Street, Lagos, Nigeria"
 *               contactEmail:
 *                 type: string
 *                 format: email
 *                 example: "contact@firstnationalbank.com"
 *               contactPhone:
 *                 type: string
 *                 example: "08012345678"
 *               passwordHash:
 *                 type: string
 *                 format: password
 *                 example: "SecureBankPass123"
 *     responses:
 *       201:
 *         description: Bank registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Registration successful"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 bank:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "550e8400-e29b-41d4-a716-446655440002"
 *                     bankName:
 *                       type: string
 *                       example: "First National Bank"
 *                     licenseNumber:
 *                       type: string
 *                       example: "BNK-2024-001234"
 *                     headOfficeAddress:
 *                       type: string
 *                       example: "123 Banking Street, Lagos, Nigeria"
 *                     contactEmail:
 *                       type: string
 *                       example: "contact@firstnationalbank.com"
 *                     contactPhone:
 *                       type: string
 *                       example: "08012345678"
 *                     dateRegistered:
 *                       type: number
 *                       example: 1701360000000
 *                     status:
 *                       type: string
 *                       example: "active"
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing required fields"
 *       409:
 *         description: Email already registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email already registered"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 *                 error:
 *                   type: object
 */

/**
 * @swagger
 * /api/auth/bankLogin:
 *   post:
 *     summary: Login a bank
 *     description: Authenticate a bank with contact email and password
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contactEmail
 *               - passwordHash
 *             properties:
 *               contactEmail:
 *                 type: string
 *                 format: email
 *                 example: "contact@firstnationalbank.com"
 *               passwordHash:
 *                 type: string
 *                 format: password
 *                 example: "SecureBankPass123"
 *     responses:
 *       200:
 *         description: Bank login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "550e8400-e29b-41d4-a716-446655440002"
 *                     bankName:
 *                       type: string
 *                       example: "First National Bank"
 *                     contactEmail:
 *                       type: string
 *                       example: "contact@firstnationalbank.com"
 *                     contactPhone:
 *                       type: string
 *                       example: "08012345678"
 *       400:
 *         description: Email and password required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email and password required"
 *       401:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid email or password"
 *       500:
 *         description: Login failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login failed"
 *                 error:
 *                   type: object
 */