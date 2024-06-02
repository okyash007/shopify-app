export async function makeGetRequest(url, access_token) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "X-Shopify-Access-Token": access_token,
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  return json;
}

export async function makePostRequest(url, body, access_token) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": access_token,
    },
    body: JSON.stringify(body),
  });
  const json = await response.json();
  return json;
}
