// Generate proper hashes
// import { hashPassword } from './password';

// export async function generateHash() {
//   const password = 'Galaxias2005%%';
//   const hash = await hashPassword(password);
//   console.log(hash); // Use this hash in your INSERT query
// }

// // generateHash();

// import { dbSetUp } from "../db/database";
// import { v4 as uuidv4 } from 'uuid';

// export async function seedLoanTypes() {
//     try {
//         const pool = await dbSetUp();

//         const loanTypes = [
//             { name: 'Personal Loan', description: 'Flexible personal loans for various needs', interestRate: 5.5, minAmount: 10000, maxAmount: 500000 },
//             { name: 'Home Loan', description: 'Mortgage loans for home purchase and renovation', interestRate: 4.5, minAmount: 500000, maxAmount: 5000000 },
//             { name: 'Auto Loan', description: 'Vehicle financing for cars and motorcycles', interestRate: 6.5, minAmount: 50000, maxAmount: 2000000 },
//             { name: 'Education Loan', description: 'Student loans for higher education and training', interestRate: 5.0, minAmount: 100000, maxAmount: 1000000 },
//             { name: 'Business Loan', description: 'Business financing for startups and expansion', interestRate: 7.5, minAmount: 200000, maxAmount: 3000000 }
//         ];

//         for (const loanType of loanTypes) {
//             const id = uuidv4();
//             await pool.query(
//                 `INSERT INTO loan_types (id, name, description, interestRate, minAmount, maxAmount) 
//                  VALUES (?, ?, ?, ?, ?, ?)`,
//                 [id, loanType.name, loanType.description, loanType.interestRate, loanType.minAmount, loanType.maxAmount]
//             );
//         }

//         console.log("✓ Loan types seeded successfully");
//     } catch (error) {
//         console.error("✗ Failed to seed loan types:", error);
//     }
// }

// import { dbSetUp } from "../db/database";
// import { v4 as uuidv4 } from 'uuid';

// export async function seedLoans() {
//     try {
//         const pool = await dbSetUp();

//         // Get a customer ID (replace with actual customer ID from your database)
//         const [customers] = await pool.query(
//             'SELECT id FROM customers LIMIT 1'
//         );

//         if (!Array.isArray(customers) || customers.length === 0) {
//             console.error("✗ No customers found. Please create a customer first.");
//             return;
//         }

//         const customerId = "0886641e-e5b1-4e43-9b73-76076b621c64";

//         // Get loan type IDs
//         const [loanTypes] = await pool.query(
//             'SELECT id, name FROM loan_types'
//         );

//         if (!Array.isArray(loanTypes) || loanTypes.length < 4) {
//             console.error("✗ Not enough loan types. Please seed loan types first.");
//             return;
//         }

//         const loans = [
//             {
//                 loanTypeId: (loanTypes as any)[0].id,
//                 amount: 50000,
//                 interestRate: 5.5,
//                 tenureMonth: 12,
//                 outStandingBalance: 25000
//             },
//             {
//                 loanTypeId: (loanTypes as any)[1].id,
//                 amount: 500000,
//                 interestRate: 4.5,
//                 tenureMonth: 24,
//                 outStandingBalance: 400000
//             },
//             {
//                 loanTypeId: (loanTypes as any)[2].id,
//                 amount: 200000,
//                 interestRate: 6.5,
//                 tenureMonth: 18,
//                 outStandingBalance: 150000
//             },
//             {
//                 loanTypeId: (loanTypes as any)[3].id,
//                 amount: 300000,
//                 interestRate: 7.5,
//                 tenureMonth: 36,
//                 outStandingBalance: 200000
//             }
//         ];

//         for (const loan of loans) {
//             const loanId = uuidv4();
//             await pool.query(
//                 `INSERT INTO loans (id, customerId, loan_typeId, amount, interestRate, tenureMonth, status, outStandingBalance, applicationDate, approvalDate)
//                  VALUES (?, ?, ?, ?, ?, ?, 'active', ?, NOW(), NOW())`,
//                 [loanId, customerId, loan.loanTypeId, loan.amount, loan.interestRate, loan.tenureMonth, loan.outStandingBalance]
//             );
//         }

//         console.log("✓ 4 Active loans seeded successfully for customer:", customerId);
//     } catch (error) {
//         console.error("✗ Failed to seed loans:", error);
//     }
// }