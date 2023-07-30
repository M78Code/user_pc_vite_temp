/**
 * 删除 服务器上可能的历史版本输出缓存，确保不出错
 */
import * as fs from "node:fs";
fs.stat("./dist/self-use-version", (err, stats) => {
  console.log("stats-----", stats);

  if (stats) {
    fs.rm("./dist/self-use-version", { recursive: true, force: true }, (err) => {
      console.log(err);
    });
  }
});
