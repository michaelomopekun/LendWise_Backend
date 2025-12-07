import { parse } from 'path';
import { dbSetUp } from '../db/database';
import { v4 as uuidv4 } from 'uuid';

export class WalletService
{
    /**
     * Transfer funds from one wallet to another
     * @param senderId - ID of the user sending funds
     * @param recipientId - ID of the user receiving funds
     * @param amount - Amount to transfer
     * @param description - Description of the transfer
     * @param reference - Reference ID (e.g., loan ID, repayment ID)
     * @returns Transaction details
     */
    async transferFunds( senderId: string, recipientId: string, senderRole: string, recipientRole: string, amount: number, description: string = 'Wallet transfer', reference: string = '')
    {
        try
        {
            const pool = await dbSetUp();

            amount = parseInt(amount as any);

            // Validate amount
            if (amount <= 0)
            {
                throw new Error('Transfer amount must be greater than 0');
            }

            // Get sender's wallet
            const senderWallet = await this.getWalletByUserId(senderId, senderRole);
            if (!senderWallet)
            {
                throw new Error('Sender wallet not found');
            }

            // Validate sender wallet is active
            if (senderWallet.status !== 'active')
            {
                throw new Error('Sender wallet is not active');
            }

            // Validate sufficient balance
            if (senderWallet.balance < amount)
            {
                throw new Error(`Insufficient balance. Available: ${senderWallet.balance}, Required: ${amount}`);
            }

            // Get recipient's wallet
            const recipientWallet = await this.getWalletByUserId(recipientId, recipientRole);
            if (!recipientWallet)
            {
                throw new Error('Recipient wallet not found');
            }

            // Validate recipient wallet is active
            if (recipientWallet.status !== 'active')
            {
                throw new Error('Recipient wallet is not active');
            }

            // Update sender's balance (debit)
            const newSenderBalance = parseInt(senderWallet.balance) - amount;
            await pool.query(
                `UPDATE wallets SET balance = ? WHERE id = ?`,
                [newSenderBalance, senderWallet.id]
            );

            // Update recipient's balance (credit)
            const newRecipientBalance = parseInt(recipientWallet.balance) + amount;
            await pool.query(
                `UPDATE wallets SET balance = ? WHERE id = ?`,
                [newRecipientBalance, recipientWallet.id]
            );

            // Create debit transaction for sender
            const senderTransactionId = uuidv4();
            const now = new Date();
            const transactionRef = reference || `TRANSFER-${senderTransactionId.substring(0, 8)}`;

            await pool.query(
                `INSERT INTO wallet_transactions (id, wallet_id, amount, transaction_type, reference, description, created_at)
                 VALUES (?, ?, ?, 'debit', ?, ?, ?)`,
                [senderTransactionId, senderWallet.id, amount, transactionRef, description, now]
            );

            // Create credit transaction for recipient
            const recipientTransactionId = uuidv4();
            await pool.query(
                `INSERT INTO wallet_transactions (id, wallet_id, amount, transaction_type, reference, description, created_at)
                 VALUES (?, ?, ?, 'credit', ?, ?, ?)`,
                [recipientTransactionId, recipientWallet.id, amount, transactionRef, description, now]
            );

            return {
                success: true,
                senderTransactionId,
                recipientTransactionId,
                reference: transactionRef,
                senderPreviousBalance: senderWallet.balance,
                senderNewBalance: newSenderBalance,
                recipientPreviousBalance: recipientWallet.balance,
                recipientNewBalance: newRecipientBalance,
                amount,
                timestamp: now
            };
        }
        catch (error)
        {
            console.error('Transfer funds error:', error);
            throw error;
        }
    }

    /**
     * Get wallet by user ID (works for both customers and banks)
     * @param userId - User ID (customer or bank)
     * @returns Wallet details or null
     */
    async getWalletByUserId(userId: string, role: string)
    {
        try
        {
            const pool = await dbSetUp();

            const [wallet] = await pool.query(
                `SELECT id, customer_id, bankId, balance, wallet_type, status, date_created
                 FROM wallets
                 WHERE wallet_type = ? AND (customer_id = ? OR bankId = ?)
                 LIMIT 1`,
                [role, userId, userId]
            );

            if (!Array.isArray(wallet) || wallet.length === 0)
            {
                return null;
            }

            return (wallet as any)[0];
        }
        catch (error)
        {
            console.error('Get wallet by user ID error:', error);
            throw error;
        }
    }

    /**
     * Get wallet by ID
     * @param walletId - Wallet ID
     * @returns Wallet details or null
     */
    async getWalletById(walletId: string)
    {
        try
        {
            const pool = await dbSetUp();

            const [wallet] = await pool.query(
                `SELECT id, customer_id, bankId, balance, wallet_type, status, date_created
                 FROM wallets
                 WHERE id = ?`,
                [walletId]
            );

            if (!Array.isArray(wallet) || wallet.length === 0)
            {
                return null;
            }

            return (wallet as any)[0];
        }
        catch (error)
        {
            console.error('Get wallet by ID error:', error);
            throw error;
        }
    }

    // /**
    //  * Validate wallet has sufficient balance
    //  * @param walletId - Wallet ID
    //  * @param amount - Amount to validate
    //  * @returns boolean
    //  */
    // async validateSufficientBalance(walletId: string, amount: number): Promise<boolean>
    // {
    //     try
    //     {
    //         const wallet = await this.getWalletById(walletId);
    //         if (!wallet)
    //         {
    //             return false;
    //         }
    //         return wallet.balance >= amount;
    //     }
    //     catch (error)
    //     {
    //         console.error('Validate sufficient balance error:', error);
    //         return false;
    //     }
    // }

    // /**
    //  * Validate wallet is active
    //  * @param walletId - Wallet ID
    //  * @returns boolean
    //  */
    // async validateWalletActive(walletId: string): Promise<boolean>
    // {
    //     try
    //     {
    //         const wallet = await this.getWalletById(walletId);
    //         if (!wallet)
    //         {
    //             return false;
    //         }
    //         return wallet.status === 'active';
    //     }
    //     catch (error)
    //     {
    //         console.error('Validate wallet active error:', error);
    //         return false;
    //     }
    // }

    // /**
    //  * Get wallet balance
    //  * @param walletId - Wallet ID
    //  * @returns Current balance
    //  */
    // async getWalletBalance(walletId: string): Promise<number>
    // {
    //     try
    //     {
    //         const wallet = await this.getWalletById(walletId);
    //         if (!wallet)
    //         {
    //             throw new Error('Wallet not found');
    //         }
    //         return wallet.balance;
    //     }
    //     catch (error)
    //     {
    //         console.error('Get wallet balance error:', error);
    //         throw error;
    //     }
    // }

    // /**
    //  * Get wallet transactions
    //  * @param walletId - Wallet ID
    //  * @param limit - Number of transactions to retrieve (default: 50)
    //  * @returns Array of transactions
    //  */
    // async getWalletTransactions(walletId: string, limit: number = 50)
    // {
    //     try
    //     {
    //         const pool = await dbSetUp();

    //         const [transactions] = await pool.query(
    //             `SELECT id, wallet_id, amount, transaction_type, reference, description, created_at
    //              FROM wallet_transaction
    //              WHERE wallet_id = ?
    //              ORDER BY created_at DESC
    //              LIMIT ?`,
    //             [walletId, limit]
    //         );

    //         return Array.isArray(transactions) ? transactions : [];
    //     }
    //     catch (error)
    //     {
    //         console.error('Get wallet transactions error:', error);
    //         throw error;
    //     }
    // }
}