<template>
  <div class="d-flex px-2 py-4">
    <h6 v-if="showEmoji" :class="`text-h6 font-weight-bold ${color}--text`">
      <span style="font-size: 30px"
        >🔥<span class="hide-on-xss">🔥</span
        ><span v-if="$vuetify.breakpoint.mdAndUp">🔥</span>
      </span>
      {{ name }}
      <span style="font-size: 30px"
        >🔥<span class="hide-on-xss">🔥</span
        ><span v-if="$vuetify.breakpoint.mdAndUp">🔥</span></span
      >
    </h6>
    <h6 v-else :class="`text-h6 pec-title-bl font-weight-bold ${color}--text`">
      {{ name }}
    </h6>
    <v-spacer></v-spacer>
    <v-btn v-if="to" class="more-btn" :color="color" depressed small :to="to"
      >更多商品</v-btn
    >
  </div>
</template>
<script>
export default {
  props: ['name', 'color', 'to', 'showEmoji'],
}
</script>
<style scoped>
.hide-on-xss {
  display: none;
}
@media (min-width: 390px) {
  .hide-on-xss {
    display: inline-block;
  }
}
</style>
