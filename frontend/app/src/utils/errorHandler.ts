/**
 * Centralized error logging utility.
 * This function ensures that we always get a useful stack trace in the console
 * for better debugging, regardless of what was thrown.
 *
 * @param error The error object or value that was caught.
 * @param context A string providing context about where the error occurred.
 */
export const logError = (error: unknown, context: string = 'Global'): void => {
    if (error instanceof Error) {
        console.error(`[Error in ${context}]:`, error);
    } else {
        // Handle cases where a non-Error object is thrown
        console.error(`[Error in ${context}]: A non-error was thrown:`, error);
    }
};
