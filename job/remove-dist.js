/**
 * 删除 服务器上可能的历史版本输出缓存，确保不出错
 */
const fs = require("fs");
fs.stat("./dist/spa", (err, stats) => {
  console.log("stats-----", stats);

  if (stats) {
    fs.rm("./dist/spa", { recursive: true, force: true }, (err) => {
      console.log(err);
    });
  }
});
