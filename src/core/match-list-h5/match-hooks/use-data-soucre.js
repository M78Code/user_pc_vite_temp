
/**
 * @Description: 欧洲版H5 赛事相关数据
 */
import { api_match } from "src/api/index.js";
import { ref } from 'vue'
import { playingMethods_15 } from "src/global/constant.js";
import courseData from 'src/global/course.js'
import { gameBgImage } from 'src/global/constant.js'

/**
 * @Description 获取赛事数据
 * @returns eventData 15分玩法数据； gameInfo 赛事列表； popularData 热门赛事
 */
export const useEventData = () => {

  const eventData = ref([])
  const gameInfo = ref([])
  const popularData = ref([])
  const networkStatus = ref(false)
  
  // 获取赛事数据
  const get_home_data = async () => {
    const res = await api_match.get_home_data({ type: 1 })
    const { data: { dataList = [], hots = [], p15 = [] }, code } = res.data
    if (code !== 200) return networkStatus.value = true
    networkStatus.value = false
    // 15分钟玩法赛事数据
    assemble_time_data(p15)
    // 赛事列表数据
    assemble_matches_data(dataList.slice(0, 20))
    // 热门赛事数据
    assemble_featured_matches_data(hots)
  }

  // 获取对应赛事数据
  const get_filter_data = async (params) => {
    const res = await api_match.get_filter_data(params)
    const { data = {}, code } = res.data
    if (code !== 200) return networkStatus.value = true
    networkStatus.value = false
    // 赛事列表数据
    assemble_matches_data(data.slice(0, 10), false)
  }

  /**
   * @description 获取最近一组15分玩法数据
   * @param {*} payload 正在比赛的数据
   */
  const assemble_time_data = (payload) => {
    eventData.value = payload.map((item) => {
      const { hps15Minutes, ms, mst } = item
      const { title, isLock } = handle_event_stage(ms, mst)
      const oddsData = isLock ? [] : handle_odds_data(hps15Minutes, '32')
      return {
        title,
        oddsData,
        ...item,
        icon: String(Number(item.csid ) + 100)
      }
    })
  }

  /**
   * @param {Array} payload 当前遍历的赛事列表
   * @param {Array} isFilter 是否过滤无效赛事
   * @description 不同赛种，不同联赛 csid： 赛种ID； tid：联赛ID
   * @returns {Array} 
   */
  const assemble_matches_data = (payload, isFilter = true) => {
    const arrData = []
    payload.forEach(t => {
      // 比赛结束、关闭、取消、比赛放弃过滤掉
      if (['3','4','5','6'].includes(t.mmp) && isFilter) return
      t.panel = handle_odds_data(t.hps)
      t.mscValue = handle_msc_data(t.msc)
      t.course = handle_course_data(t)
      const { mstValue, mstValueTime } = format_mst_date(t)
      t.mstValue = mstValue
      t.mstValueTime = mstValueTime
      const item = arrData.find(l => l.csid === t.csid)
      // 足球、水球、冰球 有 胜平负； 其他 胜负
      const methods = ['1', '4', '16'].includes(t.csid) ? ['1', 'X', '2'] : ['1', '2']
      if (item) {
        item.number++
        const list = item.gameData.find(a => a.tid === t.tid)
        // 选择玩法完整的数据
        const flag = handle_play_data(t.hps)
        item.pMethods = flag && t.hps
         // 已存在该联赛则向该联赛添加比赛
        if (list) return list.data.length < 5 && list.data.push(t)
        // 不存在则添加该联赛且向联赛添加比赛
        return item.gameData.push({
          tn: t.tn,
          visible: true,
          tid: t.tid,
          data: [t]
        })
      }
      // 添加赛种
      arrData.push({
        panel: methods,
        csna: t.csna,  //赛种名称
        csid: t.csid,  //赛种ID
        icon: String(Number(t.csid ) + 100),
        pMethods: t.hps,
        visible: true,
        number: 1,
        selectTitle: 'Fulltime Result',
        gameData: [{ //用来存储联赛级数据
          tn: t.tn,
          tid: t.tid,
          data: [t],
          visible: true,
          isCollect: false,
        }],
      })
    })
    gameInfo.value = arrData.length > 0 ? handle_game_data(arrData) : arrData
    gameInfo.value = gameInfo.value.sort((a, b) => Number(a.csid) - Number(b.csid))
  }

  /**
   * @param {Array} payload 当前遍历的赛事列表
   * @description 热门赛事数据
   * @returns {Array}
   */
  const assemble_featured_matches_data = (payload) => {
    popularData.value = payload.map(t => {
      t.course = handle_course_data(t)
      t.panel = handle_odds_data(t.hps, '1')
      const { mstValue, mstValueTime } = format_mst_date(t)
      t.mstValue = mstValue
      t.mstValueTime = mstValueTime
      const item = gameBgImage.find(l => l.value === t.csid)
      const image = item && item.image
      return {
        ...t,
        image
      }
    })
  }

  /**
   * @description 获取玩法
   * @param {*} key 玩法类型
   * @param {*} payload 总玩法
   */
  const handle_odds_data = (hps, key) => {
    const type = key ? key : hps[0].hpid
    const target = hps.find(l => l.hpid === type)
    if (!target) return []
    const olData = target.hl[0] && target.hl[0].ol || []
    const result = olData.sort((a, b) => a.otd - b.otd) || []
    // 赔率数据
    return result.map(o => {
      return {
        ...o,
        hps: target,
        hid: target.hl[0].hid,
        ov: (o.ov / 100000).toFixed(2),
        ot: o.ot
      }
    })
  }

  
// 处理赛事数据 是否展开收起 
const handle_game_data = (payload) => {
  payload.forEach(t => {
    const item = gameInfo.value.find(a => a.csid === t.csid)
    t.visible = item ? item.visible : true
    if (!item) return
    t.gameData.forEach(l => {
      const list = item.gameData.find(b => b.tid === l.tid)
      l.visible = list ? list.visible : true
    })
  })
  return payload
}

  // 处理赛程
  const handle_course_data = (t) => {
    const { mmp, csid, ms } = t
    return ms === 1 ? courseData[csid][mmp] : ms === 110 ? 'Soon': ''
  }

  // 处理比分数据
  const handle_msc_data = (msc) => {
    const target = msc[0] && msc[0].split('|')[1]
    return target && target.split(':') || [0, 0]
  }
  
  // 选择玩法完整的数据
  const handle_play_data = (hps) => {
    let flag = false
    hps.forEach(t => {
      if (t.hl[0] && t.hl[0].ol) flag = true
    })
    return flag
  }

  // 开赛时间转换 分：秒
  const format_mst_date = (t) => {
    const { ms, mst, mgt } = t
    if (ms === 1) {
      const m = String(Math.floor((mst / 60))).padStart(2, '0')
      const s = String(Math.floor((mst % 60))).padStart(2, '0')
      return { mstValueTime: `${m}:${s}` }
    } else {
      const { m, d, h, mm, s } = format_date_time(mgt)
      return { mstValue:`${d}/${m}`, mstValueTime: s === '00' ? `${h}:${mm}` : `${h}:${mm}:${s}` }
    }
  }

  // 15分钟玩法赛事阶段 ms 1 滚球
  const handle_event_stage = (ms, mst) => {
    let isLock = false
    let title = ''
    if (ms !== 1) {
      title = playingMethods_15[0].title
    } else {
      const difference = Math.floor(Number(mst) / 60)
      const residue = Math.floor(difference / 15)
      if (difference > 0 && difference <= 90) {
        title = playingMethods_15.find(p => p.value === residue).title
      }
      if (difference < 0) {
        isLock = true
        title = playingMethods_15[0].title
      }
      if (difference > 90) {
        isLock = true
        title = playingMethods_15[playingMethods_15.length - 1].title
      }
    }
    return { isLock, title }
  }

  // 获取格式化时间对象
  const format_date_time = (value) => {
    const time = new Date(parseInt(value))
    const y = time.getFullYear()
    const m = String(time.getMonth() + 1).padStart(2, 0)
    const d = String(time.getDate()).padStart(2, 0)
    const h = String(time.getHours()).padStart(2, 0)
    const mm = String(time.getMinutes()).padStart(2, 0)
    const s = String(time.getSeconds()).padStart(2, 0)
    const w = time.getDay();
    return { y, m, d, h, mm, s, w }
  }

  const get_export_data = () => {
    return {
      eventData, gameInfo, popularData, 
      networkStatus: networkStatus.value
    }
  }

  return {
    get_export_data,
    get_home_data,
    get_filter_data
  }
}
