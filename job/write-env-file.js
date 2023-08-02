// # .env.production
// VITE_APP_TITLE=My App
const model = process.env.NODE_ENV || "development";

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
  write_file(`./.env.${model}`, compute_str(params));
  write_file(`./.env`, compute_str(params));
};
