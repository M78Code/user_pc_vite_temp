<template>
  <div style="color: white">
    <div class="q-py-lg">配置信息</div>
    <div>赛种： {{ base_data.competition_type }}</div>
    <div>
      背景：
      {{ base_data.bg_img }}
      <img :src="ASSETS_IAMGE_CDN+base_data.bg_img" height="50" />
    </div>
    <div>
      Logo：
      {{ logo_data.team_logo }}
      <img :src="ASSETS_IAMGE_CDN+logo_data.team_logo" height="50" />
    </div>
  </div>
</template>

<script>
import {
  get_animation_base_config,
  get_animation_logo_config,
} from "project/animation/src/public/module/client-admin";

const ASSETS_IAMGE_CDN = "https://assets-image.oceasfe.com";

export default {
  data() {
    return {
      ASSETS_IAMGE_CDN,
      base_data: {},
      logo_data: {},
    };
  },
  created() {
    this.initAnimationBaseConfig();
    this.initAnimationLogoConfig();
  },

  methods: {
    async initAnimationBaseConfig() {
      const { data } = await get_animation_base_config({
        competition_type: "足球",
      });
      if (!data.data) {
        return;
      }

      this.base_data = data.data;
    },

    async initAnimationLogoConfig() {
      const { data } = await get_animation_logo_config();
      const logoData = data.data?.[0];

      if (!logoData) {
        return;
      }

      this.logo_data = logoData;
    },
  },
};
</script>
