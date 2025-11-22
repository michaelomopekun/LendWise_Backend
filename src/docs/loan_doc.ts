/**
 * @swagger
 * /api/loans/summary:
 *   get:
 *     summary: Get customer loan summary
 *     description: Retrieve a summary of all loans for the authenticated customer including total loans, outstanding balance, and next repayment
 *     tags:
 *       - Loans
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Loan summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Loan summary retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalLoans:
 *                       type: number
 *                       example: 25000
 *                     outstandingBalance:
 *                       type: number
 *                       example: 10000
 *                     nextRepayment:
 *                       type: number
 *                       example: 500
 *       401:
 *         description: Unauthorized - No token provided
 *       500:
 *         description: Could not get loan summary
 */

/**
 * @swagger
 * /api/loans:
 *   get:
 *     summary: Get all loans for customer
 *     description: Retrieve a list of all loans for the authenticated customer with loan details
 *     tags:
 *       - Loans
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Loans retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 loans:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "550e8400-e29b-41d4-a716-446655440010"
 *                       amount:
 *                         type: number
 *                         example: 50000
 *                       tenure_month:
 *                         type: integer
 *                         example: 12
 *                       status:
 *                         type: string
 *                         enum: ['pending', 'approved', 'rejected', 'active', 'completed']
 *                         example: "active"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       loanTypeName:
 *                         type: string
 *                         example: "Personal Loan"
 *                       interestRate:
 *                         type: number
 *                         example: 5.5
 *       404:
 *         description: No loans found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 loans:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: "No loans found"
 *       401:
 *         description: Unauthorized - No token provided
 *       500:
 *         description: Could not get loans
 */

/**
 * @swagger
 * /api/loans/{id}:
 *   get:
 *     summary: Get loan details by ID
 *     description: Retrieve detailed information about a specific loan
 *     tags:
 *       - Loans
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The loan ID (UUID)
 *         example: "550e8400-e29b-41d4-a716-446655440010"
 *     responses:
 *       200:
 *         description: Loan details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 loan:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "550e8400-e29b-41d4-a716-446655440010"
 *                     amount:
 *                       type: number
 *                       example: 50000
 *                     tenure_month:
 *                       type: integer
 *                       example: 12
 *                     status:
 *                       type: string
 *                       enum: ['pending', 'approved', 'rejected', 'active', 'completed']
 *                       example: "active"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     loanTypeName:
 *                       type: string
 *                       example: "Personal Loan"
 *                     interestRate:
 *                       type: number
 *                       example: 5.5
 *       404:
 *         description: Loan not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Loan not found"
 *       401:
 *         description: Unauthorized - No token provided
 *       500:
 *         description: Could not get loan details
 */

/**
 * @swagger
 * /api/loans:
 *   post:
 *     summary: Request a new loan
 *     description: Submit a loan request with specified amount, loan type, and tenure
 *     tags:
 *       - Loans
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - loanTypeId
 *               - amount
 *               - tenureMonth
 *             properties:
 *               loanTypeId:
 *                 type: string
 *                 example: "550e8400-e29b-41d4-a716-446655440100"
 *               amount:
 *                 type: number
 *                 example: 50000
 *               tenureMonth:
 *                 type: integer
 *                 example: 12
 *     responses:
 *       201:
 *         description: Loan request submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Loan request submitted successfully"
 *                 loan:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     customerId:
 *                       type: string
 *                     loanTypeId:
 *                       type: string
 *                     amount:
 *                       type: number
 *                     interestRate:
 *                       type: number
 *                     tenureMonth:
 *                       type: integer
 *                     status:
 *                       type: string
 *                       example: "pending"
 *       400:
 *         description: Invalid input or amount out of range
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Loan type or customer not found
 *       500:
 *         description: Could not request loan
 */