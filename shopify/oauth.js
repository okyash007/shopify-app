import axios from "axios";
import { getApp, updateApp } from "../register-app.js";
import { createApp } from "../tailboost.js";
import { getStoreDetails } from "./store.js";
import { addScriptTag } from "./scriptTag.js";

export async function authorize(shop) {
  const app = await getApp(shop);

  return encodeURI(
    `https://${shop}/admin/oauth/authorize?client_id=${app.api_key}&scope=read_customers,read_orders,read_products,read_script_tags,read_themes,write_draft_orders,write_order_edits,write_orders,write_products,write_script_tags,write_themes&redirect_uri=http://localhost:3000/api/shopify/redirect`
  );
}

export async function redirect(code, shop) {
  const appRes = await fetch(`http://localhost:8000/app/${shop}`, {
    method: "GET",
  });

  const app = await appRes.json();

  const shopifyOathUri = `https://${shop}/admin/oauth/access_token?client_id=${app.api_key}&client_secret=${app.api_secret}&code=${code}`;

  const { data } = await axios({
    url: shopifyOathUri,
    method: "post",
    data: {},
  });

  let regApp = await getApp(shop);

  if (regApp.status === "pending") {
    const createdApp = await createApp(shop, data.access_token);

    if (!createdApp) {
      return "app can't be installed";
    }

    const storeDetails = await getStoreDetails(data.access_token, shop);

    regApp = await updateApp(shop, {
      access_token: data.access_token,
      status: "installed",
      store_email: storeDetails.email,
      tailboost_app_id: createdApp.tailboost_app_id,
    });
  }

  const logUserScript = await addScriptTag(
    shop,
    data.access_token,
    "https://shopify-app-scripts.vercel.app/loguser.js",
    "all"
  );

  console.log("loguseScript", logUserScript);

  const swiperScript = await addScriptTag(
    shop,
    data.access_token,
    "https://cdn.jsdelivr.net/npm/swiper@11/swiper-element-bundle.min.js",
    "order_status"
  );

  console.log("swiperScript", swiperScript);

  const orderStatusScript = await addScriptTag(
    shop,
    data.access_token,
    "https://shopify-app-scripts.vercel.app/order_status.js",
    "order_status"
  );

  console.log("orderStatusScript", orderStatusScript);

  // Register Post-Purchase UI Extension

  try {
    const extensionUrl = `https://${shop}/admin/api/2023-04/extensions.json`;

    const extensionBody = {
      extension: {
        handle: "post-purchase-extension",
        url: `http://localhost:3000/post-purchase-ui`, // Update with your URL
      },
    };

    const extensionResponse = await fetch(extensionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": data.access_token,
      },
      body: JSON.stringify(extensionBody),
    });

    const extensionData = await extensionResponse.json();
    console.log("Post-purchase extension registered: ", extensionData);
  } catch (error) {
    console.error("Error registering post-purchase extension: ", error);
  }

  return regApp;
}
