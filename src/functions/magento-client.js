const axios = require('axios')

exports.handler = async (event, context) => {

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const API_TOKEN = process.env.MAGENTO_TOKEN;
  const ROOT_URL = event.headers["x-root-url"];
  const URL_KEY = event.headers['x-url-key'] || "url_key";
  const SEARCH_QUERY = (JSON.parse(event.body)).query;

  if (!API_TOKEN && !ROOT_URL) {
    return { statusCode: 401, body: "Unauthorized" };
  }


  try {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_TOKEN}`
    };

    var data = {
      'searchCriteria[pageSize]': 10,
      'searchCriteria[filterGroups][0][filters][0][field]': 'name',
      'searchCriteria[filterGroups][0][filters][0][conditionType]': 'like',
      'searchCriteria[filterGroups][0][filters][0][value]': `%${SEARCH_QUERY}%`,
    }

    var response = (await axios.get(`${ROOT_URL}/rest/V1/products`, { headers: headers, params: data })).data;
    var items = response.items.map(
      function (item) {
        var media = item.media_gallery_entries;
        var urlKey = item.custom_attributes && item.custom_attributes.filter((attr) => attr.attribute_code == URL_KEY)[0];
        return {
          id: item.id,
          title: item.name,
          previewUrl: media && media.filter((item) => item.media_type == 'image').map((image) => `${ROOT_URL}/pub/media/catalog/product${image.file}`)[0],
          sku: item.sku,
          urlKey: urlKey && urlKey.value
        };
      });

    return { statusCode: 200, body: JSON.stringify(items) };
  }
  catch (e) {
    console.log(e);
    return { statusCode: 500, body: JSON.stringify(e.data) }
  }
};