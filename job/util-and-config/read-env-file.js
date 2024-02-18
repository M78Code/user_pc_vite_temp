// # .env.production
// VITE_APP_TITLE=My App
import * as fs from "node:fs";
 
const jiexi_str = (obj = {}, str) => {

  let arr = (str || "")
    .split("\n")
    .map((x) => x.trim())
    .filter((x) => x);

  arr.map((x) => {
    let arr1 = x.split("=");
    if (arr1[0] && arr1[0].startsWith("VITE_APP_")) {
      let key = arr1[0].replace("VITE_APP_", "");
      let val = arr1[1];
      obj[key] = val;
    }
  });


  return obj;
};
const read_file_inner = (file_path) => {
  let str = "";
  let obj = {};
  try {
    str = fs.readFileSync(file_path, "utf8");
    obj = jiexi_str({}, str);
  } catch (error) {
    console.log(error);
  } finally {
    return obj;
  }
};
export const read_file = (file_path) => {
  let obj = {};
  if (file_path.endsWith(".env")) {
    read_file_inner(file_path);
  } else {
    let base_env_file_path = file_path.split(".env")[0] + ".env";
    let obj_base = read_file_inner(base_env_file_path);
    let obj_model = read_file_inner(file_path);
    obj = Object.assign({}, obj_base, obj_model);
  }

  return obj;
};

// let final_result = read_file("./.env");


