  <template>
  <pec-member-template
    :breadcrumbs="[
      {
        text: '首頁',
        disabled: false,
        to: '/',
      },
      {
        text: '活動攻略',
        disabled: false,
      },
    ]"
  >
    <v-card class="pa-2">
      <rebate-content></rebate-content>
    </v-card>
  </pec-member-template>
</template>
<script>
import PecMemberTemplate from '@/components/PecMemberTemplate.vue'
import RebateContent from '@/components/RebateContent.vue'
export default {
  components: { PecMemberTemplate, RebateContent },
}
</script>
<style scoped>
table {
  border-collapse: collapse;
}
table td {
  border: 1px solid #707070;
  padding: 8px;
}
</style>
