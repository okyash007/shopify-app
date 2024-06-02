export async function getStoreDetails(accessToken, shop) {
  try {
    const response = await fetch(
      `https://${shop}/admin/api/2023-04/shop.json`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": accessToken,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      name: data.shop.name,
      email: data.shop.email,
      domain: data.shop.domain,
      // Add more fields as needed
    };
  } catch (error) {
    console.error("Error fetching store details:", error);
    return null;
  }
}

export async function addScriptTag(shop, accessToken, scriptSrc) {
  const url = `https://${shop}/admin/api/2023-10/script_tags.json`;

  const data = {
    script_tag: {
      event: "onload",
      src: scriptSrc,
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },

      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error ${response.status}: ${errorData.errors}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error adding script tag:", error);
  }
}
