import { ApiReference } from "@scalar/nextjs-api-reference";

export const GET = ApiReference({
  theme: "purple",
  layout: "modern",
  spec: {
    url: "/openapi.json",
  },
  metaData: {
    title: "OurStory API Reference | Scalar Documentation",
  },
});
