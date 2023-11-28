/**
 * 不知道什么乱七八糟的地方挂上去的一堆东西... 逻辑也难找, 直接在原网站上 复制下来的一份...
 */

window.env = {
    "config": {
        "current_env": "idc_online",
        "proxy": {
            "/video": {
                "target": "http://prolivepc.sportxxx13ky.com",
                "changeOrigin": true,
                "pathRewrite": {
                    "^/video": ""
                }
            },
            "/yewu7": {
                "target": "https://api.cadltgvb.com/yewu7",
                "changeOrigin": true,
                "pathRewrite": {
                    "^/yewu7": ""
                }
            },
            "/yewu11": {
                "target": "https://api.cadltgvb.com/yewu11",
                "changeOrigin": true,
                "pathRewrite": {
                    "^/yewu11": ""
                }
            },
            "/yewu12": {
                "target": "https://api.cadltgvb.com/yewu12",
                "changeOrigin": true,
                "pathRewrite": {
                    "^/yewu12": ""
                }
            },
            "/yewu13": {
                "target": "https://api.cadltgvb.com/yewu13",
                "changeOrigin": true,
                "pathRewrite": {
                    "^/yewu13": ""
                }
            },
            "/yewuws2": {
                "target": "https://api.cadltgvb.com/yewuws2",
                "ws": true,
                "pathRewrite": {
                    "^/yewuws2": ""
                }
            },
            "/ossapi": {
                "target": "",
                "changeOrigin": true,
                "pathRewrite": {
                    "/ossapi": ""
                }
            },
            "/livechat": {
                "target": "https://prohw-livechat-ai.uwaj0ve.com/livechat",
                "changeOrigin": true,
                "pathRewrite": {
                    "/livechat": ""
                }
            }
        },
        "api": {
            "API_PREFIX_API": "yewu7",
            "API_PREFIX_USER": "yewu12",
            "API_PREFIX_JOB": "yewu11",
            "API_PREFIX_BAT": "yewu13",
            "API_PREFIX_FILE": "file",
            "API_PREFIX_WBSOCKET": "yewuws2",
            "API_PREFIX_FILE_REAL": "file",
            "API_PREFIX_ACTIVITY": "yewu19"
        },
        "domain": {
            "local_dev": [
                "http://dev-api-1.sportxxxifbdxm2.com",
                "http://dev-api-2.sportxxxifbdxm2.com"
            ],
            "local_test": [
                "http://sit-api-1.sportxxxifbdxm2.com",
                "http://sit-api-2.sportxxxifbdxm2.com"
            ],
            "local_ylcs": [
                "http://api.sportxxxvo3.com"
            ],
            "idc_pre": [
                "https://api.sportxxx278gwf4.com"
            ],
            "idc_sandbox": [
                "https://api.sportxxx278gwf4.com"
            ],
            "idc_lspre": [
                "http://uat-api-1.sportxxxifbdxm2.com",
                "http://uat-api-2.sportxxxifbdxm2.com"
            ],
            "idc_online": [
                "https://api.lkjklkyi.com"
            ],
            "idc_online_B": [],
            "idc_ylcs": [
                "http://api.sportxxxyp7.com"
            ]
        },
        "domain_img": {
            "local_dev": "http://dev-image.sportxxxkd1.com",
            "local_test": "http://image-new.sportxxxifbdxm2.com",
            "local_ylcs": "",
            "idc_pre": "https://image.gyxwzg.com",
            "idc_sandbox": "https://image.gyxwzg.com",
            "idc_lspre": "http://uat-image.sportxxxkd1.com",
            "idc_online": "",
            "idc_ylcs": ""
        },
        "oss_url_obj": {
            "local_dev": {
                "domain": [],
                "url": "/dev.json"
            },
            "local_test": {
                "domain": [],
                "url": "/test.json"
            },
            "local_ylcs": {
                "domain": [],
                "url": ""
            },
            "idc_pre": {
                "domain": [],
                "url": "/pre.json"
            },
            "idc_sandbox": {
                "domain": [],
                "url": "/play.json"
            },
            "idc_lspre": {
                "domain": [],
                "url": "/lspre.json"
            },
            "idc_online": {
                "domain": [
                    "https://user-pc-new.sportxxx1zx.com/oss"
                ],
                "url": "/prod.json"
            },
            "idc_ylcs": {
                "domain": [],
                "url": "/mini.json"
            }
        },
        "static_serve": [
            "https://sicqnxfxwir.lsdjf123.com"
        ],
        "live_domains": [
            "https://prolivepc.sportxxx13ky.com"
        ],
        "oss_img_domains": [
            "https://image.moof87.com"
        ],
        "pro_arr": {
            "FINAL_TARGET_PROJECT_NAME": "yabo",
            "TEMPLATE_NAME": "",
            "DEFAULT_VERSION_NAME": "zhuanye",
            "DEFAULT_THEME_NAME": "theme",
            "HIDE_TOP_HEADER": false,
            "PROJECT_CSS_PATH": "src/css/pro/yabo/"
        },
        "e_sports": {
            "domain_img": "https://uphw-cdn5.q7b4549e.com"
        },
        "oss_urls_info": [],
        "livechat_domain": {
            "local_dev": [
                "https://test-livechat-api.emkcp.com"
            ],
            "local_test": [
                "https://test-livechat-api.emkcp.com"
            ],
            "idc_lspre": [
                "https://uat-livechat-api.x5xd5.com"
            ],
            "idc_sandbox": [
                "https://twtyf5-livechat-api.ough2ie.com"
            ],
            "idc_online": [
                "https://prohw-livechat-ai.uwaj0ve.com",
                "https://proaws-livechat-ai2.ough2ie.com"
            ]
        },
        "TEMPLATE_NAME": "",
        "FINAL_TARGET_PROJECT_NAME": "yabo",
        "ENABLE_COLLECT_API": true,
        "DEFAULT_VERSION_NAME": "zhuanye",
        "LOG": false,
        "DOM_ID_SHOW": false,
        "FRONT_WEB_ENV": "idc_online",
        "API_DOMAIN_PREFIX": "api",
        "ip": "172.28.121.54",
        "html_info": {
            "title": {
                "zh": "亚洲在线体育竞猜投注",
                "en": "Asian Online Gaming Platform",
                "tw": "亞洲在線體育競猜投注"
            },
            "icon": "https://image.moof87.com/group1/M00/1A/55/CgURtmUJVI2AHqPuAAANA5qXz84733.png",
            "productName": "亚洲在线体育竞猜投注",
            "productDescription": "亚洲在线体育竞猜投注",
            "version": "0.0.1",
            "com": "com1",
            "nameEn": "",
            "name": "",
            "max_width": 1350,
            "body_bg_day": "FFFFFF",
            "body_bg_night": "191C24",
            "day_logo": "https://image.moof87.com/group1/M00/1A/56/CgURtWUJVIGACpDzAAAmkXfLX9s667.png",
            "night_logo": "https://image.moof87.com/group1/M00/1A/56/CgURt2UJVHqAOJoqAAAmkXfLX9s772.png",
            "compatible_logo": "https://image.moof87.com/group1/M00/1A/54/CgURtmUILyKAK01FAAAK9XEd46A053.png",
            "default_theme": {
                "yabo": 1
            },
            "versionName": "zhuanye",
            "loadLogoUrl": "https://image.moof87.com/group1/M00/0C/FF/CgURtmC4ee2AD95qAACny32pR5U246.gif",
            "videoLogoUrl": "https://image.moof87.com/group1/M00/15/1B/CgURtWG18PiAUSyfAAAoIlm2eTA094.png"
        },
        "AUTO_API": false,
        "TAG": "online.2023.11.13.04.new",
        "GA_TRACKING_ID": "G-3SFG732R1J",
        "BUILD_VERSION": "2023-11-12-18-21-57",
        "gr": "COMMON",
        "oss_json": {
            "update_time": "2023-10-20 16:14:44",
            "img": [
                "https://image.moof87.com"
            ],
            "static": [
                "https://sicqnxfxwir.lsdjf123.com"
            ],
            "live_domains": {
                "pc": "https://prolivepc.sportxxx13ky.com",
                "h5": "https://proliveh5.sportxxx13ky.com",
                "end": "https://proliveend.sportxxx13ky.com"
            },
            "file_name": "prod.json",
            "GAS": {
                "api": [
                    "https://api.jvzoeyy.com",
                    "https://api.27xh06g.com",
                    "https://api.7eyq3fd.com",
                    "https://api.v1iaams.com:17025",
                    "https://api.pqx2a3j.com:17025",
                    "https://api.fjrk0cq.com:17025",
                    "https://api.kpn4zq9.com:17025",
                    "https://api.7acc6fvb.com",
                    "https://api.ds3co9t0.com"
                ]
            },
            "GAB": {
                "api": [
                    "https://api.9qx9js6.com:17025",
                    "https://api.vur70no.com:17025",
                    "https://api.y1uldxc.com:17025",
                    "https://api.s1gt7yl.com:17025",
                    "https://api.duxqrlnf.com",
                    "https://api.dl9qfnzr.com"
                ]
            },
            "api": [
                "CNyYOXngKUXqp1IvwLj5LK6H8Y+2zTChR2KsyCOTFZI=",
                "q+GnUpmi3E/uF5OiDuykaXtr8OzplMWjLVG8L0zwutY=",
                "FClTYcv7NB/c5eRj4ut47Vn4UA3U4tZ2IL5cTC4gB1M=",
                "HcWCkGX80l+FMhp3AOoPK8M5QQdFdDTsZtd3SoNwXKlOYjZYXt/K3a0G/dTCM68M",
                "xfcktyQsT6Hg80oxBjRru7snwGtM4DpGA0RcUafAY3o=",
                "uV7EbQ3ENLpmPPQjxel1kE3SAUxH0nMkd2kJjD6fpcQ="
            ],
            "update_by": "ob",
            "type": "生产环境",
            "GAY": {
                "api": [
                    "https://api.utapiksdf.com",
                    "https://api.rwkbgmdux.com",
                    "https://api.3ad0i0b.com:17025",
                    "https://api.pg3am3n.com:17025",
                    "https://api.u6uk80t.com:17025",
                    "https://api.wc9wp5t.com:17025",
                    "https://api.jxleslvg.com",
                    "https://api.1ziwqydf.com"
                ]
            },
            "GACOMMON": {
                "api": [
                    "https://api.al80uu8q.com:17025",
                    "https://api.4d32gxyu.com:17025",
                    "https://api.585qo41o.com:17025",
                    "https://api.k08pwsg.com",
                    "https://api.oqiewqnwle.com",
                    "https://api.0yeex2e.com"
                ]
            }
        }
    },
    "NODE_ENV": "production",
    "DEV": false,
    "VUE_ROUTER_MODE": "hash",
    "VUE_ROUTER_BASE": "/2023-11-12-18-21-57/"
}