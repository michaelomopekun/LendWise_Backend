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
