export default async (request, context) => {
  const url = new URL(request.url);
  const client = url.searchParams.get("id") || "unknown_lead";
  
  // This statement streams the tracking event straight to your Netlify Edge console
  console.log(`[EMAIL OPENED] Target: ${client} at ${new Date().toISOString()}`);
  
  // Generates a 1x1 transparent tracking pixel natively
  const pixelBase64 = "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  const binaryPixel = Uint8Array.from(atob(pixelBase64), c => c.charCodeAt(0));
  
  return new Response(binaryPixel, {
    headers: { 
      "content-type": "image/gif",
      "cache-control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "pragma": "no-cache",
      "expires": "0"
    }
  });
};

export const config = { path: "/track.png" };
