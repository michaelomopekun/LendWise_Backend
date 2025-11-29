export interface WalletTransaction
{
    id: string;
    wallet_id: string;
    amount: number;
    transaction_type: string;
    reference: string;
    description: string;
    created_at: Date;
}