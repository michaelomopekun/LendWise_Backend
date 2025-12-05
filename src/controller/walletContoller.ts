import { Request, Response } from 'express';
import { dbSetUp } from '../db/database';


export class WalletController
{

    async GetWallet(req: Request, res: Response)
    {
        try
        {
            const userId = req.user?.id;
            // const { bankId } = req.user?.bankId as any;

            if (!userId)
            {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const pool = await dbSetUp();

            const [wallet] = await pool.query(
                `SELECT id, bankId, customer_id, wallet_type, balance, date_created, status 
                 FROM wallets 
                 WHERE customer_id = ? OR bankId = ?`,
                [userId, userId]
            );

            if (!Array.isArray(wallet) || wallet.length === 0)
            {
                return res.status(404).json({ message: 'Wallet not found' });
            }

            return res.status(200).json(wallet);
        }
        catch (error)
        {
            console.error('GetWallet error:', error);

            res.status(500).json({ message: 'Server error', error: error });
        }
    }


    async GetWalletTransactions(req: Request, res: Response)
    {
        try
        {
            const userId = req.user?.id;

            if (!userId)
            {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const pool = await dbSetUp();

            // Get wallet ID for the authenticated user
            const [userWallet] = await pool.query(
                `SELECT id FROM wallet WHERE customer_id = ? OR bankId = ?`,
                [userId, userId]
            );

            if (!Array.isArray(userWallet) || userWallet.length === 0)
            {
                return res.status(404).json({ message: 'Wallet not found' });
            }

            const walletId = (userWallet as any)[0].id;

            // Get all transactions for this wallet
            const [transactions] = await pool.query(
                `SELECT id, wallet_id, amount, transaction_type, reference, description, created_at
                FROM wallet_transaction
                WHERE wallet_id = ?
                ORDER BY created_at DESC`,
                [walletId]
            );

            if (!Array.isArray(transactions) || transactions.length === 0)
            {
                return res.status(200).json({
                    message: 'No transactions found',
                    transactions: []
                });
            }

            return res.status(200).json({
                message: 'Wallet transactions retrieved successfully',
                transactions: transactions,
                count: (transactions as any).length
            });
        }
        catch (error)
        {
            console.error('GetWalletTransactions error:', error);
            res.status(500).json({ message: 'Server error', error: error });
        }
    }
}