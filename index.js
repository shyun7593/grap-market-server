const http = require("http");
const hostname = "127.0.0.1";
const port = 8080;

const server = http.createServer(function (req, res) {
  const path = req.url;
  const method = req.method;
  if (path === "/products") {
    if (method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      const products = JSON.stringify([
        {
          name: "농구공",
          price: 5000,
        },
      ]);
      res.end(products);
    } else if (method === "POST") {
      res.end("생성되었습니다!");
    }
  }
  res.end("Good Bye!"); /* end의 첫 번째 인자에는 string이 들어가야 한다 */
});

server.listen(port, hostname); /* listen : 기다리고 있다.*/

console.log("grab market server on!");
