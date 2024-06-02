export async function getAllProducts(shop, accessToken, limit) {
  const url = `https://${shop}/admin/api/2023-10/products.json?limit=${limit}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}
