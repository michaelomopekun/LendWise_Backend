export interface Repayment 
{
    Id: number;
    loanId: number;
    amountPaid: number;
    paymentDate: Date;
    remainingBalance: number;
    dueDate: Date;
    status: 'pending' | 'completed' | 'overdue';
    createdAt: Date;
    updatedAt: Date;
}