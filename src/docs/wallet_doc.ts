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
