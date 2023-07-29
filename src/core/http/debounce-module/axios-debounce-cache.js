/**
 *  接口 缓存、限频、节流   相关的 类
 *
 * 这里的  debounce_time ，需要 正常情况下
 *   在 http 单个接口请求的时候 延迟 封装
 *
 */

// 延迟发起请求    delay_to_run
// let delay_to_run  = new Promise((cb_Promise) => {
//   setTimeout(() => {
//     cb_Promise()
//   }   1000)
// })
// return delay_to_run.then(() => {
//   return xxxxxx(params)
// })

class AxiosDebounceCache {
  constructor(url = "") {
    //是否开启使用 , 开关默认开启 ，如果要单个接口关闭 单个关口那边关闭
    this.ENABLED = true;
    //检索用 无其他用处  menu/init   getMatchBaseInfoByMids
    this.url = url;
    // 是否是bymids 接口 这个比较特殊必须明确指明
    this.is_bymids_api = false;
    //最小请求间隔  也就是前端限频  ;必须小于等于  debounce_time  并且大于 0 ， 并且大于 服务器端设置的限频数值 ，
    //比如服务器端设置 1秒1次 就是600ms 3 秒2次 就是 1600ms
    //调节这里 必须确保  debounce_time 大于这里不然 会出异常
    //此参数主要对不同 hash_code  执行限频 ，也就是 接口级别限频
    this.minimum_interval = 1000;
    //防抖时间 也就是前端节流； 前端节流策略 ;也就是 理想情况下几秒内只能一次请求; 多次请求只会有一次发送出去;
    // 当  hash_code 相同 可以延迟等待几秒后发送  ，代码逻辑内进行参数聚合，
    // 当  hash_code 不同 可以 根据 minimum_interval 发起请求，有必要的时候取消上次的请求
    //此参数主要是对相同 hash_code  执行限频 ，也就是 前端节流
    this.debounce_time = 2000;
    //是否开启随机前端节流  ，主要用于消除峰值， 默认关闭，避免引起问题
    //场景比如WS推送导致菜单更新 ，赛事列表主接口更新 之类的
    this.enabled_random_debounce_time = false;
    //开启随机前端节流 最小节流时间 ，必须大于  minimum_interval
    this.random_debounce_time_min = 2000;
    //开启随机前端节流 最大节流时间 必须大于  random_debounce_time_min
    this.random_debounce_time_max = 3000;
    //缓存并检查接口参数的 菜单ID ：作用相同接口 前后两次 参数内的 菜单ID 不一样立马发起请求或者500ms 自定
    //如果关闭 菜单切换引起的请求会走走节流限频逻辑，会慢一些 相关BUG 单： 1677
    this.euid_cache_and_check = false;
    //缓存并检查接口参数的 菜单ID 发起请求的 延迟时间
    this.euid_cache_and_check_request_delay_time = 0;
    //缓存并检查接口参数的 菜单ID
    this.euid_cache_and_check_last_euid = "";
    //当前接口自定义超时时长，
    //一般大于默认的时长 ，可以被 请求内的自定义传参覆盖，
    //一般不建议，除非主管明确知道原因和影响
    //例如刚刚进页面的某些决定性接口延时可以调大 ，或者某些注单列表 ，赛果等接口
    //当然 也可以在 其他地方做设置
    this.timeout = 10000;
    //最后一次请求的 状态 相关信息
    this.last_request_info = {
      //发起时间戳
      send_time: 0,
      //hash_code
      hash_code: "",
      //AbortController   这个API 即便是兼容性有问题 也最多是不拦截请求 继续发起
      controller: "",
      //状态 ，
      //几个状态 ： going 请求中 ， error 接口请求出错 （包含503 限频接口请求出错  ）  ，done-ok 请求已完成 返回ok ， done-limit 请求已完成 返回限频
      state: "",
      //返回的时间戳 ，只要不是请求中都需要赋值 ，本地时间为准
      back_time: 0,
      // uuid
      uuid: "",
    };
    //最新一次 请求成功的  done-ok  并且 code 是 "0000000" /200  的 hash_code  对应的详细数据
    //如果是    done-ok   但是  code 并不是 "0000000" /200  不做存储 ，这个存储主要是给 使用缓存 的提供 缓存数据
    this.last_done_ok_request_info = {
      //发起时间戳
      send_time: 0,
      //请求的 hash_code  ，如果要使用缓存 ，则对比这里的缓存数据 的 hash_code 是一样的 就直接封装resove 返回回去
      hash_code: "",
      // 返回体 ,这里 要存储用于缓存 ，但是可能出现 问题 ，mids 返回的数据被加工过后 频率变新的了，数据结构变了
      //因此这里要 深拷贝 ，但是数据量大的时候  深拷贝会 有性能问题 ，这里 需要自测验证一下，返回体应该是对象地址引用
      // 但是生产上 几个 核心接口 都是 加密后的字符串，因此不存在性能问题
      // 但是如果 不是PB 加密后的 数据这里 就会可能存在性能问题
      //可以通过返回值是不是 字符串类型来判定 缓存 是否需要深拷贝
      // 这一层需要带上 res.data.data  res.data.code  ,真正能用缓存的数据的 几个核心接口 也必须是 code "0000000" /200 才能用
      // 非 PB 接口 不做缓存 ，不然存储量 转换较大
      res_data: "",
      //返回的时间戳
      back_time: 0,
      // uuid
      uuid: "",
    };
  }

