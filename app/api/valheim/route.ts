export async function GET() {
  const endpoint = process.env.VALHEIM_STATUS_ENDPOINT;
  if (!endpoint) {
    return new Response("Backend URL is not configured", { status: 500 });
  }
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      return new Response("Failed to fetch server data", {
        status: response.status,
      });
    }
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching server data:", error);
    return new Response("An error occurred while fetching server data", {
      status: 500,
    });
  }
}
