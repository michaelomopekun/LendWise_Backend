import { dbSetUp } from "../db/database";
import { v4 as uuidv4 } from 'uuid';
import { Loan } from "../models/Loan";


export class LoanController
{

    async GetLoanDetails(req: any, res: any)
    {
        try
        {
            const loanId = req.params.id;
            const customerId = req.params.customerId;

            const pool = await dbSetUp();

            const [loan] = await pool.query(
                `SELECT l.id, l.bankId, l.amount, l.tenureMonth, l.status, l.createdAt, lt.name AS loanTypeName, lt.interestRate, l.outstandingBalance, l.customerId
                 FROM loans l
                 JOIN loan_types lt ON l.loan_typeId = lt.id
                 WHERE l.id = ? AND l.customerId = ?`,
                [loanId, customerId]
            );

            if (!Array.isArray(loan) || loan.length === 0) 
            {
                console.log("❌ GetLoanDetails: Loan not found")

                return res.status(404).json({ message: 'Loan not found' });
            }

            console.log("✅ GetLoanDetails: Loan details retrieved successfully")

            res.status(200).json({ loan: loan[0] });
        }
        catch (error)
        {
            console.error('❌ GetLoanDetails error:', error);

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

            // Get next due loan's outstanding balance (earliest dueDate)
            const [nextRepayment] = await pool.query(
                `SELECT COALESCE(l.outStandingBalance, 0) AS nextRepaymentAmount
                FROM loans l
                WHERE l.customerId = ? AND l.status = 'active'
                ORDER BY l.dueDate ASC
                LIMIT 1`,
                [customerId]
            );

            const summary = {
                totalLoans: (totalLoans as any)[0]?.totalLoans || 0,
                outstandingBalance: (outstandingBalance as any)[0]?.outstandingBalance || 0,
                nextRepayment: (nextRepayment as any)[0]?.nextRepaymentAmount || 0
            };

            console.log("✅ LoanSummary: Loan summary retrieved successfully")

            res.status(200).json({
                message: 'Loan summary retrieved successfully',
                data: summary
            });
        }
        catch (error)
        {
            console.error('❌ LoanSummary error:', error);

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
                `SELECT l.id, l.amount, l.tenureMonth, l.status, l.createdAt, lt.name AS loanTypeName, lt.interestRate, l.outStandingBalance, l.dueDate, l.applicationDate
                 FROM loans l
                 JOIN loan_types lt ON l.loan_typeId = lt.id
                 WHERE l.customerId = ?
                 ORDER BY l.createdAt DESC`,
                [customerId]
            );

            if (!Array.isArray(loans) || loans.length === 0) 
            {
                console.log("🪹 GetAllLoans: No loans found")

                return res.status(200).json({ loans: loans });
            }

            console.log("✅ GetAllLoans: Loans retrieved successfully")

            res.status(200).json({ loans: loans });
        }
        catch (error)
        {
            console.error('❌ GetAllLoans error:', error);

            res.status(500).json({ message: 'could not get loans', error: error });
        }
    }

    async RequestLoan(req: any, res: any)
    {
        try
        {
            const customerId = req.user.id;
            const bankId = req.user.bankId;
            const { loan_typeId, amount, tenureMonth }:Loan = req.body;

            // Validate input
            if (!loan_typeId || !amount || !tenureMonth)
            {
                console.log('❌ RequestLoan: Missing required fields: loanTypeId, amount, tenureMonth');

                return res.status(400).json({ 
                    message: 'Missing required fields: loanTypeId, amount, tenureMonth' 
                });
            }

            // Validate amount and tenure are positive
            if (amount <= 0 || tenureMonth <= 0)
            {
                console.log("❌ RequestLoan: Amount and tenure must be greater than 0")

                return res.status(400).json({ 
                    message: 'Amount and tenure must be greater than 0' 
                });
            }

            const pool = await dbSetUp();

            // Get loan type with interest rate
            const [loanType] = await pool.query(
                'SELECT id, bankId, name, interestRate, minAmount, maxAmount FROM loan_types WHERE id = ? AND bankId = ? ',
                [loan_typeId, bankId]
            );

            if (!Array.isArray(loanType) || loanType.length === 0)
            {
                console.log("❌ RequestLoan: Loan type not found")

                return res.status(404).json({ message: 'Loan type not found' });
            }

            const type = (loanType as any)[0];

            // Validate amount is within loan type limits
            if (amount < type.minAmount || amount > type.maxAmount)
            {
                console.log("❌ RequestLoan: Amount must be between minAmount and maxAmount for a loan type")

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
                console.log("❌ RequestLoan: Customer not found")

                return res.status(404).json({ message: 'Customer not found' });
            }

            // Create loan request with interest rate from loan type
            const loanId = uuidv4();
            const outStandingBalance = amount + (amount * (type.interestRate / 100));
            const now = new Date();
            const dueDate = new Date(now);
            dueDate.setMonth(dueDate.getMonth() + tenureMonth);


            await pool.query(
                `INSERT INTO loans (id, customerId, loan_typeId, bankId, amount, interestRate, tenureMonth, status, outStandingBalance, dueDate)
                VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)`,
                [loanId, customerId, loan_typeId, bankId, amount, type.interestRate, tenureMonth, outStandingBalance, dueDate]
            );

            console.log("✅ RequestLoan: Loan request submitted successfully")

            res.status(201).json({
                message: 'Loan request submitted successfully',
                loan: {
                    id: loanId,
                    amount,
                    interestRate: type.interestRate,
                    tenureMonth,
                    dueDate: dueDate,
                    status: 'pending',
                    createdAt: new Date()
                }
            });
        }
        catch (error)
        {
            console.error('❌ RequestLoan error:', error);

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
                `SELECT l.id, l.amount, l.outStandingBalance, l.tenureMonth, l.status, l.createdAt, lt.name AS loanTypeName, lt.interestRate
                    FROM loans l
                    JOIN loan_types lt ON l.loan_typeId = lt.id
                    WHERE l.customerId = ? AND l.status = 'active'`,
                [userId]
            );

            // if (!Array.isArray(activeLoans) || activeLoans.length === 0) 
            // {
            //     return res.status(200).json({ activeLoans: activeLoans });
            // }

            console.log("✅ GetActiveLoans: Active loans retrieved successfully")

            res.status(200).json({ activeLoans: activeLoans });
        }
        catch (error)
        {
            console.error('❌ GetActiveLoans error:', error);

            res.status(500).json({ message: 'could not retrieve active loans', error: error });
        }
    }


    async RepayLoan(req: any, res: any)
    {
        try
        {
            const userId = req.user.id;
            const bankId = req.user.bankId;
            const { loanId, amount } = req.body;

            // Validate input
            if (!loanId || !amount)
            {
                console.log("❌ RepayLoan: Missing required fields: loanId, amount")

                return res.status(400).json({ 
                    message: 'Missing required fields: loanId, amount' 
                });
            }

            // Validate amount is positive
            if (amount <= 0)
            {
                console.log("❌ RepayLoan: Repayment amount must be greater than 0")

                return res.status(400).json({ 
                    message: 'Repayment amount must be greater than 0' 
                });
            }

            const pool = await dbSetUp();

            // Verify loan exists and belongs to customer
            const [loan] = await pool.query(
                'SELECT id, outStandingBalance, tenureMonth FROM loans WHERE id = ? AND customerId = ? AND status = \'active\' AND bankId = ?',
                [loanId, userId, bankId]
            );

            if (!Array.isArray(loan) || loan.length === 0)
            {
                console.log("❌ RepayLoan: Active loan not found")

                return res.status(404).json({ message: 'Active loan not found' });
            }

            const currentLoan = (loan as any)[0];

            // Validate repayment amount
            if (amount > currentLoan.outStandingBalance)
            {
                console.log(`❌ RepayLoan: Repayment amount cannot exceed outstanding balance of ${currentLoan.outStandingBalance}`)

                return res.status(400).json({ 
                    message: `Repayment amount cannot exceed outstanding balance of ${currentLoan.outStandingBalance}` 
                });
            }

            // Calculate new outstanding balance
            const newOutstandingBalance = currentLoan.outStandingBalance - amount;

            // Create repayment record
            const repaymentId = uuidv4();
            const now = new Date();
            const dueDate =  new Date(now)
            dueDate.setMonth(dueDate.getMonth() + currentLoan.tenureMonth);

            await pool.query(
                `INSERT INTO repayments (id, loanId, amountPaid, paymentDate, remainingBalance, dueDate, status)
                VALUES (?, ?, ?, ?, ?, ?, 'completed')`,
                [repaymentId, loanId, amount, now, newOutstandingBalance, dueDate]
            );

            // Update loan outstanding balance
            await pool.query(
                'UPDATE loans SET outStandingBalance = ? WHERE id = ? AND bankId = ?',
                [newOutstandingBalance, loanId, bankId]
            );

            // If outstanding balance is 0, mark loan as completed
            if (newOutstandingBalance === 0)
            {
                await pool.query(
                    'UPDATE loans SET status = \'completed\' WHERE id = ? AND bankId = ?',
                    [loanId, bankId]
                );
            }

            console.log("✅ RepayLoan: Loan repayment processed successfully")

            res.status(200).json({
                message: 'Loan repayment processed successfully',
                repaymentId: repaymentId,
                bankId: bankId,
                amountPaid: amount,
                newOutstandingBalance: newOutstandingBalance,
                loanStatus: newOutstandingBalance === 0 ? 'completed' : 'active'
            });
        }
        catch (error)
        {
            console.error('❌RepayLoan error:', error);

            res.status(500).json({ message: 'could not process loan repayment', error: error });
        }
    }

    async GetLoanRepaymentHistory(req: any, res: any)
    {
        try
        {
            const userId = req.user.id;
            const loanId = req.params.id;
            const bankId = req.user.bankId;

            const pool = await dbSetUp();

            const [loan] = await pool.query(
                'SELECT id FROM loans WHERE id = ? AND customerId = ? AND bankId = ?',
                [loanId, userId, bankId]
            );

            if (!Array.isArray(loan) || loan.length === 0)
            {
                console.log("❌ GetLoanRepaymentHistory: Loan not found")

                return res.status(404).json({ message: 'Loan not found' });
            }

            // Get repayment history
            const [repayments] = await pool.query(
                `SELECT id, loanId, amountPaid, paymentDate, remainingBalance, dueDate, status
                FROM repayments
                WHERE loanId = ?
                ORDER BY paymentDate DESC`,
                [loanId]
            );

            if (!Array.isArray(repayments) || repayments.length === 0)
            {
                console.log("🪹 GetLoanRepaymentHistory: No repayment history found for this loan")

                return res.status(200).json({ 
                    repaymentHistory: [],
                    message: 'No repayment history found for this loan'
                });
            }

            console.log("✅ GetLoanRepaymentHistory: Repayment history retrieved successfully")

            res.status(200).json({
                message: 'Repayment history retrieved successfully',
                repaymentHistory: repayments
            });
            
        }
        catch(error)
        {
            console.error('❌ GetLoanRepaymentHistory error:', error);

            res.status(500).json({ message: 'could not get repayment history', error: error });
        }
    }

    async GetBanksPendingLoan(req: any, res: any)
    {
        try
        {
            const bankId = req.user.bankId;

            const pool = await dbSetUp();

            //join to include customer name and loan type name
            const [loans] = await pool.query(
                'SELECT l.id, l.amount, c.id AS customerId, c.firstName, c.lastName, lt.name AS loanTypeName, l.status, l.createdAt FROM loans l JOIN customers c ON l.customerId = c.id JOIN loan_types lt ON l.loan_typeId = lt.id WHERE l.bankId = ? AND l.status = ? ORDER BY l.createdAt ASC',
                [bankId, 'pending']
            );

            if (!Array.isArray(loans) || loans.length === 0)
            {
                console.log("🪹 GetBanksPendingLoan: No pending loans found for this bank");

                return res.status(200).json({ 
                    loans: [],
                    message: 'No pending loans found for this bank'
                });
            }

            console.log("✅ GetBanksPendingLoan: Pending loans retrieved successfully");

            res.status(200).json({
                message: 'Pending loans retrieved successfully',
                loans: loans
            });
        }
        catch(error)
        {
            console.error('❌ GetBanksPendingLoan error:', error);
            res.status(500).json({ message: 'could not get pending loans', error: error });
        }
    }

    async ApproveLoan(req: any, res: any)
    {
        try
        {
            const loanId = req.params.id;
            const bankId = req.user.bankId;

            const pool = await dbSetUp();

            const [loan] = await pool.query(
                'SELECT id FROM loans WHERE id = ? AND bankId = ?',
                [loanId, bankId]
            );

            if (!Array.isArray(loan) || loan.length === 0)
            {
                console.log("🪹 ApproveLoan: Loan not found");

                return res.status(404).json({ message: 'Loan not found' });
            }

            await pool.query(
                'UPDATE loans SET status = ? WHERE id = ? AND bankId = ?',
                ['active', loanId, bankId]
            );

            console.log("✅ ApproveLoan: Loan approved successfully");

            res.status(200).json({ message: 'Loan approved successfully' });
        }
        catch(error)
        {
            console.error('❌ ApproveLoan error:', error);
            res.status(500).json({ message: 'could not approve loan', error: error });
        }
    }

    async RejectLoan(req: any, res: any)
    {
        try
        {
            const loanId = req.params.id;
            const bankId = req.user.bankId;

            const pool = await dbSetUp();

            const [loan] = await pool.query(
                'SELECT id FROM loans WHERE id = ? AND bankId = ?',
                [loanId, bankId]
            );

            if (!Array.isArray(loan) || loan.length === 0)
            {
                console.log("🪹 RejectLoan: Loan not found");

                return res.status(404).json({ message: 'Loan not found' });
            }

            await pool.query(
                'UPDATE loans SET status = ? WHERE id = ? AND bankId = ?',
                ['rejected', loanId, bankId]
            );

            console.log("✅ RejectLoan: Loan rejected successfully");

            res.status(200).json({ message: 'Loan rejected successfully' });
        }
        catch(error)
        {
            console.error('❌ RejectLoan error:', error);
            res.status(500).json({ message: 'could not reject loan', error: error });
        }
    }
    
}