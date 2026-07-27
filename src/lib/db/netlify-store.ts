/**
 * Netlify Blobs — use the same simple getStore() as setJSON for resources.json.
 * Avoid passing edgeURL without uncachedEdgeURL (breaks strong consistency).
 */
export async function getBlobStore(name = "pouma-data") {
  const { getStore } = await import("@netlify/blobs");
  return getStore({ name, consistency: "eventual" });
}
