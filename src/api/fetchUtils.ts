/**
 * Custom fetch method that handles common logic for fetching data and handling errors.
 * @param {string} url - The URL to fetch data from.
 * @returns {Promise<any>} - The fetched data.
 */
export async function customFetch<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    throw error;
  }
}
