<template>
  <div class="d-flex px-5 pt-4 pb-5" :style="{ backgroundImage }">
    <h6 class="text-h6 font-weight-bold white--text">{{ name }}</h6>
    <v-spacer></v-spacer>
    <v-btn v-if="to" class="more-btn white--text" small outlined :to="to"
      >更多商品<i
        class="fa-solid fa-caret-right ml-1"
        style="margin-top: 2px"
      ></i
    ></v-btn>
  </div>
</template>
<script>
export default {
  props: ['name', 'backgroundImage', 'to'],
}
</script>
