import { dbSetUp } from "../db/database";


export class CustomerController 
{

    async GetCustomerProfile(req: any, res: any)
    {
        try
        {
            const customerId = req.params.customerId;

            const pool = await dbSetUp();

            const [customer] = await pool.query(
                'SELECT id, firstName, lastName, phoneNumber, email, income, occupation, createdAt, updatedAt FROM customers WHERE id = ?',
                [customerId]
            );

            if (!Array.isArray(customer) || customer.length === 0) 
            {
                return res.status(404).json({ message: 'Customer not found' });
            }

            console.log("✅ GetCustomerProfile: Customer profile retrieved successfully")

            res.status(200).json({ customer: customer[0] });
        }
        catch (error)
        {
            console.error('GetCustomerProfile error:', error);

            res.status(500).json({ message: 'could not get your profile', error: error });
        }
    }
}