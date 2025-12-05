/**
 * @swagger
 * /api/wallet:
 *   get:
 *     summary: Get wallet details
 *     description: Retrieve wallet information for the authenticated user (customer or bank). Returns wallet ID, balance, wallet type, and status.
 *     tags:
 *       - Wallet
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wallet retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Unique wallet ID (UUID)
 *                     example: "550e8400-e29b-41d4-a716-446655440050"
 *                   bankId:
 *                     type: string
 *                     description: Associated bank ID (UUID)
 *                     example: "550e8400-e29b-41d4-a716-446655440001"
 *                   customer_id:
 *                     type: string
 *                     description: Associated customer ID (UUID)
 *                     example: "550e8400-e29b-41d4-a716-446655440010"
 *                   wallet_type:
 *                     type: string
 *                     description: Type of wallet (e.g., 'savings', 'checking', 'loan_repayment')
 *                     example: "loan_repayment"
 *                   balance:
 *                     type: number
 *                     description: Current wallet balance in currency
 *                     example: 50000.50
 *                   date_created:
 *                     type: string
 *                     format: date-time
 *                     description: When the wallet was created
 *                   status:
 *                     type: string
 *                     description: Wallet status
 *                     enum: ['active', 'inactive', 'suspended']
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
 *                   example: "Unauthorized - No token provided"
 *       404:
 *         description: Wallet not found for the authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Wallet not found"
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
 * /api/wallet/transactions:
 *   get:
 *     summary: Get wallet transactions
 *     description: Retrieve transaction history for the authenticated user's wallet. Returns all transactions ordered by date (newest first).
 *     tags:
 *       - Wallet
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wallet transactions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Wallet transactions retrieved successfully"
 *                 transactions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Unique transaction ID
 *                         example: "550e8400-e29b-41d4-a716-446655440060"
 *                       wallet_id:
 *                         type: string
 *                         description: Associated wallet ID
 *                         example: "550e8400-e29b-41d4-a716-446655440050"
 *                       amount:
 *                         type: number
 *                         description: Transaction amount
 *                         example: 5000.00
 *                       transaction_type:
 *                         type: string
 *                         description: Type of transaction
 *                         enum: ['credit', 'debit', 'transfer']
 *                         example: "debit"
 *                       reference:
 *                         type: string
 *                         description: Reference ID for the transaction
 *                         example: "LOAN-001-REPAY"
 *                       description:
 *                         type: string
 *                         description: Transaction description
 *                         example: "Loan repayment for loan ID 550e8400-e29b-41d4-a716-446655440010"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         description: When the transaction was created
 *                 count:
 *                   type: integer
 *                   description: Total number of transactions
 *                   example: 5
 *       401:
 *         description: Unauthorized - No token provided or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       404:
 *         description: Wallet not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Wallet not found"
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
 * /api/wallet/fund:
 *   post:
 *     summary: Add funds to wallet
 *     description: Add funds (credit) to the authenticated user's wallet. Creates a transaction record for the funding.
 *     tags:
 *       - Wallet
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Amount to add to wallet
 *                 example: 50000
 *               description:
 *                 type: string
 *                 description: Optional description for the funding
 *                 example: "Initial wallet setup"
 *     responses:
 *       200:
 *         description: Funds added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Funds added to wallet successfully"
 *                 transactionId:
 *                   type: string
 *                   example: "550e8400-e29b-41d4-a716-446655440060"
 *                 previousBalance:
 *                   type: number
 *                   example: 0
 *                 amountAdded:
 *                   type: number
 *                   example: 50000
 *                 newBalance:
 *                   type: number
 *                   example: 50000
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Amount must be greater than 0"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       404:
 *         description: Wallet not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Wallet not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Could not add funds to wallet"
 */