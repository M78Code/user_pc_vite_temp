<template>
  <div class="coming_soon_page">
    <slot name="image">
    </slot>
    <slot name="title">
      <span class="d_title">{{ i18n_t("ouzhou.no_data.coming_soon") }}</span>
    </slot>
  </div>
</template>

<script>

</script>

<style lang="scss" scoped>
  .coming_soon_page {
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    animation: an_scale 0.25s;
    margin-top: 76px;
    img, span {
      display: inline-block;
    }
    .d_img {
      width: 140px;
      height: 140px;
      margin-bottom: 10px;
    }
    .d_title {
      font-family: Roboto;
      font-size: 16px;
      font-weight: 500;
      line-height: 19px;

    }
  }
</style>
