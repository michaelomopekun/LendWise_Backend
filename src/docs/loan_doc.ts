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
 *                       tenureMonth:
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
 *                     tenureMonth:
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


/**
 * @swagger
 * /api/loans/active:
 *   get:
 *     summary: Get all active loans
 *     description: Retrieve a list of all active loans for the authenticated customer with outstanding balance details
 *     tags:
 *       - Loans
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active loans retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 activeLoans:
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
 *                       outStandingBalance:
 *                         type: number
 *                         example: 10000
 *                       tenureMonth:
 *                         type: integer
 *                         example: 12
 *                       status:
 *                         type: string
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
 *       401:
 *         description: Unauthorized - No token provided
 *       500:
 *         description: Could not retrieve active loans
 */

/**
 * @swagger
 * /api/loans/repay:
 *   post:
 *     summary: Process a loan repayment
 *     description: Make a payment towards an active loan and reduce the outstanding balance
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
 *               - loanId
 *               - amount
 *             properties:
 *               loanId:
 *                 type: string
 *                 description: UUID of the loan to repay
 *                 example: "550e8400-e29b-41d4-a716-446655440010"
 *               amount:
 *                 type: number
 *                 description: Repayment amount
 *                 example: 5000
 *     responses:
 *       200:
 *         description: Loan repayment processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Loan repayment processed successfully"
 *                 newOutstandingBalance:
 *                   type: number
 *                   example: 5000
 *       400:
 *         description: Invalid repayment amount or missing fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Repayment amount must be greater than 0 and less than or equal to outstanding balance"
 *       401:
 *         description: Unauthorized - No token provided
 *       404:
 *         description: Active loan not found
 *       500:
 *         description: Could not process loan repayment
 */

/**
 * @swagger
 * /api/loans/{id}/repayment_history:
 *   get:
 *     summary: Get loan repayment history
 *     description: Retrieve all repayments made for a specific loan ordered by payment date (newest first)
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
 *         description: Repayment history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Repayment history retrieved successfully"
 *                 repaymentHistory:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "550e8400-e29b-41d4-a716-446655440020"
 *                       loanId:
 *                         type: string
 *                         example: "550e8400-e29b-41d4-a716-446655440010"
 *                       amountPaid:
 *                         type: number
 *                         example: 5000
 *                       paymentDate:
 *                         type: string
 *                         format: date-time
 *                       remainingBalance:
 *                         type: number
 *                         example: 20000
 *                       dueDate:
 *                         type: string
 *                         format: date-time
 *                       status:
 *                         type: string
 *                         example: "completed"
 *       400:
 *         description: Missing loan ID parameter
 *       401:
 *         description: Unauthorized - No token provided
 *       404:
 *         description: Loan not found
 *       500:
 *         description: Could not get loan repayment history
 */

/**
 * @swagger
 * /api/loans/types:
 *   get:
 *     summary: Get loan types by bank ID
 *     description: Retrieve all loan types offered by a specific bank including interest rates, minimum and maximum amounts
 *     tags:
 *       - Loan Types
 *     responses:
 *       200:
 *         description: Loan types retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 loanTypes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "550e8400-e29b-41d4-a716-446655440100"
 *                       bankId:
 *                         type: string
 *                         example: "550e8400-e29b-41d4-a716-446655440030"
 *                       name:
 *                         type: string
 *                         example: "Personal Loan"
 *                       interestRate:
 *                         type: number
 *                         example: 5.5
 *                         description: Annual interest rate percentage
 *                       minAmount:
 *                         type: number
 *                         example: 10000
 *                         description: Minimum loan amount
 *                       maxAmount:
 *                         type: number
 *                         example: 500000
 *                         description: Maximum loan amount
 *       500:
 *         description: Could not get loan types
 */

/**
 * @swagger
 * /api/loans/types:
 *   post:
 *     summary: Create a new loan type
 *     description: Create a new loan type for a bank with specified interest rate, amount limits, and description. This endpoint is typically used by banks to define their loan products.
 *     tags:
 *       - Loan Types
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bankId
 *               - name
 *               - interestRate
 *               - minAmount
 *               - maxAmount
 *             properties:
 *               bankId:
 *                 type: string
 *                 description: UUID of the bank offering this loan type
 *                 example: "550e8400-e29b-41d4-a716-446655440030"
 *               name:
 *                 type: string
 *                 description: Name of the loan type
 *                 example: "Personal Loan"
 *               interestRate:
 *                 type: number
 *                 description: Annual interest rate percentage
 *                 example: 5.5
 *                 minimum: 0
 *               description:
 *                 type: string
 *                 description: Detailed description of the loan type
 *                 example: "A flexible personal loan for various needs with competitive interest rates"
 *               minAmount:
 *                 type: number
 *                 description: Minimum loan amount that can be requested
 *                 example: 10000
 *                 minimum: 0
 *               maxAmount:
 *                 type: number
 *                 description: Maximum loan amount that can be requested
 *                 example: 500000
 *                 minimum: 0
 *     responses:
 *       201:
 *         description: Loan type created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Loan type created successfully"
 *                 loanType:
 *                   type: object
 *                   description: Database result object containing information about the created loan type
 *       400:
 *         description: Invalid input - missing required fields or invalid values
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing required fields"
 *       401:
 *         description: Unauthorized - No token provided or invalid token
 *       500:
 *         description: Could not create loan type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "could not create loan type"
 *                 error:
 *                   type: object
 */


