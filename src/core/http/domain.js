/*
 * @Author         : lane jstylane@itcom888.com
 * @Date           : 2023-07-28 14:25:33
 * @LastEditors: pmtymalick pmtymalick
 * @LastEditTime: 2023-08-04 15:55:34
 * @FilePath       : \user-pc-vite\src\core\domain\domain.js
 * @Description    : 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * 所有域名检测逻辑(本地域名检测,oss网络url检测)
 *
 *
 * api域名源头有四个位置：
 *  1. 页面url 内 api 参数 ，(不全,url长度限制 ，这里不会返回全部)
 *  2. 用户本地历史域名缓存
 *  3. oss 文件，（不建议合并的 ），但是后台可能 getuserinfo 内的 oss 内 无数据的 。
 *  4. getuserinfo 接口 内的  oss  参数下
 *
 * 注意：
 *  1.url内   可能无api  参数，（历史三方对接遗留原因）
 *  2.所有api  参数必须   挂载分组信息
 *  3.用户当前的 缓存的   url 必须 分组过滤。
 *
 *
 *
 * 大前提说明：
 *   1.域名分组之前：全部商户，全部地区 共用oss 内的配置 无差异
 *   2.域名分组之后：域名会根据 商户，地区 ，vip 等不同条件 返回不同的 api域名数组， 每个用户真正可用的域名数组 其实在 getuserinfo 接口 内的  oss  参数下
 *   3.无论流程一还是流程二，最终的归宿都是  getuserinfo 接口 内的  oss  参数下 的 api 数组
 *   4.只有使用 getuserinfo 接口 内的  oss  参数下 的 api 数组 才能保证前端页面 api 的高可用
 *     这里要尽量舍弃oss文件内的域名，避免全部走公共域名，被打 ，但是需要做开关，未来 oss内的域名可能是质量较差的域名。取舍需要加上开关
 *   5. 本地之前的 同分组的域名缓存 是否 和新 getuserinfo 内返回的 合并 ，需要做开关 。建议不合并 。但是总数按照加入时间 保留五个就可以（接口内一般最多返回四个）
 *
 * 流程：
 *    一：url 内 有api 参数 和 分组参数 ，并且api 参数解析后长度不为0   use_url_api
 *    二：url 内 无 api gr 此类信息      use_oss_file_api
 *
 * 流程一：url 内 有api 参数 和 分组参数 ，并且api 参数解析后长度不为0    use_url_api
 *        1. api 数组 直接 时间戳接口检测 或者直接  getuserinfo 来同时 做检测和拉取配置数据
 *        2. 如果第一步采用时间戳接口检测 第二步 就调用 getuserinfo 拉取配置
 *        3. 第一步和第二步已经拿到可用的 一个api 域名 ，这里记得 第一步和第二步 不关心排序 。  此api 域名直接走主流程去 发起菜单 列表等 请求
 *        4. 在页面闲时，也就是菜单列表接口都回来了，页面数据渲染出来了之后。也可以直接延迟10秒左右去走后面的 公共逻辑。
 *
 *
 * 流程二：url 内 无 api gr 此类信息  use_oss_file_api
 *        1. 读取代码内的 OSS配置，拉取 OSS配置文件 ，取出对应的 api 域名数组
 *        2. 第一步数组进行   时间戳接口检测 拿到第一个可用的api ，（不建议 使用 getuserinfo  因为接口比较慢 ，也会造成服务器性能问题）      此api 域名直接走主流程去 发起菜单 列表等 请求
 *        3. 在页面闲时，也就是菜单列表接口都回来了，页面数据渲染出来了之后。也可以直接延迟10秒左右去走后面的 公共逻辑。
 *
 *
 *
 * 流程一和流程二公共逻辑：
 *       1. 根据配置 ，合并  【【本地缓存  ，oss文件， getuserinfo 接口下的oss 配置】】 去重  计算 前端本地api 域名池数组
 *       2. 第一步的域名池数组 。循环 发起时间戳接口 。进行排序操作 。仅仅排序。可以不切换。也可以切换。看速度差异大小进行切换也行
 *       3.当页面接口异常 换api接口 从排序内取
 *       4.（可能页面刷新，或者其他）当新的 getuserinfo接口 回来 ，如果里面的 oss 内的 api 和 本地存的不一样不是 同分组 包含关系 ，需要增补 进去
 *       4.这个 有一个灾难点： 长期本地的 api 不清理 ，会出现 排序的时候并发几十个发起，对服务器压力比较大 。 因此如果合并本地数据 需要保留长度一定
 *
 *
 *
 * 差异点：
 * 以前的 OSS 逻辑内 oss 文件地址有多个 ，现在只有一个前端代码内的，必定存在
 * 以前api域名集中：  流程是 排序 和 择优第一个  在一起
 * 现在api域名分散：  流程是 先找到一个能用的  就去用 就行  ， 延迟 十秒去排序 准备下次使用 ，同时 更新 可用域名数组
 *
 *
 * H5，PC 全流程一样的 除了几个参数 不一样，以及H5 需要立即弹出登录失效 ，其实没必要
 *
 */

import axios from "axios";

 
import { SessionStorage ,LocalStorage} from "src/output/module/constant-utils-common.js"
import UserCtr from "src/core/user-config/user-ctr.js";
 import { format_api_to_obj } from "src/core/format/common/index.js"
import STANDARD_KEY from "src/core/standard-key";
import { isFunction } from "lodash";
import { pako_pb } from "../pb-decode/index";
// 域名计算逻辑所用的 单独的 axios 实例
const axios_instance = axios.create();

//token键
const token_key = STANDARD_KEY.get("token");

// 域名计算结果
let DOMAIN_RESULT = {
  //gr
  gr: "COMMON",
  //最优 API
  first_one: "",
  //可用 的 api 数组
  useable_apis: [],
  //全量API 数组
  full_apis: [],
  // 用户信息接口返回
  getuserinfo_res: null,
  //live_domains 视频页面地址
  live_domains: [],
  // 图片域名
  img_domains: [],
};

// 域名计算  本地存错 挂载键
const DOMAIN_API_STORAGE_KEY = STANDARD_KEY.get("domain_api_01");
// 引入 当前 计算出的植入配置

import BUILDIN_CONFIG from "app/job/output/env/index.js";
//当前目标环境
const { CURRENT_ENV, NODE_ENV, OSS_FILE_ARR, OSS_FILE_NAME, PROJECT_NAME } = BUILDIN_CONFIG;
// 判断是否PC项目
const IS_PC = PROJECT_NAME.includes('pc')

