<template>
  <category-slide></category-slide>

  <!-- <div v-dragscroll class="big-box">
    <p class="p">
      Lorem ipsum dolor sit ameturutem. Unde impedit laboriosam deserunt ipsa?
    </p>
    <p class="p">Lorem ipsum dolor sit</p>
    <p class="p">Lorem ipsum</p>
    <p class="p">Lorem ipsum dolor sit ameturutem. Unde impedit laboriosam</p>
    <p class="p">ameturutem. Unde impedit laboriosam deserunt ipsa?</p>
    <p class="p">
      Lorem ipsum dolor sit ameturutem. Unde impedit laboriosam deserunt ipsa?
    </p>
    <p class="p">Unde impedit laboriosam deserunt ipsa?</p>
    <input type="text" />
    <p class="p">
      Lorem ipsum dolor sit ameturutem.
      <button class="btn btn-default">Test click</button>
      Unde impedit laboriosam deserunt ipsa?
    </p>
    <p class="p">Unde impedit laboriosam deserunt ipsa?</p>
    <p class="p">
      Lorem ipsum dolor sit ameturutem. Unde impedit laboriosam deserunt ipsa?
    </p>
    <p class="p">Loremlaboriosam deserunt ipsa?</p>
    <p class="p">deserunt ipsa?</p>
    <p class="p">Lorepedit laboriosam deserunt ipsa?</p>
    <p class="p">Loremeturutem. Unde impedit laboriosam deserunt ipsa?</p>
    <p class="p">Lorepedit laboriosam deserunt ipsa?</p>
    <p class="p">Lore ameturutem. Unde impedit laboriosam deserunt ipsa?</p>
  </div> -->
</template>

<script>
import CategorySlide from '@/components/CategorySlide.vue'

export default {
  components: {
    CategorySlide,
  },
}
</script>
<style >
.big-box {
  width: 300px;
  height: 300px;
  overflow: scroll;
}
.p {
  margin: 25px;
  white-space: nowrap;
}
</style>