/**
 * @swagger
 * /api/banks/loans/pending:
 *   get:
 *     summary: Get all pending loan applications for a bank
 *     description: Retrieve a list of all pending loan applications for the authenticated bank, including customer details and loan type information. The loans are ordered by creation date (oldest first). This endpoint is protected and requires bank authentication. The bankId is automatically extracted from the JWT token.
 *     tags:
 *       - Banks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending loans retrieved successfully or no pending loans found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Pending loans retrieved successfully"
 *                 loans:
 *                   type: array
 *                   description: Array of pending loan applications
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Loan ID (UUID)
 *                         example: "550e8400-e29b-41d4-a716-446655440010"
 *                       amount:
 *                         type: number
 *                         format: decimal
 *                         description: Loan amount requested
 *                         example: 50000.00
 *                       firstName:
 *                         type: string
 *                         description: Customer's first name
 *                         example: "John"
 *                       lastName:
 *                         type: string
 *                         description: Customer's last name
 *                         example: "Doe"
 *                       loanTypeName:
 *                         type: string
 *                         description: Name of the loan type
 *                         example: "Personal Loan"
 *                       status:
 *                         type: string
 *                         enum: [pending]
 *                         description: Status of the loan (always 'pending' for this endpoint)
 *                         example: "pending"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp when the loan application was created
 *                         example: "2024-11-30T15:30:00.000Z"
 *             examples:
 *               withLoans:
 *                 value:
 *                   message: "Pending loans retrieved successfully"
 *                   loans:
 *                     - id: "550e8400-e29b-41d4-a716-446655440010"
 *                       amount: 50000.00
 *                       firstName: "John"
 *                       lastName: "Doe"
 *                       loanTypeName: "Personal Loan"
 *                       status: "pending"
 *                       createdAt: "2024-11-30T15:30:00.000Z"
 *                     - id: "550e8400-e29b-41d4-a716-446655440011"
 *                       amount: 75000.00
 *                       firstName: "Jane"
 *                       lastName: "Smith"
 *                       loanTypeName: "Business Loan"
 *                       status: "pending"
 *                       createdAt: "2024-11-30T16:45:00.000Z"
 *               noLoans:
 *                 value:
 *                   loans: []
 *                   message: "No pending loans found for this bank"
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
 *         description: Server error while fetching pending loans
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "could not get pending loans"
 *                 error:
 *                   type: object
 */

/**
 * @swagger
 * /api/banks/loans/{id}/approve:
 *   put:
 *     summary: Approve a pending loan application
 *     description: Approve a loan application by changing its status from 'pending' to 'approved'. This endpoint is protected and requires bank authentication. The bankId is automatically extracted from the JWT token to ensure banks can only approve loans belonging to them.
 *     tags:
 *       - Banks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The loan ID (UUID) to approve
 *         example: "550e8400-e29b-41d4-a716-446655440010"
 *     responses:
 *       200:
 *         description: Loan approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Loan approved successfully"
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
 *       404:
 *         description: Loan not found or does not belong to this bank
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Loan not found"
 *       500:
 *         description: Server error while approving loan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "could not approve loan"
 *                 error:
 *                   type: object
 */

/**
 * @swagger
 * /api/banks/loans/{id}/reject:
 *   put:
 *     summary: Reject a pending loan application
 *     description: Reject a loan application by changing its status from 'pending' to 'rejected'. This endpoint is protected and requires bank authentication. The bankId is automatically extracted from the JWT token to ensure banks can only reject loans belonging to them.
 *     tags:
 *       - Banks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The loan ID (UUID) to reject
 *         example: "550e8400-e29b-41d4-a716-446655440010"
 *     responses:
 *       200:
 *         description: Loan rejected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Loan rejected successfully"
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
 *       404:
 *         description: Loan not found or does not belong to this bank
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Loan not found"
 *       500:
 *         description: Server error while rejecting loan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "could not reject loan"
 *                 error:
 *                   type: object
 */
