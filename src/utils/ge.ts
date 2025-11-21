// Generate proper hashes
import { hashPassword } from './password';

export async function generateHash() {
  const password = 'Galaxias2005%%';
  const hash = await hashPassword(password);
  console.log(hash); // Use this hash in your INSERT query
}

// generateHash();