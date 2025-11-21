
export interface Loan_type
{
    id: number;
    name: string;
    description: string;
    interestRate: number;
    minAmount: number;
    maxAmount: number;
    createdAt: Date;
    updatedAt: Date;
}