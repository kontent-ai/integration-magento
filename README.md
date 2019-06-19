# Magento product selector for Kentico Cloud

[![Stack Overflow](https://img.shields.io/badge/Stack%20Overflow-ASK%20NOW-FE7A16.svg?logo=stackoverflow&logoColor=white)](https://stackoverflow.com/tags/kentico-cloud)

This repository contains source code of Magento product selector custom element for Kentico Cloud

# Use

If you want to use Magento product selector in your project in Kentico Cloud, follow these steps:

* In Kentico Cloud open Content models tab
* Open / create a content model to which you want to add Magento selector
* Add **Custom element** content element
* Open configuration of the content element
* Use following URL as Hosted code URL (HTTPS): https://kentico.github.io/custom-element-samples/Magento/product-selector.html
* Provide the following JSON parameters for the custom element to connect it to your store, replace the macros with the actual values for your setup

```
{
  "endpointUrl": "<PRODUCTS ENDPOINT URL>",
  "mediaRootUrl": "https://<YOUR MAGENTO DOMAIN>/pub/media/catalog/product",
  "urlKeyAttribute": "url_key"
}
```

Note that **urlKeyAtttribute** is optional, if not provided, it will be automatically generated with the value shown above.

# Installation

If you want to adjust the implementation, first download [Kentico Cloud Custom Elements Devkit](https://github.com/kentico/custom-element-devkit). This repository should be positioned within `/client/custom-elements` folder. For further instructions on devkit implementation, please refer to [Custom Element Devkit README](https://github.com/Kentico/custom-element-devkit/blob/master/readme.md).

## Get started

Prerequisites:
* Node.js
* git

```
git clone https://github.com/Kentico/custom-element-devkit.git
cd custom-element-devkit
git clone https://github.com/Kentico/cloud-custom-element-sample-magento.git ./client/custom-elements/cloud-custom-element-sample-magento
npm install --save jquery@^3.4.0
npm start -- -hw
```
Browse: https://localhost:3000/custom-elements/cloud-custom-element-sample-magento/wrap

# Live site implementation sample

If you want to see live site example of Magento product displayed on the live site, browse to a [deployed sample site](https://kentico-cloud-sample-app-react-magento.surge.sh/en-us/articles/3120ec15-a4a2-47ec-8ccd-c85ac8ac5ba5).

See source code of the sample site implementation [here](https://github.com/Kentico/cloud-sample-app-react/commit/ef2de5ad5798a82d6c909e3154b5cdbb9582db79).

![Analytics](https://kentico-ga-beacon.azurewebsites.net/api/UA-69014260-4/Kentico/cloud-custom-element-sample-magento?pixel)
