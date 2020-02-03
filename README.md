# Magento product selector for Kentico Kontent

[![Stack Overflow](https://img.shields.io/badge/Stack%20Overflow-ASK%20NOW-FE7A16.svg?logo=stackoverflow&logoColor=white)](https://stackoverflow.com/tags/kentico-kontent)

This repository contains source code for the Magento product selector custom element for Kentico Kontent

## Setup

1. Register an integration with your Magento instance
    * [See instructions in our documentaton](https://docs.kontent.ai/tutorials/develop-apps/integrate/integrating-with-e-commerce-magento)
1. Deploy the code to a secure public host
    * See the [deploying section](#deploying) for a really quick option
1. Follow the instructions in the [Kentico Kontent documentation](https://docs.kontent.ai/tutorials/develop-apps/integrate/integrating-your-own-content-editing-features#a-3--displaying-a-custom-element-in-kentico-kontent) to add the element to a content model.
    * The `Hosted code URL` is where you deployed to in step 1
    * Configure the JSON parameters as detailed in the [JSON Parameters section](#json-parameters)

## JSON Parameters

You will also need to provide the following JSON parameters for the custom element to connect to your store. Replace the placeholders with the actual values from your Magento instance and integration:

```json
{
  "endpointUrl": "<PRODUCTS ENDPOINT URL>",
  "mediaRootUrl": "https://<YOUR MAGENTO DOMAIN>/pub/media/catalog/product",
  "urlKeyAttribute": "url_key"
}
```

Note that **urlKeyAttribute** is optional, if not provided, it will be automatically generated with the value shown above.

## Deploying

Netlify has made this easy. If you click the deploy button below, it will guide you through the process of deploying it to Netlify and leave you with a copy of the repository in your GitHub account as well.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Kentico/cloud-custom-element-sample-magento)

## Contributors

Originally contributed by [@kenticomartinh](https://github.com/kenticomartinh)

![Analytics](https://kentico-ga-beacon.azurewebsites.net/api/UA-69014260-4/Kentico/kontent-custom-element-sample-magento?pixel)
