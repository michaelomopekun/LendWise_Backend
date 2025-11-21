
export interface Customer 
{
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password_hash: string;
    income: number;
    occupation: string;
    createdAt: Date;
    updatedAt: Date;
}