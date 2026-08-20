<template>
  <v-container fluid>
    <!-- 預覽切換按鈕（開發用） -->
    <v-row no-gutters class="px-3 mb-2">
      <v-btn-toggle v-model="previewMode" mandatory dense>
        <v-btn small value="results">有結果</v-btn>
        <v-btn small value="empty">無結果</v-btn>
      </v-btn-toggle>
    </v-row>

    <!-- ===== 有結果狀態 ===== -->
    <template v-if="previewMode === 'results'">
      <!-- 麵包屑列 + AI Search -->
      <v-row no-gutters class="px-3 align-center mb-2">
        <v-col>
          <v-breadcrumbs large :items="breadcrumbs" class="primary--text pa-0"></v-breadcrumbs>
        </v-col>
        <v-col cols="auto" class="text-body-2 grey--text">AI Search</v-col>
      </v-row>

      <!-- 排序列 PC版 -->
      <v-row no-gutters class="px-3 align-center py-2 d-none d-sm-flex" style="border: 1px solid #e0e0e0; border-radius: 4px;">
        <v-col class="d-flex align-center flex-wrap">
          <span class="text-body-2 mr-2">排序：</span>
          <v-btn text small class="px-2" :color="sortBy === 'end_date' ? 'primary' : ''" @click="sortBy = 'end_date'">截止日 &#x2191;&#x2193;</v-btn>
          <v-btn text small class="px-2" :color="sortBy === 'price' ? 'primary' : ''" @click="sortBy = 'price'">價格 &#x2191;&#x2193;</v-btn>
          <v-btn text small class="px-2" :color="sortBy === 'order_num' ? 'primary' : ''" @click="sortBy = 'order_num'">累積件數 &#x2191;&#x2193;</v-btn>
          <v-btn text small class="px-2 primary--text" :color="sortBy === 'default' ? 'primary' : ''" @click="sortBy = 'default'">預設 <span class="primary--text">&#x2193;</span></v-btn>
          <v-divider vertical class="mx-2" style="height:20px; align-self:center;"></v-divider>
          <v-btn text small class="px-2">篩選更多 &#x25BE;</v-btn>
        </v-col>
        <v-col cols="auto" class="d-flex align-center">
          <span class="text-body-2 mr-2">呈現方式：</span>
          <v-btn-toggle class="ml-1" v-model="gridView" borderless>
            <v-btn small :value="true">
              <background-svg class="mt-1 mr-1" backgroungUrl="/view_list.svg" width="18px" height="18px" color="#000"></background-svg>
              列表
            </v-btn>
            <v-btn small :value="false">
              <background-svg class="mt-1 mr-1" backgroungUrl="/grid_view.svg" width="18px" height="18px" color="#000"></background-svg>
              圖表
            </v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>

      <!-- 排序列 手機版 -->
      <v-row no-gutters class="align-center d-flex d-sm-none" style="border: 1px solid #e0e0e0; border-radius: 4px;">
        <v-col cols="auto" class="d-flex align-center px-2">
          <background-svg backgroungUrl="/filter_alt.svg" width="20px" height="20px" color="#333" class="mr-1"></background-svg>
          <v-btn text small class="px-1">篩選更多</v-btn>
        </v-col>
        <v-col class="px-1">
          <v-select
            v-model="sortBy"
            :items="sortOptions"
            item-text="label"
            item-value="value"
            dense
            solo
            flat
            hide-details
            class="text-body-2"
            style="border: 1px solid #bdbdbd; border-radius: 4px;"
          ></v-select>
        </v-col>
        <v-col cols="auto" class="px-2">
          <v-btn-toggle v-model="gridView" borderless dense>
            <v-btn small :value="true" icon>
              <background-svg backgroungUrl="/view_list.svg" width="20px" height="20px" color="#333"></background-svg>
            </v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>

      <!-- 格狀商品列表 -->
      <v-row dense class="mt-2" v-if="!gridView">
        <v-col
          cols="6" sm="3" md="3"
          v-for="product in mockProducts"
          :key="product.product_id"
          class="pa-2"
        >
          <pec-product-card
            :product="product"
            :to="{ name: 'Home', params: {} }"
            :is-login="false"
            :is-verified="false"
            :show-expired="false"
            :show-del-btn="false"
            :show-del-select="false"
            :hide-track="true"
            section-name="search-preview"
          ></pec-product-card>
        </v-col>
      </v-row>

      <!-- 列表商品列表 -->
      <v-row dense class="mt-2" v-else>
        <v-col cols="12" v-for="product in mockProducts" :key="product.product_id">
          <pec-product-row
            :product="product"
            :to="{ name: 'Home', params: {} }"
            :is-login="false"
            :is-verified="false"
            :show-expired="false"
            :show-del-btn="false"
            :show-del-select="false"
            :hide-track="true"
            section-name="search-preview"
          ></pec-product-row>
        </v-col>
      </v-row>

      <!-- 你可能也喜歡的商品 -->
      <div class="d-flex align-center my-6 px-3">
        <v-divider></v-divider>
        <span class="mx-4 text-body-1 grey--text text--darken-1 text-no-wrap">你可能也喜歡的商品</span>
        <v-divider></v-divider>
      </div>

      <v-row dense>
        <v-col
          cols="6" sm="3" md="3"
          v-for="product in recommendProducts"
          :key="'like-' + product.product_id"
          class="pa-2"
        >
          <pec-product-card
            :product="product"
            :to="{ name: 'Home', params: {} }"
            :is-login="false"
            :is-verified="false"
            :show-expired="false"
            :show-del-btn="false"
            :show-del-select="false"
            :hide-track="true"
            section-name="search-preview-like"
          ></pec-product-card>
        </v-col>
      </v-row>
    </template>

    <!-- ===== 無結果狀態 ===== -->
    <template v-else>
      <div class="text-center system-text my-4">
        很抱歉，系統找不到您想要的「<span style="color: #d86816">步道</span>」。您可以嘗試使用不同的描述詞，或直接聯繫客服人員，我們將盡力協助您。
      </div>
      <div class="text-center text-body-2 grey--text mb-4">
        根據關鍵字我們找到以下其他相關商品
      </div>

      <!-- 您可能感興趣的商品 -->
      <div class="d-flex align-center my-6 px-3">
        <v-divider></v-divider>
        <span class="mx-4 text-body-1 grey--text text--darken-1 text-no-wrap">您可能感興趣的商品</span>
        <v-divider></v-divider>
      </div>

      <v-row dense>
        <v-col
          cols="6" sm="4" md="3" lg="2"
          v-for="product in mockProducts"
          :key="'rec-' + product.product_id"
          class="pa-md-3"
        >
          <pec-product-card
            :product="product"
            :to="{ name: 'Home', params: {} }"
            :is-login="true"
            :is-verified="true"
            :show-expired="false"
            :show-del-btn="false"
            :show-del-select="false"
            :hide-track="true"
            section-name="search-preview-recommend"
          ></pec-product-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script>
