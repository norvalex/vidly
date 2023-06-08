const express = require("express");
const router = express.Router();

router.use("/", (req, res) => {
  res.render("index", {
    title: "PropPI",
    message: "Welcome to the PropPI API!!",
  });
});

module.exports = router;
