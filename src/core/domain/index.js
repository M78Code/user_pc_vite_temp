import { ls, ss } from "../utils/web-storage";
import STANDARD_KEY from "../standard-key";
// import config,{SetDomains} from 'xxx' //配置文件暂时没有写
//domains应该直接是 域名 不能根据环境判断 判断的话也是在 config里
const config = { domains: [], gr: "" };

/**
 * 去掉 api 参数 reload
 */
function force_current_api_flow_use_oss_file_api_reload() {
  let url_search = new URLSearchParams(location.search);
  //  重置 rdm 到最新的 时间戳  ，没有就 相当于新设置 ，有就相当于重置
  url_search.set("rdm", new Date().getTime());
  // 删除  api
  url_search.delete("api");
  console.log("new url 1", new URL(location.href));
  // 旧的哈希  兼容   #/home?rdm=1660636891118 这种形式处理
  let old_hash = location.hash;
  // 新的 哈希
  let new_hash = "";
  if (!old_hash) {
    new_hash = "";
  } else {
    if (old_hash.includes("?")) {
      new_hash = old_hash.split("?")[0];
    } else {
      // '#/home'
      new_hash = old_hash;
    }
  }
  // 新的 搜索参数
  let new_search = url_search.toString();
  // 新的 url
  let new_url = location.origin + "?" + new_search + new_hash;
  console.log("new_url-", new_url);
  // 这里因为版本不一致 ，无论如何都重定向 刷新
  location.replace(new_url);
}
/**
 * 获取最新的http domain
 * @param {oss} 补偿刷新逻辑 第一次加载方法
 */
export function GetHttpDomain(oss) {
  // 新逻辑这里只会有一个
  let api_domains = config.domain;
  let api_domain = api_domains[0];
  // if (window.env.NODE_ENV != "development") {
  //   this.axios_instance.defaults.baseURL = api_domain;
  // }
  // 38913	一般	高	缺陷	【日常】【生产】【PC】Y0商户偶现关机/重启后，首次跳转我们场馆，页面展示异常，显示网络不给力
  //  这个bug 产生原因是 safari 浏览器 强缓存页面导致 。 页面走不了 域名判定流程 ，在挂机启动的时候，初始化没有走域名判定流程
  // 如果没有最快的最优域名 也没有 弹出 token失效的 弹窗,直接走到了这里的 主程序请求流程
  if (!api_domain) {
    //session 缓存的 是否 因为设置页面API 域名错误 刷新过
    let has_reload = ss.get("set_root_domain_error_force_reload");
    //不清楚，页面强缓存，唤醒的时候 session 是否还存在
    if (!has_reload) {
      // 只做一次尝试  ，直接走OSS 文件 流程  ，刷新页面  ，不能多次 避免 异常情况下 无限刷新
      ss.get("set_root_domain_error_force_reload", "1");
      force_current_api_flow_use_oss_file_api_reload();
    } else {
      //如果有缓存过刷新
      //session 缓存 有东西 缓存说刷新过
      // session  缓存的 最快域名
      let best_api = ss.get("best_api") || "";
      let gr = ss.get("gr");
      let domain_api = GetSavaDomainApi();
      if (!gr) {
        gr = config.gr || "COMMON";
        ss.set("gr", gr);
      }
      if (best_api) {
        // 缓存   有  最快域名
        setDevtoolsHook;
        window.env.config.domain[window.env.config.current_env] = [best_api];
        api_domain = best_api;
      } else {
        // 缓存   无  最快域名
        // 从本地 存储内找一条数据先用 ， 后面即便 是分组不对 ，会走到纠错流程
        let find_obj = null;
        if (domain_api.length > 0) {
          find_obj = domain_api.find((x) => x.group == gr);
        }
        if (find_obj) {
          //如果找到 数据
          api_domain = find_obj["api"];

          //SetDomains
          window.env.config.domain[window.env.config.current_env] = [
            api_domain,
          ];
        } else {
          // 什么都没有的 补偿刷新一次  或者两次
          if (has_reload < 4) {
            ss.set("set_root_domain_error_force_reload", has_reload + 1);
            force_current_api_flow_use_oss_file_api_reload();
          } else {
            // 正常的走到 释放页面 的步骤 ，就是 wifi 图标 必须刷新页面才行的 那种
          }
        }
      }
    }
  } else {
    // 有 api_domain
    // 去除垃圾数据  ，避免长时间 挂机或者 safari 的 强缓存机制 再次影响到 页面 流程
    ss.remove("set_root_domain_error_force_reload");
  }
  return api_domain;
}
/**
 * @description: 获取持久化localStorage中的数据
 * @return {Array} 返回array类型数据
 */
export function GetSavaDomainApi() {
  try {
    let key = STANDARD_KEY.domain_api_key;
    console.log("key = domain_api01--", key);
    let gr = ss.get(STANDARD_KEY.gr);
    console.log('sessionStorage.getItem("gr")---', gr);
    // 获取持久化数据
    let ret = ls.get(key, []);
    console.log("获取持久化数据------", str);
    return ret;
  } catch (error) {
    console.error("GetSavaDomainApi", error);
    return [];
  }
}