  // 自定义哈希算法
  // 当同一个组件发起多次请求而且hash_code 不一样也可能用这个去屏蔽掉 之前请求的返回结果
  // 场景就是 避免 后一个请求的结果先返回回来
  //      例如菜单切换， 菜单1： 一千场赛事 10秒返回   菜单2：一个1场 100ms 返回 .  先点菜单1 再点菜单2
  // mids 接口 不计算tab pid playid
  hash_code(params) {
    //把参数传进来 ，自己手写 字符串拼接  ，只取 核心的几个参数 ，一个一个固定的拼接方式拼接完成
    //类似
    let str = `euid_${params.euid}_sort_${params.sort}`;
    // 目前没有特殊服务也不会太长 就不再引入库 去转 只要这里 不出现 除了_以外的 特殊符号 就行
    return str;
  }

  //如果 开启 随机前端节流 则 随机计算  debounce_time
  random_debounce_time() {
    //计算随机时间  最大最小时间差之间随机，也就是期望的消峰分散区间
    let debounce_time = Math.ceil(
      Math.random() *
        (this.random_debounce_time_max - this.random_debounce_time_min)
    );

    //赋值
    this.debounce_time = this.random_debounce_time_min + debounce_time;
  }

  // 判定是否可以发起当前请求 ， 逻辑代码内调用 ，如果不能发起 就延迟发起 ，能 就立马发起
  // 如果 开启了   随机前端节流 ，这里在  delay_time 期间 一定不能再次调用这个方法
  can_send_request(params) {

    //当开启 缓存并检查接口参数的 菜单ID
    if (this.euid_cache_and_check) {
      //本次请求有 euid  和 前一次请求  euid  不同
      let euid_different =
        params.euid && params.euid != this.euid_cache_and_check_last_euid;
      if (euid_different) {
        //立即发起请求 不管限频不限频，也不考虑上次请求的状态，后续逻辑会取消上次请求
        return {
          can_send: true,
          delay_time: this.euid_cache_and_check_request_delay_time,
        };
      }
    }
    //如果 开启 随机前端节流 则 随机计算  debounce_time
    if (this.enabled_random_debounce_time) {
      this.random_debounce_time();
    }
    let obj = null;
    switch (this.last_request_info.state) {
      case "going":
        obj = this.compute_can_send_request_when_last_request_going(params);
        break;
      case "done-limit":
        obj = this.compute_can_send_request_when_last_request_done_limit(params);
        break;
      case "done-ok":
        obj = this.compute_can_send_request_when_last_request_done_ok(params);
        break;
      case "error":
        obj = this.compute_can_send_request_when_last_request_error(params);
        break;
      default:
        obj = this.compute_can_send_request_when_last_request_default(params);
        break;
    }
    return (
      obj || {
        can_send: true,
        delay_time: 0,
      }
    );
  }

