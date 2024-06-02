export async function addScriptTag(shop, accessToken, scriptSrc, scope) {
  const url = `https://${shop}/admin/api/2023-10/script_tags.json`;

  const data = {
    script_tag: {
      event: "onload",
      src: scriptSrc,
      display_scope: scope,
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
