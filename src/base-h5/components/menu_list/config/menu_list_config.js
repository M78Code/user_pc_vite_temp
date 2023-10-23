import { ref, reactive, onMounted } from "vue";
import { menu_data } from "src/pages/menu_list/config/menu_data";
function use_init_menu() {
  // 初始化赛种信息数据
  let menu_data_res = reactive({
    data: [],
  });
  // 默认常规赛种
  let menu_1_default = reactive();
  // 常规体育d
  let menu_1_base = reactive([
    101, 102, 2000, 105, 107, 110, 108, 103, 109, 111, 112, 113, 116, 115, 114,
    104, 106, 118, 400,
  ]);
  let menu_1base_data = reactive();
  // 电竞体育
  let menu_1_dianjing = reactive([
    { ct: 0, mi: "2100", st: 1, csid: "100" },
    { ct: 0, mi: "2101", st: 2, csid: "101" },
    { ct: 0, mi: "2103", st: 3, csid: "103" },
    { ct: 0, mi: "2102", st: 4, csid: "102" },
  ]);
  // vr体育
  let menu_1_vr = reactive([1001, 1004, 1011, 1002, 1010, 1009]);
  // vr 数据
  let menu_vr_mi = ref({});
  // 默认数据初始化
  function init_default_data() {
    menu_data_res.data = menu_data;
    // 电竞初始化
    // vr 初始化
    set_menu_vr_obj();
  }

  //  vr
  function set_menu_vr_obj() {
    let vr_mi_300 = menu_data.find((x) => x.mi == 300);
    let sl = vr_mi_300["sl"] || [];

    let list_data = {};
    sl.map((v) => {
      let xmi = v.mi;

      v.csid = xmi.substring(1);

      list_data[`mi_${xmi}`] = v;
    });

    menu_vr_mi.value = list_data;
    console.error("list_datalist_data", menu_vr_mi);
  }

  // 接口默认数据
  function set_res_wap(res, default_res) {
    let result = default_res;
    let data = res.data;
    if (data && data.length) {
      result = data.data;
    }
    return result;
  }
  // 常规赛事
  function set_menu_obj() {
    let mi_menu = menu_data.find((v) => menu_1_base.includes(v.mi));
    let sl = mi_menu[sl] || [];
    menu_1base_data = sl;
  }

  // id映射
  function mi_euid_map() {
    // id映射数据
    let mi_euid_res = mi_euid_map_res;
    let obj = {};
    for (let i in mi_euid_res) {
      let item = mi_euid_res[i];
      obj[`mi_${i}`] = {
        euid: item.p || "", // 旧菜单ID
        orpt: item.t || "", // 模板ID
        pids: item.s || "", // 玩法ID
      };
    }
    console.error("mi_euid_res", obj);
  }
  // 体育类型
  function compute_label_by_csid(csid) {
    if (("" + csid).includes(",")) {
      return "all";
    }
    csid = parseInt(csid);
    let label = "common";
    if (csid < 100) {
      label = "common";
    } else if (csid > 100 && csid < 1000) {
      label = "esport";
    } else if (csid > 1000) {
      label = "vr";
    }
    // 冠军
    return label;
  }

  onMounted(async () => {
    init_default_data();
  });
  return {
    menu_1_base,
    menu_data_res,
    menu_vr_mi,
    compute_label_by_csid,
  };
}
export { use_init_menu };
