export async function addProductToOrder(
  accessToken,
  orderId,
  productVariantId,
  shop
) {
  const SHOPIFY_ADMIN_API_URL = `https://${shop}/admin/api/2021-01/graphql.json`; // Update with actual shopify admin url

  // Set up headers for authorization
  const headers = {
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": accessToken,
  };

  // Begin order edit session
  const beginOrderEditMutation = `
    mutation beginEdit{
      orderEditBegin(id: "gid://shopify/Order/${orderId}"){
         calculatedOrder{
           id
         }
       }
     }
    `;

  let orderEditId;

  try {
    const beginResponse = await fetch(SHOPIFY_ADMIN_API_URL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ query: beginOrderEditMutation }),
    });
    const beginResult = await beginResponse.json();

    console.log(beginResult);

    if (beginResult.errors) {
      throw new Error(
        `Error beginning order edit: ${beginResult.errors[0].message}`
      );
    }

    orderEditId = beginResult.data.orderEditBegin.calculatedOrder.id;
  } catch (error) {
    console.error("Error in beginning order edit:", error);
    return;
  }

  // Add product variant to order
  const addVariantMutation = `
      mutation {
        orderEditAddVariant(id: "${orderEditId}", variantId: "gid://shopify/ProductVariant/${productVariantId}", quantity: 1) {
          calculatedOrder {
            id
            subtotalPriceSet {
              presentmentMoney {
                amount
                currencyCode
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

  try {
    const addVariantResponse = await fetch(SHOPIFY_ADMIN_API_URL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ query: addVariantMutation }),
    });
    const addVariantResult = await addVariantResponse.json();

    if (addVariantResult.errors) {
      throw new Error(
        `Error adding variant to order: ${addVariantResult.errors[0].message}`
      );
    }
  } catch (error) {
    console.error("Error in adding variant to order:", error);
    return;
  }

  // Commit order edit session
  const commitOrderEditMutation = `
      mutation {
        orderEditCommit(id: "${orderEditId}") {
          order {
            id
            edited
            currentTotalPriceSet {
              presentmentMoney {
                amount
                currencyCode
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

  try {
    const commitOrderEditResponse = await fetch(SHOPIFY_ADMIN_API_URL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ query: commitOrderEditMutation }),
    });
    const commitOrderEditResult = await commitOrderEditResponse.json();

    if (commitOrderEditResult.errors) {
      throw new Error(
        `Error committing order edit: ${commitOrderEditResult.errors[0].message}`
      );
    }
  } catch (error) {
    console.error("Error in committing order edit:", error);
    return;
  }

  console.log("Product variant added to order successfully");
  return "Product variant added to order successfully";
}

export async function getOrderDetails(accessToken, orderId, shop) {
  const SHOPIFY_ADMIN_API_URL = `https://${shop}/admin/api/2024-04/graphql.json`; // Update with actual Shopify admin URL

  console.log(accessToken, orderId, shop);

  const headers = {
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": accessToken,
  };

  // GraphQL query to get order details
  const getOrderDetailsQuery = `
      query getOrderDetails($id: ID!) {
        order(id: $id) {
          id
          email
          createdAt
          totalPriceSet {
            presentmentMoney {
              amount
              currencyCode
            }
          }
          lineItems(first: 10) {
            edges {
              node {
                title
                quantity
                variant {
                  id
                  title
                }
              }
            }
          }
        }
      }
    `;

  const variables = { id: `gid://shopify/Order/${orderId}` };

  try {
    const response = await fetch(SHOPIFY_ADMIN_API_URL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ query: getOrderDetailsQuery, variables }),
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(
        `Error fetching order details: ${result.errors}`
      );
    }

    const orderDetails = result.data.order;
    return orderDetails;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch order details");
  }
}
