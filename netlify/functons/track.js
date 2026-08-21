exports.handler = async (event, context) => {
  const client = event.queryStringParameters.id || "unknown_lead";
  
  // This streams the tracking alert safely to your standard Functions log panel!
  console.log(`[EMAIL OPENED] Target: ${client} at ${new Date().toISOString()}`);

  // Natively generates the 1x1 invisible transparent tracking pixel
  const pixelBase64 = "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0"
    },
    body: pixelBase64,
    isBase64Encoded: true
  };
};
