import { readFile } from "fs/promises";
export const import_json_data = async (json_data_path) => {
  // const  { default:json_data} = await import( json_data_path, { assert: { type: "json" }, } );
  //  return json_data
  const json_data = JSON.parse( await readFile(new URL(json_data_path, import.meta.url)) );
  return json_data;
};


// --------------------------------
// 所有  目标环境标识
export const ALL_ENV_ARR = [
  "local_local",
  "local_dev",
  "local_test",
  "idc_lspre",
  "idc_pre",
  "idc_sandbox",
  "idc_ylcs",
  "idc_online",
];
