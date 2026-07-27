<template>
  <div class="d-flex px-5 py-4" :style="{ backgroundImage }">
    <h6 class="text-h6 font-weight-bold white--text">
      <span v-if="showEmoji" style="font-size: 30px"
        >🔥<span class="hide-on-xss">🔥</span
        ><span v-if="$vuetify.breakpoint.mdAndUp">🔥</span>
      </span>
      {{ name }}
      <span v-if="showEmoji" style="font-size: 30px"
        >🔥<span class="hide-on-xss">🔥</span
        ><span v-if="$vuetify.breakpoint.mdAndUp">🔥</span>
      </span>
    </h6>
    <v-spacer></v-spacer>
    <v-btn class="more-btn white--text" text small :to="to">更多商品</v-btn>
  </div>
</template>
<script>
export default {
  props: ['name', 'backgroundImage', 'to', 'showEmoji'],
}
</script>
<style scoped>
.hide-on-xss {
  display: none;
}
@media (min-width: 400px) {
  .hide-on-xss {
    display: inline-block;
  }
}
</style>
