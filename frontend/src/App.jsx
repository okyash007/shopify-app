import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "@shopify/polaris/build/esm/styles.css";
import { Button } from "@shopify/polaris";
import { Card, Text } from "@shopify/polaris";
import { MediaCard, VideoThumbnail } from "@shopify/polaris";
import { makeGetRequest } from "./utils/api";

function App() {
  const [shopState, setShopState] = useState(null);

  function getShopFromUrl(queryString) {
    const params = new URLSearchParams(queryString);
    return params.get("shop");
  }

  const shop = getShopFromUrl(window.location.search);

  if (!shop) {
    return (
      <>
        <h1>no shop provided</h1>
      </>
    );
  }

  async function getApp(shop) {
    const app = await makeGetRequest(`http://localhost:8000/app/${shop}`);
    setShopState(app);
  }

  useEffect(() => {
    getApp(shop);
  }, []);
  console.log(shopState);

  return (
    <>
      <div className="main">
        <div>
          <Card>
            <Text as="h2" variant="bodyXl">
              Tailboost Shopify app
            </Text>
          </Card>
        </div>
        <div>
          <Card>
            <div className="app-status">
              <Text as="h2" variant="bodyXl">
                App Status
              </Text>
              <Button>enable</Button>
            </div>
          </Card>
        </div>
        <div className="videos">
          <div>
            <MediaCard
              title="Turn your side-project into a business"
              primaryAction={{
                content: "Learn more",
                onAction: () => {},
              }}
              description={`In this course, you’ll learn how the Kular family turned their mom’s recipe book into a global business.`}
              popoverActions={[{ content: "Dismiss", onAction: () => {} }]}
            >
              <VideoThumbnail
                videoLength={80}
                thumbnailUrl="https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850"
                onClick={() => console.log("clicked")}
              />
            </MediaCard>
          </div>
          <div>
            <MediaCard
              title="Turn your side-project into a business"
              primaryAction={{
                content: "Learn more",
                onAction: () => {},
              }}
              description={`In this course, you’ll learn how the Kular family turned their mom’s recipe book into a global business.`}
              popoverActions={[{ content: "Dismiss", onAction: () => {} }]}
            >
              <VideoThumbnail
                videoLength={80}
                thumbnailUrl="https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850"
                onClick={() => console.log("clicked")}
              />
            </MediaCard>
          </div>
        </div>
        <div className="boost">
          <Button
            onClick={() => {
              console.log(shopState);
              window.open(
                `https://staging-dashboard.tailboost.ai/signup/?shop_url=${shopState.store_url}&shop_name=${shopState.store_url}`,
                "_blank"
              );
            }}
            variant="primary"
          >
            Let's Boost
          </Button>
        </div>
      </div>
    </>
  );
}

export default App;
