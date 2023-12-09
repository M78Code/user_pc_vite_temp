import { i18n_t } from "src/boot/i18n.js";

/**
 * 投注快捷金额
 *
 */
export const keyboard = [
  {
    text: "5",
    value: 5,
    disabled: false
  },
  {
    text: "10",
    value: 10, // 数值
    disabled: false // 禁用
  },
  {
    text: "25",
    value: 25,
    disabled: false
  },
  {
    text: "50",
    value: 50,
    disabled: false
  },
  {
    text: "100",
    value: 100,
    disabled: false
  },
  {
    text: "200",
    value: 200,
    disabled: false
  }
]

// 盘 对应关系
export const odds_type_name = {
  "EU": i18n_t('odds.EU'), //欧洲盘
  "ID": i18n_t('odds.ID'), //印尼盘
  "US": i18n_t('odds.US'), //美式盘
  "MY": i18n_t('odds.MY'), //马来盘
  "GB": i18n_t('odds.GB'), //英式盘
  "HK": i18n_t('odds.HK'), //香港盘
}