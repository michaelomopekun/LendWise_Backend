export interface Wallet 
{
    id: string;
    bankId: string;
    customer_id: string;
    wallet_type: 'Bank' | 'customer';
    balance: number;
    date_created: Date;
    status: string;
}