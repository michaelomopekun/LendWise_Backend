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
}