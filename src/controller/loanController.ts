import { dbSetUp } from "../db/database";
import { v4 as uuidv4 } from 'uuid';


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
                return res.status(200).json({ loans: loans });
            }

            res.status(200).json({ loans: loans });
        }
        catch (error)
        {
            console.error('GetAllLoans error:', error);

            res.status(500).json({ message: 'could not get loans', error: error });
        }
    }

    async RequestLoan(req: any, res: any)
    {
        try
        {
            const customerId = req.user.id;
            const { loanTypeId, amount, tenureMonth } = req.body;

            // Validate input
            if (!loanTypeId || !amount || !tenureMonth)
            {
                return res.status(400).json({ 
                    message: 'Missing required fields: loanTypeId, amount, tenureMonth' 
                });
            }

            // Validate amount and tenure are positive
            if (amount <= 0 || tenureMonth <= 0)
            {
                return res.status(400).json({ 
                    message: 'Amount and tenure must be greater than 0' 
                });
            }

            const pool = await dbSetUp();

            // Get loan type with interest rate
            const [loanType] = await pool.query(
                'SELECT id, name, interestRate, minAmount, maxAmount FROM loan_types WHERE id = ?',
                [loanTypeId]
            );

            if (!Array.isArray(loanType) || loanType.length === 0)
            {
                return res.status(404).json({ message: 'Loan type not found' });
            }

            const type = (loanType as any)[0];

            // Validate amount is within loan type limits
            if (amount < type.minAmount || amount > type.maxAmount)
            {
                return res.status(400).json({ 
                    message: `Amount must be between ${type.minAmount} and ${type.maxAmount} for a ${type.name}` 
                });
            }

            // Verify customer exists
            const [customer] = await pool.query(
                'SELECT id FROM customers WHERE id = ?',
                [customerId]
            );

            if (!Array.isArray(customer) || customer.length === 0)
            {
                return res.status(404).json({ message: 'Customer not found' });
            }

            // Create loan request with interest rate from loan type
            const loanId = uuidv4();
            const outStandingBalance = amount + (amount * (type.interestRate / 100));

            await pool.query(
                `INSERT INTO loans (id, customerId, loan_typeId, amount, interestRate, tenure_month, status, outStandingBalance)
                VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)`,
                [loanId, customerId, loanTypeId, amount, type.interestRate, tenureMonth, outStandingBalance]
            );

            res.status(201).json({
                message: 'Loan request submitted successfully',
                loan: {
                    id: loanId,
                    amount,
                    interestRate: type.interestRate,
                    tenureMonth,
                    status: 'pending',
                    createdAt: new Date()
                }
            });
        }
        catch (error)
        {
            console.error('RequestLoan error:', error);

            res.status(500).json({ message: 'could not request loan', error: error });
        }
    }

    async GetActiveLoans(req: any, res: any) 
    {
        try
        {
            const userId = req.user.id;

            const pool = await dbSetUp();

            const [activeLoans] = await pool.query(
                `SELECT l.id, l.amount, l.outStandingBalance, l.tenure_month, l.status, l.createdAt, lt.name AS loanTypeName, lt.interestRate
                    FROM loans l
                    JOIN loan_types lt ON l.loan_typeId = lt.id
                    WHERE l.customerId = ? AND l.status = 'active'`,
                [userId]
            );

            // if (!Array.isArray(activeLoans) || activeLoans.length === 0) 
            // {
            //     return res.status(200).json({ activeLoans: activeLoans });
            // }

            res.status(200).json({ activeLoans: activeLoans });
        }
        catch (error)
        {
            console.error('GetActiveLoans error:', error);

            res.status(500).json({ message: 'could not retrieve active loans', error: error });
        }
    }


    async RepayLoan(req: any, res: any)
    {
        try
        {
            const userId = req.user.id;
            const { loanId, amount } = req.body;

            // Validate input
            if (!loanId || !amount)
            {
                return res.status(400).json({ 
                    message: 'Missing required fields: loanId, amount' 
                });
            }

            const pool = await dbSetUp();

            // Verify loan exists and belongs to user
            const [loan] = await pool.query(
                'SELECT id, outStandingBalance FROM loans WHERE id = ? AND customerId = ? AND status = \'active\'',
                [loanId, userId]
            );

            if (!Array.isArray(loan) || loan.length === 0)
            {
                return res.status(404).json({ message: 'Active loan not found' });
            }

            const currentLoan = (loan as any)[0];

            // Validate repayment amount
            if (amount <= 0 || amount > currentLoan.outStandingBalance)
            {
                return res.status(400).json({ 
                    message: 'Repayment amount must be greater than 0 and less than or equal to outstanding balance' 
                });
            }

            // Process repayment
            const newOutstandingBalance = currentLoan.outStandingBalance - amount;

            await pool.query(
                'UPDATE loans SET outStandingBalance = ? WHERE id = ?',
                [newOutstandingBalance, loanId]
            );

            res.status(200).json({
                message: 'Loan repayment processed successfully',
                newOutstandingBalance: newOutstandingBalance
            });
        }
        catch (error)
        {
            console.error('RepayLoan error:', error);

            res.status(500).json({ message: 'could not process loan repayment', error: error });
        }
    }
    
}