import PecProductCard from '@/components/PecProductCard.vue'
import PecProductRow from '@/components/PecProductRow.vue'
import BackgroundSvg from '@/components/BackgroundSvg.vue'


const makeProduct = (id, name, subtitle, price, listPrice, endDate) => ({
  product_id: id,
  item_main_id: id,
  product_name: name,
  subtitle: subtitle,
  img_url: `https://picsum.photos/seed/${id}/300/300`,
  min_discount_price: price,
  max_discount_price: price,
  max_list_price: listPrice,
  start_date: '2024-01-01',
  end_date: endDate,
  receive_type: '1:2',
  track_status: 'N',
  teambuy: 'Y',
  inv_num: 100,
  order_num_with_ratio: 5,
  acc_order_num: 12,
  goal_num: 3,
  hide_order_num: 'N',
  hide_price: 'N',
  expired: 'N',
  noticed: 'N',
  tb_status: null,
  purchase_instruction: null,
})

export default {
  name: 'SearchPreview',
  components: { PecProductCard, PecProductRow, BackgroundSvg },
  data() {
    return {
      gridView: false,
      previewMode: 'results',
      sortBy: 'default',
      sortOptions: [
        { label: '預設', value: 'default' },
        { label: '截止日', value: 'end_date' },
        { label: '價格', value: 'price' },
        { label: '累積件數', value: 'order_num' },
      ],
      breadcrumbs: [
        { text: '首頁', disabled: false, to: '/' },
        { text: '搜尋結果' },
      ],
      mockProducts: [
        makeProduct(1,  '【ONFORE】純水無香棉柔嬰兒濕紙巾 80抽×3包', '純水無香', 299,  499, '2026-10-23'),
        makeProduct(2,  '【ONFORE】超純淨無香 濕巾補充包 100抽×5包', '純水無香', 399,  650, '2026-10-23'),
        makeProduct(3,  '純水無香精柔嬰兒濕巾 80抽 大包裝', null,      189,  280, '2026-10-31'),
        makeProduct(4,  '【Marie Claire 美姬仁】超純淨口袋濕巾 純水無香 20抽×10包', '熱銷推薦', 450, 700, '2026-10-23'),
        makeProduct(5,  '純水無香棉柔洗臉巾 100抽 敏感肌適用', '敏感肌推薦', 320, 480, '2026-11-15'),
        makeProduct(6,  '【ONFORE】純水無香嬰兒濕紙巾 一次性 含蓋 80抽×6包', null, 599, 999, '2026-10-23'),
        makeProduct(7,  '純水無香濕巾 旅行裝 10抽×20包', '旅行必備', 250, 380, '2026-12-01'),
        makeProduct(8,  '【Marie Claire 美姬仁】純水無香棉柔巾 雙層加厚 100抽', '雙層加厚', 360, 550, '2026-10-31'),
        makeProduct(9,  '純水無香嬰兒柔濕巾 新生兒適用 80抽×8包', null, 699, 1100, '2026-10-23'),
        makeProduct(10, '【ONFORE】純水無香棉柔洗臉巾 一次性 純棉 50抽', '純棉材質', 280, 420, '2026-11-30'),
        makeProduct(11, '純水無香嬰兒濕巾 低敏配方 80抽×4包', '低敏配方', 380, 580, '2026-10-23'),
        makeProduct(12, '【Marie Claire 美姬仁】純水無香旅行濕巾禮盒組', '禮盒組', 520, 800, '2026-12-25'),
      ],
      recommendProducts: [
        makeProduct(101, '【統一生機】原味腰果隨手包 30g×12包/組', '廠缺供貨日未知', 388, 468, '2026-06-27'),
        makeProduct(102, '【統一生機】珍饌開心果第(28)圈', '廠缺供貨日未知', 369, 450, '2026-06-27'),
        makeProduct(103, '【統一】多多活性發酵乳（草莓）170ml×6入', '399元宅配直送', 59, 72, '2026-06-30'),
        makeProduct(104, '【統一生機】脆穀優果麥片-香甜紫薯(240g×2包/組)', '不添加色素', 319, 398, '2026-06-27'),
        makeProduct(105, '【統一生機】黑豆茶 8g×20包/盒', null, 280, 360, '2026-07-10'),
        makeProduct(106, '【統一】麥香紅茶 300ml×24瓶/箱', '大量優惠', 299, 480, '2026-07-05'),
        makeProduct(107, '【統一生機】綜合堅果禮盒 30g×8包', '送禮首選', 450, 580, '2026-06-27'),
        makeProduct(108, '【統一】鮮乳坊全脂鮮乳 936ml×2瓶', null, 199, 260, '2026-07-01'),
      ],
    }
  },
}
</script>
