const express = require("express");
const next = require("next");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.get("/posts/:id", (req, res) => {
    console.log("req", req.params.id);
    return app.render(req, res, "/posts", { id: req.params.id });
  });

  server.get("/content/:id", (req, res) => {
    return app.render(req, res, "/contentput", { id: req.params.id });
  });

  // server.get("/club/:id", (req, res) => {
  //   return app.render(req, res, "/clubput", { id: req.params.id });
  // });

  // server.get("/jobinfo/club/:id", (req, res) => {
  //   return app.render(req, res, "/jobinfo", { id: req.params.id });
  // });

  // server.get("/jobinfopost/:id", (req, res) => {
  //   return app.render(req, res, "/jobinfopost", { id: req.params.id });
  // });

  // server.get("/jobinfoput/:id", (req, res) => {
  //   return app.render(req, res, "/jobinfoput", { id: req.params.id });
  // });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
