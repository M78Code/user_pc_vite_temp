/**
 * 提取文档  *.doc.json 生成  单一 全量 json
 */
import * as fs from "node:fs";
import * as path from "node:path";
import randomstring from "randomstring";
import scripts_doc from "../scripts.doc.json" assert { type: "json" };
import job_doc from "./job.doc.json" assert { type: "json" };
import entries_doc from "../entries/entries.doc.json" assert { type: "json" };
// import pkg from 'randomstring';
// const { randomstring} = pkg;
/**
 * 遍历指定目录下的所有 .doc.json文件
 * @param {*} dir
 */
const getAllFile = function (dir) {
  let res = [];
  function traverse(dir) {
    fs.readdirSync(dir).forEach((file) => {
      const pathname = path.join(dir, file);
      if (fs.statSync(pathname).isDirectory()) {
        traverse(pathname);
      } else {
        if (pathname.endsWith(".doc.json")) {
          res.push(pathname);
        }
      }
    });
  }
  traverse(dir);
  return res;
};
// 所有 文档 顶层  集合 数组
let all_doc_arr = [];
let all_doc_obj = {};
let file_path_arr = [];
let statistics =  {};
/**
 * 生成键
 */
const cerate_key = (add_obj = {}) => {
  let { file_path } = add_obj;
  let key = "key_" + Date.now() + "_" + randomstring.generate(16);
  if (file_path) {
    console.log("file_path-", file_path);
    key = file_path.replaceAll("\\", "_");
    key = key.replaceAll("/", "_");
    key = key.replaceAll(".", "_");
    console.log("file_path-", key);
  }
  return key;
};
/**
 * 增补到 所有 文档
 * 兼容 数组和对象
 */
const add_to_all_doc_arr = (obj, add_obj = {}) => {
  if (!obj) {
    return;
  }
  // if(typeof  obj == 'string'){
  //   obj = obj.replaceAll('\r\n')
  // }
  let key = cerate_key(add_obj);
  file_path_arr.push(add_obj.file_path);
  if (Array.isArray(obj)) {
    obj.map((x) => {
      let new_obj = {
        ...add_obj,
        ...x,
      };
      all_doc_arr.push(new_obj);
      all_doc_obj[key] = new_obj;
    });
  } else {
    let new_obj = {
      ...add_obj,
      ...obj,
    };
    all_doc_arr.push(new_obj);
    all_doc_obj[key] = new_obj;
  }
};
/**
 * 提取 目录内的  doc 文件内容
 */
const extract_doc = (dir) => {
  // let all_doc_paths = getAllFile(path.join(__dirname, dir));
  let all_doc_paths = getAllFile(path.join("./", dir));
  all_doc_paths.map((file_path) => {
    fs.readFile(file_path, "utf8", (err, data) => {
      if (err) {
        throw err;
      }
      //增补到 所有 文档
      if (data) {
        add_to_all_doc_arr(JSON.parse(data), {
          file_path: file_path.replaceAll("\\", "/"),
        });
      }
    });
  });
};
//增补到 所有 文档
add_to_all_doc_arr(scripts_doc, { file_path: "scripts.doc.json" });
add_to_all_doc_arr(job_doc, { file_path: "job.doc.json" });
add_to_all_doc_arr(entries_doc, { file_path: "entries/entries.doc.json" });
// 提取 src 目录内的 doc 文件
extract_doc("src");
// 转换提取  category
const extract_category = () => {
  all_doc_arr.map((x) => {});
};
statistics ={
  len: file_path_arr.length
}
let version = Date.now();
let write_folder = "./job/output/doc";
 

/**
 * 确保配置 输出目录存在
 */
const ensure_write_folder_exist = () => {
  let is_exist = fs.existsSync(write_folder)
      if (is_exist) {
        console.log( `${write_folder}-----文件夹已存在----  ` );    
      }else{
            // 创建文件夹
        fs.mkdir(write_folder, { recursive: true }, (err) => {
          if (err) {
            console.log("创建文件夹 出错 ", err);
          }
          console.log("创建文件夹   完成");
        });
      }
  };
//确保配置 输出目录存在 
ensure_write_folder_exist()



setTimeout(() => {
  console.log(" ");
  console.log(" ");
  console.log(" ");
  console.log("写入");
  console.log(" ");
  console.log(" ");
  fs.writeFile(
    write_folder + "/arr.json",
    JSON.stringify(all_doc_arr),
    "utf8",
    (err) => {
      if (err) {  console.log("arr 写入出错 ", err) };
      console.log('arr 写入 完成');
    }
  );
  fs.writeFile(
    write_folder + "/obj.json",
    JSON.stringify(all_doc_obj),
    "utf8",
    (err) => {
      if (err) { console.log("obj 写入出错", err)};
      console.log('obj 写入 完成');
    }
  );
  fs.writeFile(
    write_folder + "/key.json",
    JSON.stringify(Object.keys(all_doc_obj)),
    "utf8",
    (err) => {
      if (err){  console.log("key 写入出错", err)};
      console.log('key 写入 完成');
    }
  );
  fs.writeFile(
    write_folder + "/file_path_arr.json",
    JSON.stringify(file_path_arr),
    "utf8",
    (err) => {
      if (err){  console.log("file_path 写入出错", err)};
      console.log('file_path 写入 完成');
    }
  );
  fs.writeFile(
    write_folder + "/statistics.json",
    JSON.stringify(statistics),
    "utf8",
    (err) => {
      if (err){  console.log("statistics 写入出错", err)};
      console.log('statistics 写入 完成');
    }
  );
}, 7000);
setTimeout(() => {
  console.log(" ");
  console.log(" ");
  console.log("结束进程 ");
  console.log(" ");
  console.log(" ");
  process.exit(0);
}, 10000);
