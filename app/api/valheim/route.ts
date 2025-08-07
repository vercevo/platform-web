export async function GET() {
  const backendUrl = process.env.NEXT_PUBLIC_VALHEIM_BACKEND_URL;
  if (!backendUrl) {
    return new Response("Backend URL is not configured", { status: 500 });
  }
  try {
    const response = await fetch(backendUrl);
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
    return new Response("An error occurred while fetching server data", {
      status: 500,
    });
  }
}
