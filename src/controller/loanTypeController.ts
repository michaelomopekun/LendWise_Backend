import { dbSetUp } from "../db/database";
import { Loan_type } from "../models/Loan_type";
import { v4 as uuidv4 } from 'uuid';

export class LoanTypeController
{

    async GetLoanTypesByBankId(req: any, res: any)
    {
        try
        {
            console.log("🔍 GetLoanTypesByBankId: Fetching loan types by bank ID")

            const bankId = req.user.bankId;

            const pool = await dbSetUp();

            const [loanTypes] = await pool.query(
                'SELECT id, bankId, name, interestRate, minAmount, maxAmount FROM loan_types WHERE bankId = ?',
                [bankId]
            );

            if (!Array.isArray(loanTypes) || loanTypes.length === 0)
            {
                return res.status(200).json({ loanTypes: loanTypes });
            }

            res.status(200).json({ loanTypes: loanTypes });
        }
        catch (error)
        {
            console.error('GetLoanTypesByBankId error:', error);

            res.status(500).json({ message: 'could not get loan types', error: error });
        }
    }

    async CreateLoanType(req: any, res: any)
    {
        try
        {
            console.log("🔍 CreateLoanType: Creating a new loan type")

            const { bankId, name, interestRate, description, minAmount, maxAmount }: Loan_type = req.body;

            const pool = await dbSetUp();

            const [existingLoanType] = await pool.query(
                'SELECT id FROM loan_types WHERE bankId = ? AND name = ?',
                [bankId, name]
            );

            if (!Array.isArray(existingLoanType) || existingLoanType.length > 0)
            {
                return res.status(400).json({ message: 'Loan type already exists' });
            }

            const uuid = uuidv4();

            const [loanType] = await pool.query(
                'INSERT INTO loan_types (id, bankId, name, interestRate, description, minAmount, maxAmount) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [uuid, bankId, name, interestRate, description, minAmount, maxAmount]
            );

            res.status(201).json({ message: 'Loan type created successfully', loanType: uuid, bankId, name, interestRate, description, minAmount, maxAmount });
        }
        catch (error)
        {
            console.error('CreateLoanType error:', error);

            res.status(500).json({ message: 'could not create loan type', error: error });
        }
    }

}