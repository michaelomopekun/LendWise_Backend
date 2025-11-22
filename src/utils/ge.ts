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