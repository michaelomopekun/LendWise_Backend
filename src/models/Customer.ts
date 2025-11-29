
export interface Customer 
{
    id: string;
    bankId: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    passwordHash: string;
    income: number;
    occupation: string;
    createdAt: Date;
    updatedAt: Date;
}