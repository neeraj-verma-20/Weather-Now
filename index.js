const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
  temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
  temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

  return temperature;
};
const server = http
  .createServer((req, res) => {
    if (req.url == "/") {
      requests(
        `https://api.openweathermap.org/data/2.5/weather?q=Pune&appid=c13ce70270cd5f2faad2f81e9a3b726d`
      )
        .on("data", (chunk) => {
          const objdata = JSON.parse(chunk);
          const arrData = [objdata];
          const realTimeData = arrData
            .map((val) => replaceVal(homeFile, val))
            .join("");
          res.write(realTimeData);
        })
        .on("end", (err) => {
          if (err) return console.log("connection closed due to errors", err);
          res.end();
        });
    } else {
      res.end("File not found");
    }
  })
  .listen(8080, "127.0.0.1");
