<template>
  <div>
    <v-img :src="imgSrc" class="pec-page"> </v-img>
    <pec-line></pec-line>
    <v-container fluid class="mt-4">
      <v-row>
        <v-col cols="12" class="pa-0">
          <v-breadcrumbs
            large
            :items="breadcrumbs"
            class="primary--text"
          ></v-breadcrumbs>
        </v-col>
        <v-col cols="3" class="d-none d-md-block">
          <v-card>
            <v-card-title
              class="text-subtitle-1 white--text"
              style="background-color: #cf362c"
            >
              您好，<img
                class="mr-1 pb-1"
                :width="20"
                aspect-ratio="1/1"
                :src="membershipInfo.currentGradeImgUrl"
              />{{ membershipInfo.currentGrade }}
              {{ displayName || userId }}
              <v-spacer></v-spacer>
              <v-btn
                small
                class="primary--text"
                color="white"
                elevation="0"
                @click="logout"
              >
                登出
              </v-btn>
            </v-card-title>
            <v-card-text class="pa-0">
              <v-list flat class="pa-0">
                <v-list-item-group color="primary">
                  <v-list-item style="height: 56px" :to="'/member-centre'">
                    <v-list-item-content>
                      <v-list-item-title
                        class="d-flex align-center"
                        style="font-size: 18px"
                        ><svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clip-path="url(#clip0_198_1015)">
                            <path
                              d="M19 21H5C4.73478 21 4.48043 20.8946 4.29289 20.7071C4.10536 20.5196 4 20.2652 4 20V11H1L11.327 1.61198C11.5111 1.44446 11.7511 1.35162 12 1.35162C12.2489 1.35162 12.4889 1.44446 12.673 1.61198L23 11H20V20C20 20.2652 19.8946 20.5196 19.7071 20.7071C19.5196 20.8946 19.2652 21 19 21ZM6 19H18V9.15698L12 3.70298L6 9.15698V19ZM8 15H16V17H8V15Z"
                              fill="#4F4F4F"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_198_1015">
                              <rect width="24" height="24" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                        <span
                          class="ml-2 mt-1 font-weight-bold"
                          style="color: #4f4f4f"
                        >
                          會員中心
                        </span>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <template v-for="(memberNavArray, index) in navArray"
                    ><v-list-item
                      :key="'title' + index"
                      style="
                        height: 56px;
                        background-color: #ffebeb;
                        border-bottom: 5px solid #cf362c;
                      "
                    >
                      <v-list-item-content>
                        <v-list-item-title
                          class="d-flex align-center font-weight-bold primary--text"
                          style="font-size: 16px"
                        >
                          {{ memberNavArray[0].title }}
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <div v-for="item in memberNavArray" :key="item.id">
                      <template
                        ><v-list-item
                          :to="item.to"
                          style="height: 56px"
                          :style="`${
                            $route.path == item.to
                              ? 'background-color:#ebeae8'
                              : ''
                          }`"
                        >
                          <v-list-item-content>
                            <v-list-item-title
                              class="d-flex align-center pl-2"
                              style="font-size: 16px; color: #4f4f4f"
                            >
                              {{ item.name }}
                            </v-list-item-title>
                          </v-list-item-content> </v-list-item
                        ><v-divider></v-divider
                      ></template>
                    </div>
                  </template>

                  <!-- <template v-for="item in memberNavArray">
                    <v-list-item v-if="item.to" :key="item.id" :to="item.to">
                      <v-list-item-content>
                        <v-list-item-title> {{ item.name }} </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                      v-else
                      :key="item.id"
                      @click="$store.commit(item.clickEvent)"
                      class="active-black"
                    >
                      <v-list-item-content>
                        <v-list-item-title> {{ item.name }} </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider :key="item.id + 'd'"></v-divider>
                  </template> -->
                </v-list-item-group>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="9">
          <slot></slot>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import PecLine from '@/components/PecLine.vue'

export default {
  props: ['imgSrc', 'breadcrumbs'],
  components: {
    PecLine,
  },
  computed: {
    ...mapState(['memberNavArray', 'newMemberNavArray']),
    ...mapGetters([
      'isLogin',
      'userId',
      'displayName',
      'isGpMaster',
      'membershipInfo',
    ]),
    navArray() {
      if (new Date() > new Date('2024-05-31T23:59:59+08:00')) {
        return this.newMemberNavArray
      } else {
        let data = this.newMemberNavArray.map(e => {
          return e.filter(x => x.name !== '每日簽到')
        })
        return data
      }
    },
  },
  methods: {
    async logout() {
      await this.$store.dispatch('inOrOutLog', { event_name: 'logout' })
      this.$store.dispatch('logout')
      this.$gtm.trackEvent({
        event: 'logout',
        userId: '',
      })
      this.$router.push({
        path: '/',
      })
    },
  },
}
</script>
<style scoped>
.active-black {
  color: rgba(0, 0, 0, 0.87);
}
</style>
