import { Request, Response } from 'express';
import { dbSetUp } from '../db/database';
import { v4 as uuidv4 } from 'uuid';


export class WalletController
{

    async GetWallet(req: Request, res: Response)
    {
        try
        {
            console.log("🔍 GetWallet: Fetching wallet details")

            const userId = req.user?.id;
            const role = req.user?.role;
            const bankId = req.user?.bankId;
            // const { bankId } = req.user?.bankId as any;

            if (!userId)
            {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const pool = await dbSetUp();

            switch(role)
            {
                case "bank":
                    const [bank_wallet] = await pool.query(
                        `SELECT id, bankId, customer_id, wallet_type, balance, date_created, status 
                         FROM wallets 
                         WHERE wallet_type = "bank" AND bankId = ?`,
                        [userId]
                    );

                    if (!Array.isArray(bank_wallet) || bank_wallet.length === 0)
                    {
                        return res.status(404).json({ message: 'bank wallet not found' });
                    }

                    return res.status(200).json(bank_wallet);

                case "customer":
                    const [customer_wallet] = await pool.query(
                        `SELECT id, bankId, customer_id, wallet_type, balance, date_created, status 
                         FROM wallets 
                         WHERE wallet_type = "customer" AND customer_id = ? AND bankId = ?`,
                        [userId, bankId]
                    );

                    if (!Array.isArray(customer_wallet) || customer_wallet.length === 0)
                    {
                        return res.status(404).json({ message: 'customer wallet not found' });
                    }

                    return res.status(200).json(customer_wallet);

                default:
                    return res.status(400).json({ message: 'Invalid user role' });
            }
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
            console.log("🔍 GetWalletTransactions: Fetching wallet transactions")

            const userId = req.user?.id;

            if (!userId)
            {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const pool = await dbSetUp();

            // Get wallet ID for the authenticated user
            const [userWallet] = await pool.query(
                `SELECT id FROM wallets WHERE customer_id = ? OR bankId = ?`,
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
                FROM wallet_transactions
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


    async AddFundToWallet(req: Request, res: Response)
    {
        try
        {
            console.log("🔍 AddFundToWallet: Adding funds to wallet");

            const userId = req.user?.id;
            const role = req.user?.role;
            const { amount, description } = req.body;

            // Validate user is authenticated
            if (!userId)
            {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // Validate required fields
            if (!amount)
            {
                return res.status(400).json({ message: 'Missing required field: amount' });
            }

            // Validate amount is positive
            if (amount <= 0)
            {
                return res.status(400).json({ message: 'Amount must be greater than 0' });
            }

            const pool = await dbSetUp();

            // Get wallet for the authenticated user
            const [userWallet] = await pool.query(
                `SELECT id, balance FROM wallets WHERE wallet_type = ? AND (customer_id = ? OR bankId = ?)`,
                [role, userId, userId]
            );

            if (!Array.isArray(userWallet) || userWallet.length === 0)
            {
                return res.status(404).json({ message: 'Wallet not found' });
            }

            const walletId = (userWallet as any)[0].id;
            const currentBalance = (userWallet as any)[0].balance;
            const newBalance = parseInt(currentBalance) + amount;

            // Update wallet balance
            await pool.query(
                `UPDATE wallets SET balance = ? WHERE id = ?`,
                [newBalance, walletId]
            );

            // Create transaction record
            const transactionId = uuidv4();
            const now = new Date();

            await pool.query(
                `INSERT INTO wallet_transactions (id, wallet_id, amount, transaction_type, reference, description, created_at)
                 VALUES (?, ?, ?, 'credit', ?, ?, ?)`,
                [transactionId, walletId, amount, `FUND-${transactionId.substring(0, 8)}`, description || 'Wallet funding', now]
            );

            res.status(200).json({
                message: 'Funds added to wallet successfully',
                transactionId: transactionId,
                previousBalance: currentBalance,
                amountAdded: amount,
                newBalance: newBalance,
                timestamp: now
            });
        }
        catch (error)
        {
            console.error('AddFundToWallet error:', error);
            res.status(500).json({ message: 'Could not add funds to wallet', error: error });
        }
    }


    async WithdrawFundFromWallet(req: Request, res: Response)
    {
        try
        {
            console.log("🔍 WithdrawFundFromWallet: Withdrawing funds from wallet")

            const userId = req.user?.id;
            const role = req.user?.role;
            const { amount, description } = req.body;

            // Validate user is authenticated
            if (!userId)
            {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // Validate required fields
            if (!amount)
            {
                return res.status(400).json({ message: 'Missing required field: amount' });
            }

            // Validate amount is positive
            if (amount <= 0)
            {
                return res.status(400).json({ message: 'Amount must be greater than 0' });
            }

            const pool = await dbSetUp();

            // Get wallet for the authenticated user
            const [userWallet] = await pool.query(
                `SELECT id, balance FROM wallets WHERE wallet_type = ? AND (customer_id = ? OR bankId = ?)`,
                [role, userId, userId]
            );

            if (!Array.isArray(userWallet) || userWallet.length === 0)
            {
                return res.status(404).json({ message: 'Wallet not found' });
            }

            const walletId = (userWallet as any)[0].id;
            const currentBalance = (userWallet as any)[0].balance;

            // Validate sufficient balance
            if (amount > currentBalance)
            {
                return res.status(400).json({ 
                    message: `Insufficient balance. Available: ${currentBalance}, Requested: ${amount}` 
                });
            }

            const newBalance = currentBalance - amount;

            // Update wallet balance
            await pool.query(
                `UPDATE wallets SET balance = ? WHERE id = ?`,
                [newBalance, walletId]
            );

            // Create transaction record
            const transactionId = uuidv4();
            const now = new Date();

            await pool.query(
                `INSERT INTO wallet_transactions (id, wallet_id, amount, transaction_type, reference, description, created_at)
                VALUES (?, ?, ?, 'debit', ?, ?, ?)`,
                [transactionId, walletId, amount, `WITHDRAW-${transactionId.substring(0, 8)}`, description || 'Wallet withdrawal', now]
            );

            res.status(200).json({
                message: 'Funds withdrawn from wallet successfully',
                transactionId: transactionId,
                previousBalance: currentBalance,
                amountWithdrawn: amount,
                newBalance: newBalance,
                timestamp: now
            });
        }
        catch (error)
        {
            console.error('WithdrawFundFromWallet error:', error);
            res.status(500).json({ message: 'Could not withdraw funds from wallet', error: error });
        }
    }

}