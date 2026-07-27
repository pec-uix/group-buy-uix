<template>
  <div>
    <img
      :style="{
        '-webkit-mask-image': `url(${backgroungUrl})`,
        'background-color': `${color}`,
        width: `${width}`,
        height: `${height}`,
      }"
    />
  </div>
</template>

<script>
export default {
  props: {
    backgroungUrl: {
      type: String,
      default: '',
    },
    width: {
      type: String,
      default: '20px',
    },
    height: {
      type: String,
      default: '20px',
    },
    color: {
      type: String,
      default: '',
    },
  },
}
</script>

<style scoped>
</style>