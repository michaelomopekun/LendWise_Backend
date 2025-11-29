
export interface Loan_type
{
    id: string;
    bankId: string;
    name: string;
    description: string;
    interestRate: number;
    minAmount: number;
    maxAmount: number;
    createdAt: Date;
    updatedAt: Date;
}