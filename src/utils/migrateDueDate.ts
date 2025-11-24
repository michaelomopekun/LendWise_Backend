import { dbSetUp } from "../db/database";

export async function migrateDueDate() {
    try {
        const pool = await dbSetUp();

        // Step 1: Check if dueDate column exists
        const [columns] = await pool.query(
            `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
             WHERE TABLE_NAME = 'loans' AND COLUMN_NAME = 'dueDate'`
        );

        // Only add column if it doesn't exist
        if ((columns as any).length === 0) {
            await pool.query(
                `ALTER TABLE loans ADD COLUMN dueDate DATETIME AFTER approvalDate`
            );
            console.log("✓ dueDate column added");
        } else {
            console.log("✓ dueDate column already exists");
        }

        // Step 2: Update existing loans to calculate dueDate based on applicationDate + tenure_month
        await pool.query(
            `UPDATE loans 
             SET dueDate = DATE_ADD(applicationDate, INTERVAL tenure_month MONTH)
             WHERE dueDate IS NULL AND applicationDate IS NOT NULL`
        );
        console.log("✓ dueDate populated for existing loans");

        // Step 3: Set dueDate for loans without applicationDate (fallback to createdAt)
        await pool.query(
            `UPDATE loans 
             SET dueDate = DATE_ADD(createdAt, INTERVAL tenure_month MONTH)
             WHERE dueDate IS NULL`
        );
        console.log("✓ Migration completed successfully");

    } catch (error) {
        console.error("✗ Failed to migrate dueDate:", error);
    }
}