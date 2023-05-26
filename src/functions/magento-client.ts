import axios from "axios";
import { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  if (!event.body) {
    return { statusCode: 400, body: "Missing body" };
  }

  const API_TOKEN = process.env.MAGENTO_TOKEN;
  const ROOT_URL = event.headers["x-root-url"];
  const URL_KEY = event.headers["x-url-key"] || "url_key";
  const SEARCH_QUERY = (JSON.parse(event.body)).query;

  if (!API_TOKEN && !ROOT_URL) {
    return { statusCode: 401, body: "Unauthorized" };
  }

  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
    };

    const data = {
      "searchCriteria[pageSize]": 10,
      "searchCriteria[filterGroups][0][filters][0][field]": "name",
      "searchCriteria[filterGroups][0][filters][0][conditionType]": "like",
      "searchCriteria[filterGroups][0][filters][0][value]": `%${SEARCH_QUERY}%`,
    };

    const response = (await axios.get(`${ROOT_URL}/rest/V1/products`, { headers: headers, params: data })).data;
    const items = response.items.map((item: any) => {
      const media = item.media_gallery_entries;
      const urlKey = item.custom_attributes?.filter((attr: any) => attr.attribute_code == URL_KEY)[0];
      return {
        id: item.id,
        title: item.name,
        previewUrl: media
          ?.filter((item: any) => item.media_type == "image")
          .map((image: any) => `${ROOT_URL}/media/catalog/product${image.file}`)[0],
        sku: item.sku,
        urlKey: urlKey?.value,
      };
    });

    return { statusCode: 200, body: JSON.stringify(items) };
  } catch (e) {
    console.log(e);
    return { statusCode: 500, body: JSON.stringify(e) };
  }
};
