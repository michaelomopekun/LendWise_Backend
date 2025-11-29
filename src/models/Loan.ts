export interface Loan 
{
    id: string;
    customerId: string;
    officerId: string | null;
    loan_typeId: string;
    bankId: string;
    amount: number;
    interestRate: number;
    tenureMonth: number; // in months
    applicationDate: Date;
    approvalDate: Date | null;
    disbursementDate?: Date; // date the loan was funded to the customers wallet
    status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed';
    outStandingBalance: number;
    createdAt: Date;
    updatedAt: Date;
}