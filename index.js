import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { authorize, redirect } from "./shopify/oauth.js";
import path from "path";
import { logUser } from "./tailboost.js";
import { getApp } from "./register-app.js";
import { getad } from "./shopify/ad.js";
import { addProductToOrder, getOrderDetails } from "./shopify/order.js";

dotenv.config({
  path: "./.env",
});

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://estates-granny-mm-exercises.trycloudflare.com",
      "*",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));

app.listen(3000, () => {
  console.log(`Server is running at port : http://localhost:3000 `);
});

const __dirname = path.resolve("./"); // Get the absolute path of the current directory

app.use(
  express.static(path.join(__dirname, "frontend/dist")),
  express.static(path.join(__dirname, "post-purchase-ui/dist"))
);

app.get("/", (req, res) => {
  // Send the index.html file from the dist directory
  res.sendFile(path.join(__dirname, "frontend/dist/index.html"));
});

app.get("/post-purchase-ui", (req, res) => {
  console.log(path.join(__dirname, "post-purchase-ui/dist/index.html"));
  res.sendFile(path.join(__dirname, "post-purchase-ui/dist/index.html"));
});

app.get("/api/shopify/authorize", async (req, res) => {
  res.redirect(await authorize(req.query.shop));
});
app.get("/api/shopify/redirect", async (req, res) => {
  await redirect(req.query.code, req.query.shop);

  const app = await getApp(req.query.shop);

  res.redirect(
    `https://staging-dashboard.tailboost.ai/signup/?shop_url=${req.query.shop}&shop_name=${app.store_url}&email=${app.store_email}`
  );
});

app.get("/proxy/loguser", async (req, res) => {
  const logUserData = await logUser({
    tailboost_app_id: "tailboost_app_shopify_id",
    shop_id: "yash-test-id",
    shop_name: "Yash Test",
    user_ip: req.query.ip,
    user_agent: req.headers["user-agent"],
    current_url: req.query.current_url,
    visitorId: req.query.fp,
  });
  console.log({
    tailboost_app_id: "tailboost_app_shopify_id",
    shop_id: "yash-test-id",
    shop_name: "Yash Test",
    user_ip: req.query.ip,
    user_agent: req.headers["user-agent"],
    current_url: req.query.current_url,
    visitorId: req.query.fp,
  });
  res.json(logUserData);
});

app.get("/proxy/editorder", async (req, res) => {
  const app = await getApp(req.query.shop);

  const order = await getOrderDetails(
    app.access_token,
    req.query.order,
    req.query.shop
  );

  if (!order) {
    return res.status(400).json({ error: "order not found" });
  }

  const editedOrder = await addProductToOrder(
    app.access_token,
    req.query.order,
    45257114681589,
    req.query.shop
  );

  res.json(editedOrder);
});

app.get("/proxy/getad", async (req, res) => {
  const app = await getApp(req.query.shop);
  const ad = await getad("tailboost_app_669e7af7-4", req.header["user-agent"]);
  res.send(ad);
});

app.get("/api/getorder", async (req, res) => {
  const app = await getApp(req.query.shop);

  const order = await getOrderDetails(
    app.access_token,
    req.query.order,
    req.query.shop
  );
  res.json(order);
});
