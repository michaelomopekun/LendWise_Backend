/**
 * @swagger
 * /api/banks:
 *   get:
 *     summary: Get all banks
 *     description: Retrieve a list of all registered banks in the system. This endpoint is protected and requires bank authentication.
 *     tags:
 *       - Banks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all banks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "550e8400-e29b-41d4-a716-446655440002"
 *                   bankName:
 *                     type: string
 *                     example: "First National Bank"
 *                   licenseNumber:
 *                     type: string
 *                     example: "BNK-2024-001234"
 *                   headOfficeAddress:
 *                     type: string
 *                     example: "123 Banking Street, Lagos, Nigeria"
 *                   contactEmail:
 *                     type: string
 *                     example: "contact@firstnationalbank.com"
 *                   contactPhone:
 *                     type: string
 *                     example: "08012345678"
 *                   dateRegistered:
 *                     type: number
 *                     example: 1701360000000
 *                   status:
 *                     type: string
 *                     example: "active"
 *       401:
 *         description: Unauthorized - No token provided or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No token provided"
 *             examples:
 *               noToken:
 *                 value:
 *                   message: "No token provided"
 *               invalidToken:
 *                 value:
 *                   message: "Invalid token"
 *                   error: {}
 *               unauthorized:
 *                 value:
 *                   message: "Unauthorized"
 *       500:
 *         description: Server error while fetching banks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error fetching banks"
 *                 error:
 *                   type: object
 */

/**
 * @swagger
 * /api/banks/metrics:
 *   get:
 *     summary: Fetch key metrics for bank dashboard
 *     description: Retrieve comprehensive dashboard metrics for a bank including total loan applications, approved loans, rejected loans, pending loans, and the latest 5 loan applications. This endpoint is protected and requires bank authentication. The bankId is automatically extracted from the JWT token.
 *     tags:
 *       - Banks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Key metrics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalLoanApplication:
 *                   type: integer
 *                   description: Total number of loan applications for this bank
 *                   example: 150
 *                 totalLoanApproved:
 *                   type: integer
 *                   description: Total number of approved loans
 *                   example: 85
 *                 totalLoanRejected:
 *                   type: integer
 *                   description: Total number of rejected loans
 *                   example: 25
 *                 totalLoanPending:
 *                   type: integer
 *                   description: Total number of pending loans awaiting approval
 *                   example: 40
 *                 latestLoanApplication:
 *                   type: array
 *                   description: The 5 most recent loan applications with customer and loan type details
 *                   items:
 *                     type: object
 *                     properties:
 *                       amount:
 *                         type: number
 *                         format: decimal
 *                         description: Loan amount requested
 *                         example: 50000.00
 *                       name:
 *                         type: string
 *                         description: Customer name
 *                         example: "John Doe"
 *                       loanTypeName:
 *                         type: string
 *                         description: Name of the loan type
 *                         example: "Personal Loan"
 *                       status:
 *                         type: string
 *                         enum: [pending, approved, rejected, active, completed]
 *                         description: Current status of the loan application
 *                         example: "pending"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp when the loan application was created
 *                         example: "2024-11-30T15:30:00.000Z"
 *       401:
 *         description: Unauthorized - No token provided or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No token provided"
 *             examples:
 *               noToken:
 *                 value:
 *                   message: "No token provided"
 *               invalidToken:
 *                 value:
 *                   message: "Invalid token"
 *                   error: {}
 *               unauthorized:
 *                 value:
 *                   message: "Unauthorized"
 *       500:
 *         description: Server error while fetching key metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error fetching key metrics"
 *                 error:
 *                   type: object
 */

