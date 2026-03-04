import shopify from "../../shopify_developer_app.app.mjs";
import common from "@pipedream/shopify/actions/search-products/search-products.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, shopify);

export default {
  ...others,
  key: "shopify_developer_app-search-products-with-price",
  version: "0.0.1",
  name: "Search for Products (with Price)",
  description: "Search for products with price data included. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/queries/products)",
  type,
  props: {
    shopify,
    ...props,
  },
};
