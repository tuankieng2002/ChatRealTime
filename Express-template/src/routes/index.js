const express = require("express");
const userRoute = require("./user.route");
const productRoute = require("./product.route");
const categoryRoute = require("./category.route");
const orderRoute = require("./order.route");
const cartRoute = require("./cart.route");

const postRoute = require("./post.route");
const conversationRoute = require("./conversation.route");
const messageRoute = require("./message.route");

const auth = require("../user/auth");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/products",
    route: productRoute,
  },
  {
    path: "/categories",
    route: categoryRoute,
  },
  {
    path: "/orders",
    route: orderRoute,
  },
  {
    path: "/carts",
    route: cartRoute,
  },
  {
    path: "/posts",
    route: postRoute,
  },
  {
    path: "/conversations",
    route: conversationRoute,
  },
  {
    path: "/messages",
    route: messageRoute,
  },

  {
    path: "/auth",
    route: auth,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
