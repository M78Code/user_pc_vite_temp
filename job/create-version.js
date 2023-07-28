 /**
  * 创建 本次打包的 客户端版本
  */
const fs = require('fs')





function format_date(value) {
  let time = new Date(parseInt(value));
  let y = time.getFullYear();
  let m = (time.getMonth() + 1 + "").padStart(2, 0);
  let d = (time.getDate() + "").padStart(2, 0);
  let h = (time.getHours() + "").padStart(2, 0);
  let mm = (time.getMinutes() + "").padStart(2, 0);
  let s = (time.getSeconds() + "").padStart(2, 0);
  return `${y}-${m}-${d}-${h}-${mm}-${s}`;
}




const BUILD_VERSION =   format_date(new Date().getTime())

let str = `module.exports= {"BUILD_VERSION": '${BUILD_VERSION}'  } `

let full_path = `./version.js`;

fs.writeFileSync(full_path, str);
