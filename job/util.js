import { readFile } from "fs/promises";
export const import_json_data = async (json_data_path) => {
  // const  { default:json_data} = await import( json_data_path, { assert: { type: "json" }, } );
  //  return json_data
  const json_data = JSON.parse( await readFile(new URL(json_data_path, import.meta.url)) );
  return json_data;
};



export  const format_date=(value)=>{
  let time = new Date(parseInt(value));
  let y = time.getFullYear();
  let m = (time.getMonth() + 1 + "").padStart(2, 0);
  let d = (time.getDate() + "").padStart(2, 0);
  let h = (time.getHours() + "").padStart(2, 0);
  let mm = (time.getMinutes() + "").padStart(2, 0);
  let s = (time.getSeconds() + "").padStart(2, 0);
  return `${y}-${m}-${d}-${h}-${mm}-${s}`;
}


