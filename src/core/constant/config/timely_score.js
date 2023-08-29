/*
 * @Author: lampson
 * @Description: 投注框对阵信息后面需要展示及时比分，不同的玩法取不同的比分，此文件用于对应映射关系
 */
export const football_score_map = {
  20: "S2",
  21: "S2",
  22: "S2",
  23: "S2",
  24: "S2",
  29: "S2",
  30: "S2",
  42: "S2",
  43: "S2",
  69: "S2",
  70: "S2",
  87: "S2",
  90: "S2",
  97: "S2",
  100: "S2",
  105: "S2",
  224: "S10101",
  306: "S10101",
  307: "S10101",
  310: "S10101",
  312: "S10101",
  314: "S10101",
  315: "S10101",
  318: "S10101",
  320: "S10101",
  321: "S10101",
  308: "S10103",
  309: "S10103",
  311: "S10103",
  313: "S10103",
  316: "S10103",
  317: "S10103",
  319: "S10103",
  322: "S10103",
  323: "S10103",
  138: "S11",
  139: "S11",
  140: "S11",
  324: "S12",
  325: "S12",
  326: "S12",
  327: "S14",
  328: "S14",
  329: "S14",
  119: "S15",
  120: "S15",
  121: "S15",
  122: "S15",
  123: "S15",
  124: "S15",
  228: "S15",
  229: "S15",
  230: "S15",
  132: "S170",
  133: "S170",
  134: "S170",
  237: "S170",
  238: "S170",
  239: "S170",
  240: "S170",
  241: "S170",
  334: "S170",
  333: "S17005",
  335: "S17005",
  25: "S3",
  26: "S3",
  71: "S3",
  72: "S3",
  73: "S3",
  74: "S3",
  75: "S3",
  76: "S3",
  88: "S3",
  89: "S3",
  98: "S3",
  99: "S3",
  106: "S3",
  142: "S3",
  143: "S3",
  331: "S5",
  111: "S555",
  112: "S555",
  113: "S555",
  114: "S555",
  115: "S555",
  116: "S555",
  117: "S555",
  118: "S555",
  125: "S555",
  225: "S555",
  226: "S555",
  227: "S555",
  126: "S7",
  127: "S7",
  128: "S7",
  234: "S7",
  235: "S7",
  236: "S7",
  330: "S7",
  129: "S701",
  130: "S701",
  332: "S701",
  // 以下玩法不需要展示及时比分
  10001: null,
  10002: null,
  10003: null,
  10004: null,
  10005: null,
  10006: null,
  10007: null,
  10008: null,
  10009: null,
  10010: null,
  10011: null,
  10012: null,
  // 以下玩法要动态取比分
  17: 1,
  18: 1,
  19: 1,
  32: 1,
  33: 1,
  34: 1,
  231: 1,
  232: 1,
  233: 1,
  270: 1,
}

export const basketball_score_map = {
  44: "S19",
  45: "S19",
  46: "S19",
  47: "S19",
  48: "S19",
  49: "S19",
  17: "S2",
  18: "S2",
  19: "S2",
  42: "S2",
  43: "S2",
  87: "S2",
  97: "S2",
  50: "S20",
  51: "S20",
  52: "S20",
  53: "S20",
  54: "S20",
  55: "S20",
  56: "S21",
  57: "S21",
  58: "S21",
  59: "S21",
  60: "S21",
  61: "S21",
  62: "S22",
  63: "S22",
  64: "S22",
  65: "S22",
  66: "S22",
  67: "S22",
  25: "S3",
  26: "S3",
  75: "S3",
  88: "S3",
  98: "S3",
  142: "S3",
  143: "S3",
  // 以下玩法不需要展示及时比分
  219: null,
  10001: null,
  10013: null,
  10014: null,
  // 以下玩法要动态取比分
  145: 1,
  146: 1,
  147: 1,
  215: 1,
}
// 乒乓球
export const table_tennis_score_map = {
  153: "S1",
  172: "S1",
  173: "S1",
  174: "S1",
  204: "S1",
  // 以下玩法要动态取比分
  175: 1,
  176: 1,
  177: 1,
  178: 1,
  179: 1,
  203: 1,
}
// 排球
export const volleyball_score_map = {
  153: "S1",
  159: "S1",
  204: "S1",
  172: "S1",
  173: "S1",
  // 以下玩法要动态取比分
  162: 1,
  253: 1,
  254: 1,
  255: 1,
  256: 1,

}
// 棒球
export const baseball_score_map = {
  242: "S1",
  243: "S1",
  244: "S1",
  245: "S1",
  246: "S1",
  247: "S1",
  248: "S1",
  249: "S1",
  250: "S1",
  251: "S1",
  252: "S1",
  273: "S1",
  274: "S1",
  277: "S1",
  278: "S1",
  279: "S1",
  // 安打比分
  284: "S3015",
  285: "S3015",
  286: "S3015",
  290: "S3015",
  291: "S3015",
  292: "S3015",
  // 以下玩法要动态取比分
  // 第几局比分
  275: 1,
  276: 1,
  280: 1,
  281: 1,
  282: 1,
  283: 1,
  // 第几局安打
  287: 2,
  288: 2,
  289: 2,

}

 