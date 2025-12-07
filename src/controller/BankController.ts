import { Request, Response } from "express";
import { dbSetUp } from "../db/database";

export class BankController
{
 
    async GetAllBanks(req: Request, res: Response)
    {
        try
        {
            console.log("🔍 GetAllBanks: Fetching all banks")

            const pool = await dbSetUp();
            const [rows] = await pool.query('SELECT id, bankName FROM banks');

            console.log("✅ GetAllBanks: Banks retrieved successfully")

            res.status(200).json(rows);
        }
        catch (error)
        {
            console.log("❌ GetAllBanks: Error fetching banks", error)

            res.status(500).json({ message: 'Error fetching banks' });
        }
    }

    async FetchKeyMetrics(req:Request, res:Response)
    {
        try
        {
            console.log("🔍 FetchKeyMetrics: Fetching key metrics")

            const bankId = req.user?.bankId;

            const pool = await dbSetUp();
            
            // Fetch total Loan Application
            const [totalLoanApplication] = await pool.query(
                'SELECT COUNT(*) AS totalLoanApplication FROM loans WHERE bankId = ?',
                [bankId]
            );

            //Fetch total Loan Approved
            const [totalLoanApproved] = await pool.query(
                'SELECT COUNT(*) AS totalLoanApproved FROM loans WHERE bankId = ? AND status = ?',
                [bankId, 'active']
            );

            //Fetch total Loan Rejected
            const [totalLoanRejected] = await pool.query(
                'SELECT COUNT(*) AS totalLoanRejected FROM loans WHERE bankId = ? AND status = ?',
                [bankId, 'rejected']
            );

            //Fetch total Loan Pending
            const [totalLoanPending] = await pool.query(
                'SELECT COUNT(*) AS totalLoanPending FROM loans WHERE bankId = ? AND status = ?',
                [bankId, 'pending']
            );

            // latest loan application, join with the customer table to get name and loan_type to get loan type name
            const [latestLoanApplication] = await pool.query(
                'SELECT l.amount, c.firstName, c.lastName, lt.name AS loanTypeName, l.status, l.createdAt FROM loans l JOIN customers c ON l.customerId = c.id JOIN loan_types lt ON l.loan_typeId = lt.id WHERE l.bankId = ? ORDER BY l.createdAt DESC LIMIT 5',
                [bankId]
            );

            console.log("✅ FetchKeyMetrics: Key metrics retrieved successfully")

            res.status(200).json({
                totalLoanApplication: (totalLoanApplication as any)[0]?.totalLoanApplication || 0,
                totalLoanApproved: (totalLoanApproved as any)[0]?.totalLoanApproved || 0,
                totalLoanRejected: (totalLoanRejected as any)[0]?.totalLoanRejected || 0,
                totalLoanPending: (totalLoanPending as any)[0]?.totalLoanPending || 0,
                latestLoanApplication: latestLoanApplication
            });
        }
        catch(error)
        {
            console.log("❌ FetchKeyMetrics: Error fetching key metrics", error)

            res.status(500).json({ message: 'Error fetching key metrics'});
        }
    }

}