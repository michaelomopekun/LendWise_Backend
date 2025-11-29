export interface Repayment 
{
    id: string;
    loanId: string;
    amountPaid: number;
    paymentDate: Date;
    remainingBalance: number;
    dueDate: Date;
    status: 'pending' | 'completed' | 'overdue';
    createdAt: Date;
    updatedAt: Date;
}