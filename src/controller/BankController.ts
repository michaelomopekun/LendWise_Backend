import { Request, Response } from "express";
import { dbSetUp } from "../db/database";

export class BankController
{
 
    async GetAllBanks(req: Request, res: Response)
    {
        try
        {
            const pool = await dbSetUp();
            const [rows] = await pool.query('SELECT id, bankName FROM banks');

            res.status(200).json(rows);
        }
        catch (error)
        {
            console.error('Error fetching banks:', error);
            res.status(500).json({ message: 'Error fetching banks', error });
        }
    }

}