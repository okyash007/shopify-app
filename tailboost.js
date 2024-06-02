import { getApp } from "./register-app.js";
import { getStoreDetails } from "./shopify/store.js";

export async function createApp(shop, accessToken) {
  const app = await getApp(shop);
  const store = getStoreDetails(accessToken, shop);
  const createdAppData = await fetch(
    `${process.env.TAILBOOST_URL}/createApp?app_name=Tailboost&secret_key=${app.api_secret}&api_key=${app.api_key}&tailboost_app_name=${app.app_name}&tailboost_app_store_url=${app.store_url}&tailboost_app_store_email=${store.email}&callback_url=https://dummyurl&redirect_url=https://dummyurl`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );
  const createdApp = await createdAppData.json();
  return createdApp;
}

export async function logUser(data) {
  const response = await fetch(`${process.env.TAILBOOST_URL}/loguser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });
  const logUserData = await response.json();
  return logUserData;
}
