exports.default = {
  serverRuntimeConfig: {
    shoppingListService: {
      host: process.env.SHOPPING_LIST_SERVICE_SERVICE_HOST || 'localhost',
      port: Number(process.env.SHOPPING_LIST_SERVICE_SERVICE_PORT_HTTP || 3000),
    },
  },
}