import lodash from "lodash";

import { useMittOn, MITT_TYPES } from "src/core/mitt/index.js";
class AllDomain {
  constructor() {
    BUILDIN_CONFIG.DOMAIN_RESULT = DOMAIN_RESULT;
    this.init_base_config();
  }
  /**
   * 初始化 最基础配置
   */
  init_base_config() {
    // 域名计算  本地存错 挂载键
    this.DOMAIN_API_STORAGE_KEY = DOMAIN_API_STORAGE_KEY;
    // getuserinfo接口 内的 oss  配置 内的 oss
    this.GETUSERINFO_OSS = {};
    // 合并 oss 文件内的 api配置 到 最终的 前端 本地 域名池子  开关
    this.MERGE_OSS_FILE_TO_LOCAL_API_POOL = true;
    // 合并 前端本地旧的   api配置 到 最终的 前端 本地 域名池子  开关
    this.MERGE_OLD_LOCAL_API_TO_LOCAL_API_POOL = true;
    //  getuserinfo  内的 oss 下的 api 数组 是强制的 必须 做为最基础数据 依据的  因此不提供开关。
    //  url 内的 api 参数内的数组  正常是  getuserinfo  内的 oss 下的 api 数组 的 子集 ，
    //  但是在用户试用期间， getuserinfo  内的 oss 下的 api 数组 可能 会变更，因此 理论上 每次页面主动或者被动调用 getuserinfo 都需要写入进来，存储到本地
    // 当前的 流程  ： 流程1   use_url_api 或者 流程2   use_oss_file_api
    this.current_api_flow = "";
    // 最大的 本地域名池子数量上限
    this.LOCAL_API_POOL_MAX = 10;
    // 记录到本地域名池子内的api 的过期时间，超过此时间的api 需要 在 再次刷新本地 域名池的时候 清理掉
    this.LOCAL_API_EXPIRATION_TIME = 30 * 24 * 60 * 1000;
    // 每次不论是 如何去检测  API 接口的 ，只要那个API 可用 ，就刷新这个 API 的创建时间 到当时的检测通过时间，相当于加长这个域名在域名池的理论存活时间
    // 当 走 url 内 api 流程 出错是否 去掉api 参数并强制刷新页面去 走  oss 文件流程，也可以不刷新，静默切换流程
    this.force_reload_to_use_oss_file_api = false;
    //  H5,PC 差异点
    //oss 文件内 视频播放地址
    this.live_domains_oss_path_file = `live_domains.${IS_PC ? 'pc' : 'h5'}`;
    //api  内 视频播放地址
    this.live_domains_oss_path_api = `live_${IS_PC ? 'pc' : 'h5'}`;
  }
  /**
   * @description: 构造函数
   * @return {undefined} callback 回调方法通知   {type:'domain_api',status:0 ,list:[]} status字段:0-初始状态 1-已经发现最快的api域名并已经设置,  2-已经切换到最新的可用域名, 3-切换时发现没有域名可用
   */
  create(callback) {
    //  初始化原始数据
    this.init();
    // 获取本地配置的oss url地址
    this.oss_urls = this.get_oss_urls();
    // 解密使用的key
    this.DECRYPT_KEY = CryptoJS.enc.Utf8.parse("panda1234_1234ob");
    // 解密url 内 api 字段使用的 key
    this.DECRYPT_KEY_URL_API = CryptoJS.enc.Utf8.parse("OBTY20220712OBTY");
    // 回调方法参数: {type:'domain_api',status:0 ,list:[]}
    // status字段:0-初始状态 1-首次进入: 发现最快的api域名并已经设置,  2-切换域名时 :已经切换到最新的可用域名, 3- 切换域名时:切换时发现没有域名可用
    this.callback = callback;
  }

