// utils/getCurrentUserId.ts

import { auth } from '@clerk/nextjs';

/**
 * A helper function to get the current user's ID.
 * Returns null if the user is not authenticated.
 */
export async function getCurrentUserId() {
  const { userId } = auth();  // Fetches the userId from Clerk
  
  // If user is authenticated, return the userId, else return null
  return userId || null;
}
