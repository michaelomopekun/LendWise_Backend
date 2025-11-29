
export interface Bank 
{
    id: string;
    bankName: string;
    licenseNumber: string;
    headOfficeAddress: string;
    contactEmail: string;
    contactPhone: string;
    passwordHash: string;
    dateRegistered: Date;
    status: string;
}