  // 判定是否可以发起当前请求 ， 当最后一个请求还在执行中
  compute_can_send_request_when_last_request_going(params) {
    // this.last_request_info.controller?.abort('hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh');
    //    //可以发起请求
    //    return {

    //     can_send: true,
    //     delay_time: 0,
    //   };
    //计算准备请求的 hash_code
    let new_hash_code = this.hash_code(params);
    // 如果 请求 hash_code 一样 ,这个时候不建议发起请求
    if (new_hash_code == this.last_request_info.hash_code) {
      //距离当前接口的超时 剩余的时间  波动500ms
      let cti =
        this.timeout +
        500 -
        (new Date().getTime() - this.last_request_info.send_time);
      if (cti <= 0) {
        // 说明 超时不准确
        // 取消上次的的请求
        if (this.last_request_info.controller) {
          this.last_request_info.controller.abort();
          //取消请求之后 ，axios 的 后置拦截会去处理 其他数据
        }
        //可以发起请求
        return {
          can_send: true,
          delay_time: 0,
        };
      } else {
        // 未到 超时时间
        //不能发起请求
        return {
          can_send: false,
          delay_time: cti,
        };
      }
    } else {
      // 如果 请求 hash_code  不 一样 ,这个时候 发起请求 但是需要 确保 前端限频兜底
      return this.compute_can_send_request_ensure_minimum_interval(params);
    }
  }
  // 判定是否可以发起当前请求    ，  当最后一个请求 限频code 限频
  compute_can_send_request_when_last_request_done_limit(params) {
    // 如果 限频了 也就是上一个请求有结果了 ,这个时候 发起请求 但是需要 确保 前端限频兜底
    return this.compute_can_send_request_ensure_minimum_interval(params);
  }
  // 判定是否可以发起当前请求    ，  当最后一个请求 返回 非限频 的 数据结果 ， （可能是服务器错误等 ）
  compute_can_send_request_when_last_request_done_ok(params) {

    // 当最后一个请求 返回 非限频 的 数据结果
    // 这里几个核心接口 状态码能用的只有 "0000000" / 200，如果时间很短，建议使用缓存的值不要发起请求了
    // 但是 mids 不走这个 逻辑 ，必须发起请求 。 菜单以及 赛事列表接口可以适当的走缓存
    if (this.is_bymids_api) {
      return this.compute_can_send_request_ensure_minimum_interval(params);
    } else {
      // 不是 mids接口
     //计算准备请求的 hash_code
     let new_hash_code = this.hash_code(params);
      //如果不是mids接口    ,这个时候  发起请求 但是需要 确保 前端限频兜底 ，但是可以 告诉 调用者 ，有缓存没有 是否可以走缓存
      let obj = this.compute_can_send_request_ensure_minimum_interval(params);
      // 只要在  前一次请求到现在 在  debounce_time  时间差内部 ，并且，上次的返回结果 code 是  "0000000" / 200 就给出推荐 指明可以使用缓存
      //距离当前接口的  debounce_time 防抖节流 剩余的时间  波动500ms
      let cti =
        this.debounce_time +
        200 -
        (new Date().getTime() - this.last_request_info.send_time);
      // 最新一次 请求成功的 缓存数据和  最后一次请求的 是同一个请求
      let the_same =
        this.last_request_info.hash_code == new_hash_code &&
        this.last_request_info.uuid == this.last_done_ok_request_info.uuid &&
        this.last_done_ok_request_info.res_data;
      //有效的缓存数据
      if (the_same) {
        //如果在前端节流时间区间内 ，
        if (cti >= 0) {
          // 推荐使用缓存数据  ，缓存数据自己从   last_done_ok_request_info.res_data 内去取 ，
          //  是否使用缓存自己决定，也可以  根据 obj 的结果   直接发起 或者 延迟发起请求
          obj.use_cache = 1;
        }

        //不论在不在前端的节流时间区间内
        //如果 开启 随机前端节流 则 随机计算  debounce_time
        if (this.enabled_random_debounce_time) {
          //如果此时能发起请求 ，避免  出现WS 推送 的时候 ，距离上一次请求 比如 一分钟了，这个时候会一起发起请求
          // 会造成服务端 流量峰值 ，
          // 这里需要难拦住第一波 ，但是如果WS 推送频繁，一波接一波这里请求会一直延后下去
          // 因此代码内 收到 delay_time 的时间区间内一定不能再调用  can_send_request ,否则这个可能会推迟比较久
          if (obj.can_send) {
            //计算随机时间  最大最小时间差之间随机，也就是期望的消峰分散区间
            let debounce_time = Math.ceil(
              Math.random() *
                (this.random_debounce_time_max - this.random_debounce_time_min)
            );
            obj.can_send = false;
            obj.delay_time = debounce_time;
          }
        }
      }

      return obj;
    }
  }
  // 判定是否可以发起当前请求 ， 当最后一个请求 出错而 或者 503 出错，可能是其他错误或者被 其他 业务逻辑  取消请求
  compute_can_send_request_when_last_request_error(params) {
    // 如果 出错而且非 503 出错 也就是上一个请求有结果了 ,这个时候 发起请求 但是需要 确保 前端限频兜底
    return this.compute_can_send_request_ensure_minimum_interval(params);
  }
  // 判定是否可以发起当前请求 ， 当其他判定逻辑出错
  compute_can_send_request_when_last_request_default(params) {
    //计算准备请求的 hash_code
    let new_hash_code = this.hash_code(params);
    // 如果 请求 hash_code 一样
    if (new_hash_code == this.last_request_info.hash_code) {
      return {
        can_send: false,
        delay_time: this.minimum_interval,
      };
    } else {
      return {
        can_send: true,
        delay_time: 0,
      };
    }
  }
  // 判定是否可以发起当前请求 ， 确保最小请求间隔 也就是限频生效 也就是  确保 前端限频兜底
  compute_can_send_request_ensure_minimum_interval(params) {
    if (this.is_bymids_api && params && params.inner_param) {
      //如果是bymids 接口  请求，并且需要立马发起请求 ，则 走 最基础的 340ms 延迟逻辑
      //此 场景比如： tab 切换 ， 联赛展开
      // 340 毫秒 根据  服务端 对 这个接口的限频 策略而定  1秒3次则 340  1秒2次 则 510 1秒1次则 1010

      let res = {
        can_send: true,
        delay_time: 340,
      };

      //指定inner_param 为number则直接使用
      if(typeof params.inner_param=='number'){
        res.delay_time = params.inner_param
        return res
      }

      let cha = Date.now() - this.last_request_info.send_time;
      if(cha < 0) {
        res.delay_time=0
      } else if(cha < 340) {
        res.delay_time=cha
      }
      return res
    } else {
      let cti =
        this.debounce_time +
        100 -
        (new Date().getTime() - this.last_request_info.send_time);
      //负值代表已经过去很久 可以发起了，正值代表不到限频间隔
      cti = cti <= 0 ? 0 : cti;
      // 距离上次请求发出还不到 默认的 最小请求间隔  ，如果大于minimum_interval 强制设为 minimum_interval
      cti = cti >= this.minimum_interval ? this.minimum_interval : cti;
      return {
        can_send: cti == 0,
        delay_time: cti,
      };
    }
  }


}

export default AxiosDebounceCache;
