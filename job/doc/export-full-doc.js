/**
 * 提取文档  *.doc.json 生成  单一 全量 json
 */
import * as fs from "node:fs";
import * as path from "node:path";
import randomstring from "randomstring";
import {ensure_write_folder_exist} from "../util-and-config/write-folder-file.js"
import {import_json_data} from "../util-and-config/write-folder-file.js"

const  scripts_doc  = import_json_data("./job/scripts.doc.json")
const  job_doc  = import_json_data("./job/job.doc.json")
const  entries_doc  = import_json_data("./entries/entries.doc.json")

 
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
// 左侧菜单
let left_menu = [];
// 路径文件数据
let menu_data = [];
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
 * 右侧菜单生成
 * @param {*} lists 
 * @param {*} suns 
 * @returns 
 */
function deep_left_menu(lists, suns) {
  // 数组为空 || 等级为1 新增一条数据
  if (suns.level == 1) {
    let obj1 = {
      menuName: suns.menuName?.trim(),
      level: suns.level,
      children: [Object.assign(suns, { level: 2 })],
    }
    lists.push(obj1)
  } else {
    // 遍历当前数据
    lists.map((item, idx) => {
      if (item.menuName?.trim() == suns.menuName?.trim()) {
        item.children?.push(suns)
      }else {
        // 子菜单和菜单相等
        if (item.sonName?.trim() == suns.menuName?.trim()) {
          // 有相同等级
          const isAdd = lists.some((o) => o.menuName?.trim() == suns.menuName?.trim());
          if(!isAdd){
            let obj2 = {
              menuName: suns.menuName?.trim(),
              level: Number(suns.level) - 1,
              children: [suns],
            }
            lists.push(obj2)
          }
        } else {
          // 有子节点递归
          if(item.children?.length) {
            deep_left_menu(item.children, suns)
          }
        }
      }
    });
  }
  return lists;
}

/**
 * 生成菜单
 * @param {*} menu 每个.doc.js文件数据
 * @param {*} path 文件路径
 */
const add_left_menu = () =>{
    const sortdata = menu_data.sort((a, b)=>a.level-b.level)
    left_menu = sortdata.reduce((prve, cur) => {
      if (!cur.sonName) {
        prve.push(cur)
      } else {
        // 处理菜单数据
        deep_left_menu(prve, cur)
      }
      return prve;
    }, [])
}
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
  if(obj.leftmenu){
    // leftmenu添加path路径
    menu_data.push({...obj.leftmenu, path: key})
  }
  file_path_arr.push(add_obj.file_path);

  if(! all_doc_obj[key]){
    all_doc_obj[key]=[]
  }
  if (Array.isArray(obj)) {
    obj.map((x) => {
      let new_obj = {
        ...add_obj,
        ...x,
      };
      all_doc_arr.push(new_obj);
      all_doc_obj[key].push(new_obj);
    });
  } else {
    let new_obj = {
      ...add_obj,
      ...obj,
    };
    all_doc_arr.push(new_obj);
 

    all_doc_obj[key].push(new_obj);
  }
};
/**
 * 提取 目录内的  doc 文件内容
 */
const extract_doc = (dir) => {
  // let all_doc_paths = getAllFile(path.join(__dirname, dir));
  // 所有文件路径
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
setTimeout(()=>{
  add_left_menu()
}, 5000)
// 转换提取  category
const extract_category = () => {
  all_doc_arr.map((x) => {});
};
statistics ={
  len: file_path_arr.length
}
let version = Date.now();
let write_folder = "./job/output/doc";
 

 
//确保配置 输出目录存在 
ensure_write_folder_exist(write_folder)



setTimeout(() => {
  console.log(" ");
  console.log(" ");
  console.log(" ");
  console.log("写入");
  console.log(" ");
  console.log(" ");
  fs.writeFile(
    write_folder + "/arr.json",
    JSON.stringify(all_doc_arr, null, 4),
    "utf8",
    (err) => {
      if (err) {  console.log("arr 写入出错 ", err) };
      console.log('arr 写入 完成');
    }
  );
  fs.writeFile(
    write_folder + "/obj.json",
    JSON.stringify(all_doc_obj, null, 4),
    "utf8",
    (err) => {
      if (err) { console.log("obj 写入出错", err)};
      console.log('obj 写入 完成');
    }
  );
  fs.writeFile(
    write_folder + "/key.json",
    JSON.stringify(Object.keys(all_doc_obj), null, 4),
    "utf8",
    (err) => {
      if (err){  console.log("key 写入出错", err)};
      console.log('key 写入 完成');
    }
  );
  fs.writeFile(
    write_folder + "/file_path_arr.json",
    JSON.stringify(file_path_arr, null, 4),
    "utf8",
    (err) => {
      if (err){  console.log("file_path 写入出错", err)};
      console.log('file_path 写入 完成');
    }
  );
  fs.writeFile(
    write_folder + "/statistics.json",
    JSON.stringify(statistics, null, 4),
    "utf8",
    (err) => {
      if (err){  console.log("statistics 写入出错", err)};
      console.log('statistics 写入 完成');
    }
  );
  fs.writeFile(
    write_folder + "/left_menu.json",
    JSON.stringify(left_menu, null, 4),
    "utf8",
    (err) => {
      if (err){  console.log("left_menu 写入出错", err)};
      console.log('left_menu 写入 完成');
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
