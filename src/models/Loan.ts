export interface Loan 
{
    id: number;
    customerId: number;
    officerId: number | null;
    loan_typeId: number;
    amount: number;
    interestRate: number;
    tenure_month: number; // in months
    applicationDate: Date;
    approvalDate: Date | null;
    status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed';
    outStandingBalance: number;
    createdAt: Date;
    updatedAt: Date;
}