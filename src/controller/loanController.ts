import { dbSetUp } from "../db/database";


export class LoanController
{

    async GetLoanDetails(req: any, res: any)
    {
        try
        {
            const loanId = req.params.id;
            const customerId = req.user.id;

            const pool = await dbSetUp();

            const [loan] = await pool.query(
                `SELECT l.id, l.amount, l.tenure_month, l.status, l.createdAt, lt.name AS loanTypeName, lt.interestRate
                 FROM loans l
                 JOIN loan_types lt ON l.loan_typeId = lt.id
                 WHERE l.id = ? AND l.customerId = ?`,
                [loanId, customerId]
            );

            if (!Array.isArray(loan) || loan.length === 0) 
            {
                return res.status(404).json({ message: 'Loan not found' });
            }

            res.status(200).json({ loan: loan[0] });
        }
        catch (error)
        {
            console.error('GetLoanDetails error:', error);

            res.status(500).json({ message: 'could not get loan details', error: error });
        }
    }



    async LoanSummary(req: any, res: any)
    {
        try
        {
            const customerId = req.user.id;

            const pool = await dbSetUp();

            // Get total loans amount
            const [totalLoans] = await pool.query(
                `SELECT COALESCE(SUM(amount), 0) AS totalLoans
                 FROM loans
                 WHERE customerId = ? AND status IN ('active', 'completed')`,
                [customerId]
            );

            // Get outstanding balance
            const [outstandingBalance] = await pool.query(
                `SELECT COALESCE(SUM(outStandingBalance), 0) AS outstandingBalance
                 FROM loans
                 WHERE customerId = ? AND status = 'active'`,
                [customerId]
            );

            // Get next repayment amount (earliest due date that is pending)
            const [nextRepayment] = await pool.query(
                `SELECT COALESCE(r.amountPaid, 0) AS nextRepaymentAmount
                 FROM repayments r
                 JOIN loans l ON r.loanId = l.id
                 WHERE l.customerId = ? AND r.status = 'pending'
                 ORDER BY r.dueDate ASC
                 LIMIT 1`,
                [customerId]
            );

            const summary = {
                totalLoans: (totalLoans as any)[0]?.totalLoans || 0,
                outstandingBalance: (outstandingBalance as any)[0]?.outstandingBalance || 0,
                nextRepayment: (nextRepayment as any)[0]?.nextRepaymentAmount || 0
            };

            res.status(200).json({
                message: 'Loan summary retrieved successfully',
                data: summary
            });
        }
        catch (error)
        {
            console.error('LoanSummary error:', error);

            res.status(500).json({ message: 'could not get loan summary', error: error });
        }
    }

    async GetAllLoans(req: any, res: any)
    {
        try
        {
            const customerId = req.user.id;

            const pool = await dbSetUp();

            const [loans] = await pool.query(
                `SELECT l.id, l.amount, l.tenure_month, l.status, l.createdAt, lt.name AS loanTypeName, lt.interestRate
                 FROM loans l
                 JOIN loan_types lt ON l.loan_typeId = lt.id
                 WHERE l.customerId = ?`,
                [customerId]
            );

            if (!Array.isArray(loans) || loans.length === 0) 
            {
                return res.status(404).json({ loans: 0, message: 'No loans found' });
            }

            res.status(200).json({ loans: loans });
        }
        catch (error)
        {
            console.error('GetAllLoans error:', error);

            res.status(500).json({ message: 'could not get loans', error: error });
        }
    }
}