  /**
   * @description: api参数域名加密(专用)
   * @param {*} api 加密字符串
   * @return {*}  明码字符串
   */
  api_encrypt(api_str) {
    let res = "";
    if (api_str) {
      var encrypt = CryptoJS.AES.encrypt(api_str, this.DECRYPT_KEY_URL_API, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      });
      res = encrypt.toString();
    }
    return res;
  }
  /**
   * @description: 初始化数据
   */
  init() {
    // 是否首次加载页面
    this.loaded = false;
    // url 内的api 解析后的 数据
    this.url_api = null;
    // 最快的oss url地址返回的数据
    this.oss_file_content = null;
    // oss file 文件内的 api 配置
    this.oss_file_api = [];
    //  当前计算后的前端本地 api 池子
    this.local_api_pool = [];
  }
  /**
   * @description: 运行检测功能
   */
  run() {
    // 前置 几道工序
    // 当前的 流程  ： 流程1   use_url_api 或者 流程2   use_oss_file_api
    this.compute_current_api_flow();
    if (this.current_api_flow == "use_url_api") {
      // 流程 1 开始
      this.begin_process_when_use_url_api();
    } else {
      // 流程 2 开始
      this.begin_process_when_use_oss_file_api();
    }
    // 检查纠正 分组信息
    setTimeout(() => {
      this.check_and_correct_local_api_pool_group();
    }, 30000);
  }

  /**
   *    getuserinfo接口 内的 oss  配置 内的 oss   写入 方法
   */
  set_getuserinfo_oss(obj = { api: [], img:[] ,live_h5:'',live_pc:''}) {
    if (Array.isArray(obj.api) && obj.api.length > 0) {
      this.GETUSERINFO_OSS = obj;
      // 计算当前的 域名池子
      this.compute_current_local_api_pool();
    }
    if(Array.isArray(obj.img)&& obj.img.length>0){
    	//更新图片域名
      BUILDIN_CONFIG.DOMAIN_RESULT.img_domains = obj.img;
    }
    if(window.BUILDIN_CONFIG.IS_PC){
      if(obj.live_pc){
        // //更新视频项目域名
        window.BUILDIN_CONFIG.DOMAIN_RESULT.live_domains[0] = obj.live_pc;
      }
    } else {
      if(obj.live_h5){
        //更新视频项目域名
        window.BUILDIN_CONFIG.DOMAIN_RESULT.live_domains[0] = obj.live_h5;
      }
    }
    // window.BUILDIN_CONFIG.DOMAIN_RESULT.live_domains[0]
  }

  /**
   * 计算当前流程
   *  流程1   use_url_api    首次进入
   *  流程2   use_oss_file_api    首次进入
   */
  compute_current_api_flow() {
    // 当前的 流程  ：
    let current_api_flow = "use_url_api";
    let unDecrypt = "";
    const url_search = SEARCH_PARAMS.init_param;
    let api = url_search.get("api");
    //   console.log('location.href-',location.href);
    //   console.log('api------------',api);
    //  console.log('api------------',  api.replace(/\s/g,'+'));
    //   console.log('url_search----',url_search);
    //   console.log('url_search---2222-', new URL(location));
    if (!api) {
      // 没有从地址获取api返回
      current_api_flow = "use_oss_file_api";
    } else {
      api = api.replace(/\s/g, "+");
      // const api = 'vEtkQtmX6wF8fAGV5b4UDx2mPRca2zMHLMj/YELjSwxjyhV5t0ifZDD6I0iwkpzJ'
      unDecrypt = this.get_oss_decrypt_str(api, this.DECRYPT_KEY_URL_API);
      // console.log("unDecrypt----------1", unDecrypt);
      if (typeof unDecrypt === "string" && unDecrypt) {
        unDecrypt = unDecrypt
          .split(",")
          .map((x) => x.trim())
          .filter((x) => x.startsWith("http://") || x.startsWith("https://"));
      }
      if (!Array.isArray(unDecrypt) || unDecrypt.length === 0) {
        current_api_flow = "use_oss_file_api";
      } else {
        current_api_flow = "use_url_api";
      }
      // console.log("unDecrypt----------2", JSON.stringify(unDecrypt));
    }
    // console.log('unDecrypt----------2', JSON.stringify(unDecrypt_f));
    this.current_api_flow = current_api_flow;
    this.url_api = unDecrypt;
  }
  /**
   * 流程一  url 内 有api 参数 和 分组参数 ，并且api 参数解析后长度不为0   use_url_api
   * 流程一    当 使用url 内 api 参数  计算一个可用的 api
   */
  begin_process_when_use_url_api() {
    let url_api = this.url_api || [];

    // 获取token
    let token = window.SEARCH_PARAMS.init_param.get('token') || SessionStorage.get(token_key);

    // 并发请求
    let reqs = [];
    let pb = 'PB'
    try {
      if(window.SEARCH_PARAMS.init_param.get('pb')){
        pb='';
      }
    } catch (error) {
      console.error(error);
    }
    url_api.map((item) =>
      reqs.push(
        axios_instance.get(`${item}/yewu12/user/getUserInfo${pb}`, {
          params: { token: token },
          timeout: 6000,
          headers: {
            requestId: token,
          },
        })
      )
    );
    Promise.any(reqs)
      .then((res) => {
        // 只要有一个   请求成功
        // console.log(" // 只要有一个   请求成功----", res);
        if (lodash.get(res, "data.code") == "0000000") {
          //当流程一： 当 使用url 内 api 参数  计算一个可用的 api   计算出来之后 后置进程
          try {
            let data_temp = pako_pb.unzip_data(lodash.get(res, "data.data"));
            if(data_temp){
              res.data.data = data_temp;
            }
          } catch (error) {
            console.error(error);
          }
          //保存 用户数据
          res.time_upd = new Date().getTime();
          BUILDIN_CONFIG.DOMAIN_RESULT.getuserinfo_res = res;
          this.begin_process_when_use_url_api_after_process(res);
        } else {
          // 强制 走 oss 文件逻辑
          this.force_current_api_flow_to_use_oss_file_api();
        }
      })
      .catch((error) => {
        // 所有  全部请求失败
        // console.log(error);
        // 需要 重定向  url  页面重新刷新  去掉  api 参数
        //去掉 api 参数 reload
        // 强制 走 oss 文件逻辑
        this.force_current_api_flow_to_use_oss_file_api();
      });
  }
  /**
   *    强制 走 oss 文件逻辑
   */
  force_current_api_flow_to_use_oss_file_api() {
    // 强制刷新 去 变更流程 保证流程正确
    if (this.force_reload_to_use_oss_file_api) {
      // 缺点 ： 页面刷了 ，loading 加长，而且如果页面显示出来之后 ，内部触发刷新 ，这里还是 一样长时间 ，双倍
      // 优点 ： 后面刷新单倍时长
      this.force_current_api_flow_use_oss_file_api_reload();
    } else {
      // 缺点：每次刷新 ，都要走一次报错，甚至多次 报错后 才能走到正规 ， 设置的 axios_instance  超时 10 秒
      //
      this.force_current_api_flow_use_oss_file_api_no_reload();
    }
  }
  /**
   * 去掉 api 参数 reload
   */
  force_current_api_flow_use_oss_file_api_reload() {
    let url_search = SEARCH_PARAMS.init_param;
    //  重置 rdm 到最新的 时间戳  ，没有就 相当于新设置 ，有就相当于重置
    url_search.set("rdm", new Date().getTime());
    // 删除  api
    url_search.delete("api");
    // console.log("new url 1", new URL(location.href));
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
    // console.log("new_url-", new_url);
    // 这里因为版本不一致 ，无论如何都重定向 刷新
    location.replace(new_url);
  }
  /**
   * 虽然 url 有api 字段 ,但是 如果 getuserinfo 接口不返回 oss 字段  强制 走  oss 文件 逻辑
   */
  force_current_api_flow_use_oss_file_api_no_reload() {
    // url 内的api 解析后的 数据
    this.url_api = [];
    // 当前流程
    this.current_api_flow = "use_oss_file_api";
    // 流程 2 开始
    this.begin_process_when_use_oss_file_api();
  }
  /***
   *
   * 当流程一： 当 使用url 内 api 参数  计算一个可用的 api   计算出来之后 后置进程
   *
   */
  begin_process_when_use_url_api_after_process(res) {
    // 确保分组信息 赋值
    let gr = (lodash.get(res, "data.data.gr") || "").toUpperCase();
    BUILDIN_CONFIG.DOMAIN_RESULT.gr = gr;
    //OSS 对象
    let ossobj = lodash.get(res, "data.data.oss");
    // console.log("ossobj--------", ossobj);
    // 如果 有 api 但是拿不到 ossobj    ， 强制 走 oss 文件逻辑
    if (!ossobj) {
      this.force_current_api_flow_to_use_oss_file_api();
      return false;
    }
    // 第一步  拿到 可用api
    // 确保 ossobj .api 字段内  有包含 当前这个可用的  api
    let c_url = '';
    if(lodash.startsWith(res.config.url,'http')){
      c_url = new URL(res.config.url);
    } else{
      c_url = new URL(res.config.baseURL);
    }
    // console.log("c_url------", c_url);
    //当前这个可用的 api
    let use_api = c_url.origin;
    // 当前唯一 已知可用的 api
    let objapi = format_api_to_obj(use_api);
    // 确保初始化
    !ossobj.api && (ossobj.api = []);
    if (!Array.isArray(ossobj.api)) {
      ossobj.api = [];
    }
    //去空
    ossobj.api = ossobj.api.filter((x) => x);
    // 容错必须包含当前请求通的url
    // if( !ossobj.api.includes(use_api)){
    //   ossobj.api.push(use_api)
    // }
    ossobj.api = [...ossobj.api, ...this.url_api];
    // 同步最新域名到  全量API 数组

    BUILDIN_CONFIG.DOMAIN_RESULT.full_apis = lodash.uniq([
      ...ossobj.api,
      ...BUILDIN_CONFIG.DOMAIN_RESULT.full_apis,
    ]);
    // 第二步 设置   set_getuserinfo_oss
    this.set_getuserinfo_oss(ossobj);
    // 发现可用的域名的逻辑处理
    this.find_use_apis_event_first_one(objapi, DOMAIN_API_STORAGE_KEY);
    // 图片 以及 静态域名 分流处理
    this.begin_process_when_use_url_api_after_process_handle_other_domain(
      ossobj
    );
    // 补充 oss file 进来
    this.begin_process_when_use_oss_file_api();
  }
  /**
   *
   * 当流程一： 当 使用url 内 api 参数  计算一个可用的 api   计算出来之后 后置进程
   *
   * 处理除了api  之外的域名
   */
  begin_process_when_use_url_api_after_process_handle_other_domain(
    oss_data = {}
  ) {
    // api: [null]
    // img: ["http://sit-image.sportxxxkd1.com"]
    // live_h5: "http://testliveh5.sportxxx13ky.com"
    // live_pc: "http://testlivepc.sportxxx13ky.com"
    // loginUrl: "http://test-user-pc-bw4.sportxxxifbdxm2.com/?token=5cc56f7830e569fe3a815b6ffa50634cf32af09a&gr=common&tm=1&lg=zh&mk=EU&stm=blue"
    // loginUrlArr: [,…]
    //解密 img
    let img = lodash.get(oss_data, "img");
    // //解密 static
    // let static_src = lodash.get(oss_data, "static",[]);
    //解密 live_domains
    let live_domains = oss_data[this.live_domains_oss_path_api];

    // 设置live_domains
    if (live_domains) {
      BUILDIN_CONFIG.DOMAIN_RESULT.live_domains = [live_domains];
    }
    // 设置oss_img_domains
    if (img && img.length) {
      this.check_img_domain(img);
    }
  }
  /**
   *
   * 流程二： url 内 无 api gr 此类信息  use_oss_file_api
   * 走 oss 逻辑
   *
   */
  begin_process_when_use_oss_file_api() {
    // 当前 oss  完整 地址
    let oss_url = this.oss_urls[0];
    // 获取网络数据
    window.SEARCH_PARAMS.has_token && axios_instance
      .get(oss_url, { params: { t: new Date().getTime() }, timeout: 5000 })
      .then((res) => {
        //此处 因为  oss 文件在前端代码内部 ，所以 只要域名能访问 ，这个文件必定能访问
        if (lodash.isPlainObject(res.data)) {
          // 成功获取到oss文件数据
          let obj = res.data;
          if (obj) {
            this.jiexi_oss_file(obj);
          } else {
            this.jixi_build_in_current_env_build_in_oss();
          }
        } else {
          // console.error("解析oss数据失败：lodash.isPlainObject(res.data)");
          this.jixi_build_in_current_env_build_in_oss();
        }
      })
      .catch((err) => {
        // console.log("oss数据失败地址:" + oss_url);
        //直接  错误 界面遮罩
        console.error(err);
        this.jixi_build_in_current_env_build_in_oss();
      });
  }
  /**
   * 解析 html 内打包进来的  CURRENT_ENV_BUILD_IN_OSS
   */
  jixi_build_in_current_env_build_in_oss() {
    if (!window.CURRENT_ENV_BUILD_IN_OSS) {
      return false;
    }
    try {
      let build_in_file = JSON.parse(
        decodeURIComponent(window.CURRENT_ENV_BUILD_IN_OSS)
      );
      if (!build_in_file) {
        return false;
      }
      this.jiexi_oss_file(build_in_file);
    } catch (error) {
      console.error(
        " 解析 html 内打包进来的  CURRENT_ENV_BUILD_IN_OSS---出现错误"
      );

      this.compute_current_local_api_pool();

      // 如果当时 的 流程是 ： 流程 1 走通了 附带 去集成备份oss 文件配置到前端 这里 不需要去 找可用域名
      // 此时已经有可用域名了
      if (this.current_api_flow == "use_url_api") {
      } else {
        // 如果当时 的 流程是 ： 流程 2  ,此时 是没有可用域名的  ，这里需要去找 可用域名
        //这里开始 找到一个可用域名  ，不做排序  ，使用 时间戳 接口
        this.compute_api_domain_firstone_by_currentTimeMillis();
      }
    }
  }
  /**
   * 解析 OSS 文件返回体内容
   * @param {*} res
   */
  jiexi_oss_file(obj) {
    // 获取解密后的明码数据
    this.get_decrypt_oss_data(obj);
    // oss url地址返回的数据
    this.oss_file_content = obj;
    // 设置 oss文件中的数据到全局配置文件中
    this.set_all_config_from_oss_file_data_2(obj);
    // 全局变量可视化设置
    window.BUILDIN_CONFIG.OSS_JSON = obj;
  }

  /**
   * @description: 获取持久化localStorage中的数据
   * @param {string} key localStorage key值
   * @return {object} 返回Json类型数据
   */
  get_save_domain_api() {
    let key = this.DOMAIN_API_STORAGE_KEY;
    // console.log("key = this.DOMAIN_API_STORAGE_KEY--", key);
    let gr = SessionStorage.get("gr");
    // console.log('sessionStorage.getItem("gr")---', gr);
    // 获取持久化数据
    return LocalStorage.get(key, []);
  }

  /**
   *
   *  根据流程计算本地api域名池子 三种
   *  逻辑 每次都走 有冗余，但是 事实上 调度次数很少 无所谓
   */
  compute_current_local_api_pool() {
    // console.log("this.GETUSERINFO_OSS-----", this.GETUSERINFO_OSS);
    //   getuserinfo 接口下的oss 配置
    if (!this.GETUSERINFO_OSS) {
      this.GETUSERINFO_OSS = { api: [] };
    }
    if (!this.GETUSERINFO_OSS.api) {
      this.GETUSERINFO_OSS.api = [];
    }
    //  前端本地旧的   api配置
    let old_local_api = this.get_save_domain_api();

    let getuserinfo_oss_api = this.GETUSERINFO_OSS.api;
    //  oss 文件
    let oss_file_api = this.oss_file_api;
    // 认为新进来的数据
    // let new_get_api = [...getuserinfo_oss_api, ...oss_file_api];
    // new_get_api = lodash.uniq(new_get_api);
    // 变形后 放入的数组
    let new_get_api_obj_arr = [];
    // 变形
    // new_get_api.map((x) => {
    //   new_get_api_obj_arr.push(format_api_to_obj(x));
    // });

    getuserinfo_oss_api && getuserinfo_oss_api.map((x) => {
      new_get_api_obj_arr.push(format_api_to_obj(x, this.GETUSERINFO_OSS.gr));
    });
    oss_file_api && oss_file_api.map((x) => {
      new_get_api_obj_arr.push(format_api_to_obj(x));
    });
    new_get_api_obj_arr = lodash.uniqBy(new_get_api_obj_arr, "api");
    //   前端本地旧的   api配置  删除新的 认为新进来的数据
    // console.log("getuserinfo_oss_api-----", getuserinfo_oss_api);
    // console.log("oss_file_api-----", oss_file_api);
    // console.log("old_local_api-----", old_local_api);
    // console.log("new_get_api_obj_arr---------", new_get_api_obj_arr);
    //把认为新进来的 里面的  事实上本地已存在的 删除掉，留下真正新增的
    let real_new_api =
      lodash.pullAllBy(new_get_api_obj_arr, old_local_api, "api") || [];
    // console.log("real_new_api----------", real_new_api);
    // 最终的 api 数组
    let final_api_pool = [...real_new_api, ...old_local_api];
    // console.log("final_api_pool---------", final_api_pool);
    //  删除 旧的
    // 当前时间
    let ct = new Date().getTime();
    // 时间差
    let sc = this.LOCAL_API_EXPIRATION_TIME;
    //  当前计算后的前端本地 api 池子
    let local_api_pool = [];
    final_api_pool.map((x) => {
      if (!x.update_time) {
        x.update_time = ct;
      }
      delete x.type;
      if (ct - x.update_time < sc) {
        local_api_pool.push(x);
      }
    });
    // 排序，按照更新时间 从大到小排列 ，新的在前，旧的在后
    local_api_pool.sort((a, b) => b.update_time - a.update_time);
    // console.log("local_api_pool---------", local_api_pool);
    let cgr = BUILDIN_CONFIG.DOMAIN_RESULT.gr;
    // 当前分组的 api
    let local_api_pool_cg = local_api_pool.filter((x) => x.group == cgr);
    //非当前分组的 api
    let local_api_pool_not_cg = local_api_pool.filter((x) => x.group != cgr);

    // 截取 最大的 本地域名池子数量上限
    if (local_api_pool_cg.length > this.LOCAL_API_POOL_MAX) {
      local_api_pool_cg.splice(this.LOCAL_API_POOL_MAX);
    }
    //重新组合 本地域名池
    local_api_pool = [...local_api_pool_cg, ...local_api_pool_not_cg];

    // 本地开发 或者 内部导航进来的 维护 时间增加内部域名
    local_api_pool = this.add_neibu_domain(local_api_pool);

    // 赋值
    this.local_api_pool = lodash.uniqBy(local_api_pool, "api");
    //保存数据到本地
    this.set_sava_json_key(this.local_api_pool);
  }
  // 本地开发 或者 内部导航进来的 维护 时间增加内部域名
  add_neibu_domain(local_api_pool = []) {
    //是否需要添加 维护域名
    let need_add = false;
    //本地开发
    if (NODE_ENV == "development") {
      need_add = true;
    } else {
      //线上环境
      //非生产环境不用处理
      if (CURRENT_ENV != "idc_online") {
        need_add = false;
      } else {
        // 线上生产环境
        if (location.href.includes("env=line1")) {
          //  内部错测试
          need_add = true;
        } else {
          // 非内部错测试 不处理
          need_add = false;
        }
      }
    }
    // 不需要 需要添加 维护域名
    if (!need_add) {
      return local_api_pool;
    }

    // 生产环境 附加内部测试域名
    let obj = {
      COMMON: "https://api-c.sportxxx1zx.com",
      Y: "https://api-y.sportxxx1zx.com",
      S: "https://api-s.sportxxx1zx.com",
      B: "https://api-b.sportxxx1zx.com",
    };
    //过滤掉 内测 域名
    let arr = local_api_pool.filter((x) => !x.api.includes(".sportxxx1zx.com"));
    if (CURRENT_ENV == "idc_online") {
      for (let gr in obj) {
        // console.log(gr);
        // 增加内测域名
        arr.unshift(format_api_to_obj(obj[gr], gr));
      }
    }
    return arr;
  }

  /**
   * @description: 字符串解密函数
   * @param {*} word 加密字符串
   * @return {*}  明码字符串
   */
  get_oss_decrypt_str(word, DECRYPT_KEY) {
    let ret = "";
    // console.log("word", word);
    // console.log(word.includes(" "));
    // console.log("DECRYPT_KEY", DECRYPT_KEY);
    if (word) {
      try {
        // 解密
        var decrypt = CryptoJS.AES.decrypt(
          word,
          DECRYPT_KEY || this.DECRYPT_KEY,
          { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }
        );
        // 转字符串
        ret = CryptoJS.enc.Utf8.stringify(decrypt).toString();
        // console.log("转字符串-", ret);
        // 去除左右空格
        ret = ret.replace(/(^\s*)|(\s*$)/g, "");
        // console.log("转字符串-", ret);
        // 删除结尾的/
        if (ret && ret[ret.length - 1] == "/") {
          ret = ret.substr(0, ret.length - 1);
        }
      } catch (error) {
        console.error("get_oss_decrypt_str:", error);
      }
    }
    return ret;
  }
  /**
   * @description: 解密数组中的加密数据,并进行赋值操作(获取解密后的信息)
   * @param {*} obj
   * @return {*}
   */
  get_oss_decrypt_obj(obj) {
    if (lodash.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        // 解密数据,重新设置数据
        obj[i] = this.get_oss_decrypt_str(obj[i]);
      }
    } else if (lodash.isObject(obj)) {
      for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
          // 解密数据,重新设置数据
          obj[key] = this.get_oss_decrypt_str(obj[key]);
        }
      }
    }
  }
  /**
   * @description: 获取oss文件中的明码数据
   * @param {*} data oss文件加密数据
   * @return {*} oss文件中的明码数据
   */
  get_decrypt_oss_data(data) {
    if (data) {
      //解密 img ,  正确结构：["xsxsax"]
      let img = lodash.get(data, "img");
      if (lodash.isArray(img) && img[0] && lodash.isString(img[0])) {
        this.get_oss_decrypt_obj(img);
      } else {
        data["img"] = [];
      }
      //解密 topic ,  正确结构：["xsxsax"]
      let topic = lodash.get(data, "topic")
      if(lodash.isArray(topic)&&topic[0]&&lodash.isString( topic[0])) { this.get_oss_decrypt_obj(topic);}else{
        data["topic"]=[]
      }
      //解密 static , 正确结构：["xsxsax"]
      let stc = lodash.get(data, "static");
      if (lodash.isArray(stc) && stc[0] && lodash.isString(stc[0])) {
        this.get_oss_decrypt_obj(stc);
      } else {
        data["static"] = [];
      }

      //解密 live_domains ,  正确结构：{pc:'xsaxsax'}

      let lds = lodash.get(data, "live_domains");
      if (lodash.isPlainObject(lds) && lds) {
        this.get_oss_decrypt_obj(lds);
      } else {
        data["live_domains"] = {};
      }

      for (const key_ in data) {
        if (key_ && key_.indexOf("GA") == 0) {
          //解密 GA*.api   ,  正确结构：["xsxsax"]
          let api = lodash.get(data, key_ + ".api");
          if (lodash.isArray(api) && api[0] && lodash.isString(api[0])) {
            this.get_oss_decrypt_obj(api);
          } else {
            lodash.set(data, key_ + ".api", []);
          }
        }
      }
    }
  }
  /**
   * @description: 设置oss文件中的数据到全局配置文件中
   * @param {*} data oss文件数据
   * @return {*}
   */
  set_all_config_from_oss_file_data_2(oss_data) {
    //解密 img
    let img = lodash.get(oss_data, "img");
    //解密 static
    let static_src = lodash.get(oss_data, "static");
    //解密 live_domains
    let live_domains = lodash.get(oss_data, this.live_domains_oss_path_file);

    // 设置live_domains
    if (live_domains) {
      BUILDIN_CONFIG.DOMAIN_RESULT.live_domains = [live_domains];
    }
    // 设置oss_img_domains
    if (img && img.length) {
      this.check_img_domain(img);
    }
    // 设置topic
    let topic = lodash.get(oss_data, "topic");
    if (topic && topic.length) {
      this.toppic_fast(topic,(api_obj)=>{
        BUILDIN_CONFIG.TOPIC = api_obj;
      });
    }
    // 处理 api  逻辑
    this.set_all_config_from_oss_file_data_2_api(oss_data);
  }
  /**
   * @description: 设置oss文件中的数据到全局配置文件中  的  api  部分
   * @param {*} data oss文件数据
   * @return {*}
   */
  set_all_config_from_oss_file_data_2_api(oss_data) {
    //解密 api

    let api = [];
    // 设置商户分组api ，当前分组的 api
    let api_x = lodash.get(
      oss_data,
      "GA" + BUILDIN_CONFIG.DOMAIN_RESULT.gr + ".api"
    );
    // console.log("api:" + JSON.stringify(api));
    // console.log("api_x:" + JSON.stringify(api_x));
    // console.log("CURRENT_ENV:" + CURRENT_ENV);

    // 因为存在 对接接口 历史遗留 ，用户 进入界面可能无 gr 参数  但是  时间戳接口可以混合调用，getuserinfo 也一样能 混合调用
    if (!api_x) {
      let cgr = "COMMON";
      BUILDIN_CONFIG.DOMAIN_RESULT.gr = cgr;
      SessionStorage.set("gr", cgr);
      api_x = lodash.get(oss_data, "GA" + cgr + ".api") || [];
      // console.log(
      //   "分组信息错误,分组强制设置为COMMON组 api_x:" + JSON.stringify(api_x)
      // );
    }
    api = [...api_x];
    // 存到
    this.oss_file_api = api;
    // 计算当前的 域名池子
    this.compute_current_local_api_pool();
    // 如果当时 的 流程是 ： 流程 1 走通了 附带 去集成备份oss 文件配置到前端 这里 不需要去 找可用域名
    // 此时已经有可用域名了
    if (this.current_api_flow == "use_url_api") {
    } else {
      // 如果当时 的 流程是 ： 流程 2  ,此时 是没有可用域名的  ，这里需要去找 可用域名
      //这里开始 找到一个可用域名  ，不做排序  ，使用 时间戳 接口
      this.compute_api_domain_firstone_by_currentTimeMillis();
    }
  }
  /**
   * 找到 第一个可用的 api   去 进行 后续 页面逻辑
   * @param {*} api
   */
  async compute_api_domain_firstone_by_currentTimeMillis(check_group = false) {
    //当前分组的 api 域名
    let api = this.local_api_pool.filter(
      (x) => x.group == BUILDIN_CONFIG.DOMAIN_RESULT.gr
    );
    let check_ok = Array.isArray(api) && api.length > 0;
    console.log(
      "compute_api_domain_firstone_by_currentTimeMillis--",
      JSON.stringify(api)
    );
    if (!check_ok) {
      //补偿逻辑 如果没有api流程走不下去了 没有刷新过 先刷新下尝试解决问题
      //compute_current_local_api_pool 应该是找这个方法的问题 this.local_api_pool没筛选出值 暂时很难找到 862行计算的
      const reload_num=LocalStorage.get("reload",0)
      if(reload_num==0){
        LocalStorage.set("reload",reload_num+1)
        window.location.reload()
      }
      // console.log('compute_api_domain_firstone_by_currentTimeMillis--检查失败',);
      return false;
    }
    // let api =   JSON.parse(JSON.stringify(this.local_api_pool))
    // api.push( { api:"http://xxx.com"})
    let reqs = [];
    window.SEARCH_PARAMS.has_token && api.map((x) => {
      // 循环对api进行测试访问处理
      let t = new Date().getTime();
      // 请求的地址
      let url = `${x.api}?t=${t}`;
      reqs.push(
        axios_instance.get(url, {
          timeout: 5000,
        })
      );
    });
    //最快的域名对象
    let fastest_api_obj = "";

    try {
      let res = await Promise.any(reqs);
      // console.log("找到 第一个可用的 api ---返回的数据----", res);
      // 发现可用的域名的逻辑处理
      let c_url = new URL(res.config.url);
      // console.log("c_url------", c_url);
      //最快的域名对象
      fastest_api_obj = format_api_to_obj(
        c_url.origin,
        this.compute_exact_group_by_str(res.data || "")
      );
      if (!check_group) {
        //如果  不是检查 域名分组 正确性 并纠错

        this.find_use_apis_event_first_one(
          fastest_api_obj,
          DOMAIN_API_STORAGE_KEY
        );
      }
    } catch (error) {
      // 所有  全部请求失败
      // console.log(error);
      // console.log("域名检测失败地址:", api);
      // 失败 页面  没网 之类的 错误页面
    }
    try {
      let results = await Promise.allSettled(reqs);
      //      // 异步操作成功时
      // {status: 'fulfilled', value: value}
      // // 异步操作失败时
      // {status: 'rejected', reason: reason}
      // console.log(" 域名时间戳检测逻辑结果 results----------", results);
      //失败次数
      let rejected_num = 0;
      let tr = new Date().getTime();
      results.map((x, i) => {
        //'fulfilled' 异步操作成功时
        if (x.status == "fulfilled") {
          // 刷新 域名的创建时间 ，刷新理论存活时间
          api[i]["update_time"] = tr;
          api[i]["group"] = this.compute_exact_group_by_str(x.value.data || "");
        } else {
          // 'rejected'  异步操作失败时
          rejected_num++;
        }
      });
      //保存数据到本地
      this.set_sava_json_key(this.local_api_pool);
      // 重新计算本地域名池 并且写入本地存储
      this.compute_current_local_api_pool();
      //全部错误
      if (rejected_num == api.length) {
        // 失败 页面  没网 之类的 错误页面

        useMittOn(MITT_TYPES.EMIT_DOMAIN_ERROR_ALERT);
      } else {
        //如果 是检查 域名分组 正确性 并纠错
        if (check_group) {
          //  当前  使用的 api

          let capi = BUILDIN_CONFIG.DOMAIN_RESULT.first_one || "";
          // 当前  使用的 api 的 host
          let capi_str = capi.split("://")[1];
          //  当前  使用的 api  的分组
          let capi_group = (this.local_api_pool.find((x) =>
            x.api.includes(capi_str)
          ) || {})["group"];

          //  如果 当前在用的域名的分组和用户的分组  不相同
          if (capi_group != BUILDIN_CONFIG.DOMAIN_RESULT.gr) {
            //如果 新的最快API 的 分组和  用户的分组 相同
            if (fastest_api_obj.group == BUILDIN_CONFIG.DOMAIN_RESULT.gr) {
              // 设置  可用的域名
              this.find_use_apis_event_first_one(
                fastest_api_obj,
                DOMAIN_API_STORAGE_KEY
              );
            } else {
              //如果 分组不相同   利用新的域名池 重新  排序
              this.compute_api_domain_firstone_by_currentTimeMillis();
            }
          }
        }
      }
    } catch (error) {
      // console.log(error);
      // console.log("域名检测 出错:", api);
    }
  }

  /**
   * 通过 域名返回的字符串 计算 真实分组
   */
  compute_exact_group_by_str(str = "") {
    // data : "oky\n"
    let group = "";
    str = str.toLocaleLowerCase();
    if (!str) {
      group = "";
    } else if (str.includes("oky")) {
      group = "Y";
    } else if (str.includes("okb")) {
      group = "B";
    } else if (str.includes("oks")) {
      group = "S";
    } else if (str.includes("ok") || str.includes("okc")) {
      group = "COMMON";
    }
    return group;
  }

  /**
   * 把一条API 数据组装当前的 分组数据 等
   *
   */
  format_api_to_obj(api, group) {
    let obj = {
      api, //域名
      group: group ? group : BUILDIN_CONFIG.DOMAIN_RESULT.gr, //域名分组信息    "COMMON"     "GA" +  .gr
      update_time: new Date().getTime(),
    };

    return obj;
  }
  /**
   * @description: 自动切换可以使用域名
   * @param {*} err_domain 错误的域名
   * @return {*}
   */
  auto_set_domain_event() {
    // 计算当前的 域名池子
    this.compute_current_local_api_pool();
    // 开始 本地域名池子 新一轮找 最快的
    this.compute_api_domain_firstone_by_currentTimeMillis();
  }

  /**
   * 检查 域名池子 内 域名的 域名分组 正确性 并纠错
   */
  check_and_correct_local_api_pool_group() {
    this.compute_api_domain_firstone_by_currentTimeMillis(true);
  }

  /**
   *  // 初次进入,发现可用的域名
   */
  find_use_apis_event_first_one(obj) {
    // 首次进入,发现最快的域名
    this.loaded = true;
    let api = obj.api;
    // console.log("首次加载,已经找到最快的域名:", api);
    // 写入可用api
    SessionStorage.set("best_api", api);
    // 挂载当前 环境能使用的 api 数组
    BUILDIN_CONFIG.DOMAIN_RESULT.first_one = api;
    isFunction(this.callback) && this.callback();
  }

  /**
   * @description: 设置持久化localStorage中的数据
   * @param {string} key localStorage key值
   */
  set_sava_json_key(val) {
    let key = DOMAIN_API_STORAGE_KEY;
    // let str = JSON.stringify(val);
    // 设置持久化字符串
    LocalStorage.set(key, val);
  }
  /**
   * @description: 获取本地的oss文件路径(增加本域名的oss url地址)
   */
  get_oss_urls() {
    // 获取本地的oss_url_obj路径
    let domains = OSS_FILE_ARR || [];
    if (OSS_FILE_NAME) {
      //  console.error('get_oss_urls----------0--', JSON.stringify(domains));
      // 获取当前的域名地址的/oss/dev.json路径
      let local_domain = `${window.location.origin}/oss/${OSS_FILE_NAME}`;
      // 增加本地的oss url
      domains.unshift(local_domain);
    }
    // console.error('get_oss_urls----------1--', JSON.stringify(domains));
    return domains;
  }
  /**
   * @description: 检测设置oss返回的可以图片域名
   * @param {Array} oss_img_domains oss图片域名数组
   */
  check_img_domain(oss_img_domains) {
    let path = "";
    try {
      switch (CURRENT_ENV) {
        case "local_dev": // 开发
          path = "/group1/M00/25/A0/rBKywGEM5heAAqPFAAABDoCvoS8100.png";
          break;
        case "local_test": // 测试
          path = "/group1/M00/13/74/rBKy7GEM5beAQDjYAAABDoCvoS8983.png";
          break;
        case "idc_pre": // 预发布
          path = "/group1/M00/0E/94/CgURt2EM5U2AKAcCAAABDoCvoS8310.png";
          break;
        case "idc_sandbox": // 试玩
          path = "/group1/M00/0E/94/CgURt2EM5U2AKAcCAAABDoCvoS8310.png";
          break;
        case "idc_lspre": // 隔离预发布
          path = "/group1/M00/49/5A/CgUUSWEM5aOAAp0fAAABDoCvoS8190.png";
          break;
        case "idc_online": // 生产
          path = "/group1/M00/0E/94/CgURt2EM5U2AKAcCAAABDoCvoS8310.png";
          break;
        case "idc_ylcs": // 微型测试环境
          path = "/group1/M00/0E/94/CgURt2EM5U2AKAcCAAABDoCvoS8310.png";
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
    }
    // 循环检测图片域名
    if (oss_img_domains && oss_img_domains.length) {
      oss_img_domains.forEach((img_domain_item) => {
        if (img_domain_item) {
          // 检测设置oss图片域名
          this.img_domain_is_ok(img_domain_item, path);
        }
      });
    }
  }
  /**
   * 检测设置oss图片域名
   * @param domain 域名
   * @param path 图片路径
   */
  img_domain_is_ok(domain, path) {
    // 拼接完整的图片域名
    let url = domain + path;
    return new Promise((resolve) => {
      var img = new Image();
      img.onload = function () {
        // 加载图片
        if (this.complete == true) {
          UserCtr.set_common_img_domain(domain) //设置用户图片
          BUILDIN_CONFIG.DOMAIN_RESULT.img_domains = lodash.uniq([
            domain,
            ...BUILDIN_CONFIG.DOMAIN_RESULT.img_domains,
          ]);
          resolve(true);
          img = null;
        }
      };
      img.onerror = function () {
        // 图片加载错误时
        resolve(false);
        img = null;
      };
      img.src = url;
    });
  }

  /**
   * 找到toppic中最快的域名
   * @param {*} api
   */
  async toppic_fast(api=[], callback, count=0) {
    count++;
    // 清除计时器
    clearTimeout(this.timer_toppic_fast);
    let reqs = [];
    window.SEARCH_PARAMS.has_token && api.map((x) => {
      // 循环对api进行测试访问处理
      let t = new Date().getTime();
      // 请求的地址
      let url = `${x}/check.json?t=${t}`;
      reqs.push(axios_instance.get(url, { timeout: 5000 }));
    });
    try {
      let res = await Promise.any(reqs);
      // 最快toppic的域名
      let c_url = new URL(res.config.url).origin;
      clearTimeout(this.timer_toppic_fast);
      let obj_ = {sports_rules:''}
      // 体育规则配置 
      // 布局规则
      // --2021亚洲H5+PC	common
      // --2023亚洲PC	23-as
      // --2023欧洲H5+PC	23-eu
      // --2023KYAPP复刻版	23-app
      // 路径规则：最优域名/sports-rules/布局/内容 （内容字段需要接口下发，默认common）
      // 比如 https://test-topic.sportxxxifbdxm2.com/sports-rules/common/common
      // 获取项目信息
      const PROJECT_NAME = window.BUILDIN_CONFIG.PROJECT_NAME;
      obj_.activity = `${c_url}/activity/common/common/`;
      switch (PROJECT_NAME) {
        case 'yazhou-h5':
          obj_.sports_rules = `${c_url}/sports-rules/23-as/common/`;
          break;
        case 'yazhou-pc':
          obj_.sports_rules = `${c_url}/sports-rules/23-as/common/`;
          break;
        case 'ouzhou-h5':
          obj_.sports_rules = `${c_url}/sports-rules/23-eu/common/`;
          break;
        case 'ouzhou-pc':
          obj_.sports_rules = `${c_url}/sports-rules/23-eu/common/`;
          break;
        case 'app-h5':
          obj_.sports_rules = `${c_url}/sports-rules/23-app/common/`;
          break;
        case 'new-pc':
          obj_.sports_rules = `${c_url}/sports-rules/23-as/common/`;
          break;
        default:
          obj_.sports_rules = `${c_url}/sports-rules/common/common/`;
          break;
      }
      callback && callback(obj_);
      LocalStorage.set('topic',obj_);
      return;
    } catch (error) {
      // 所有  全部请求失败
      // console.log(error);
    }
    try {
      let results = await Promise.allSettled(reqs);
      //      // 异步操作成功时
      // {status: 'fulfilled', value: value}
      // // 异步操作失败时
      // {status: 'rejected', reason: reason}
      // console.log(" 域名时间戳检测逻辑结果 results----------", results);
      //失败次数
      let rejected_num = 0;
      let tr = new Date().getTime();
      results.map((x, i) => {
        //'fulfilled' 异步操作成功时
        if (x.status == "fulfilled") {
          // 刷新 域名的创建时间 ，刷新理论存活时间
        } else {
          // 'rejected'  异步操作失败时
          rejected_num++;
        }
      });
      //全部错误
      if (rejected_num == api.length) {
        // 失败 页面  没网 之类的 错误页面
        this.timer_toppic_fast = setTimeout(() => {
          this.toppic_fast(api, callback, count);
        }, 5000);
      } else {
      }
    } catch (error) {
      // console.log(error);
    }
  }
}
export default new AllDomain();
