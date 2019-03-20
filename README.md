# Magento product selector for Kentico Cloud

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
git clone https://github.com/kenticomartinh/kc-magento.git ./client/custom-elements/kc-magento
npm install --save jquery
npm start -- -hw
```
Browse: https://localhost:3000/custom-elements/kc-magento/wrap
