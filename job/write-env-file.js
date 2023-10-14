// # .env.production
// VITE_APP_TITLE=My App
 

// 本次打包的 客户端版本
import BUILD_VERSION_CONFIG from "./output/version/build-version.js";
 
 

import { write_file } from "./write-folder-file.js";
const compute_str = (params = {}) => {
  let str = "";
  for (let i in params) {
    if (typeof params[i] != "object") {
      if (params[i] !== undefined) {
        let one = `
        VITE_APP_${i}=${params[i]}
        `;
        str += one;
      } else {
        let one = `
        VITE_APP_${i}=
        `;
        str += one;
      }
    } else {
      let one = `
        VITE_APP_${i}=
        `;
      str += one;
    }
  }
  return str;
};

export const write_env_file = (params = {}) => {
  
 
  write_file(`./.env`, compute_str(params));
};
