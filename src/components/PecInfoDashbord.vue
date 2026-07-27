<template>
  <div
    class="mx-2 pt-1 pt-md-4 pb-1 pb-md-4 mt-2 mt-md-9 mb-0 mb-md-3 mb-md-4 info-dashboard"
    v-if="isLogin"
  >
    <div class="info-dashboard-item" @click="clickTo('/member-centre')">
      <div class="info-dashboard-item-content py-2 py-md-0">
        <div class="d-flex info-dashboard-title mb-0 mb-md-3">
          <div class="mr-2" style="height: 27px">
            <v-img :src="memberShipInfo.currentGradeImgUrl" width="24"></v-img>
          </div>
          <div
            class="font-weight-bold info-dashboard-title-text"
            :style="{ color: memberShipInfo.currentGradeColor }"
            style="font-size: 18px"
          >
            {{ memberShipInfo.currentGrade }}
          </div>
        </div>
        <div class="mb-md-2">
          <div class="d-flex justify-space-between">
            <div class="font-weight-bold info-dashboard-text mb-1">
              {{ memberShipInfo.diffAmt ? '再消費' : '結帳金額' }}
            </div>
            <div
              class="font-weight-bold info-dashboard-value cursor-pointer mb-1 ml-2"
              @click.stop="clickTo('/member-centre')"
            >
              {{
                memberShipInfo.diffAmt
                  ? memberShipInfo.diffAmt.toLocaleString()
                  : '已達標'
              }}
            </div>
            <div
              v-if="memberShipInfo.diffAmt"
              class="info-dashboard-text font-weight-bold ml-2"
            >
              元
            </div>
          </div>
          <!-- <div class="d-flex justify-space-between">
            <div class="font-weight-bold info-dashboard-text">
              {{ memberShipInfo.diffCount ? '再結帳' : '結帳次數' }}
            </div>
            <div
              class="font-weight-bold info-dashboard-value cursor-pointer"
              @click.stop="clickTo('/member-centre')"
            >
              {{
                memberShipInfo.diffCount ? memberShipInfo.diffCount : '已達標'
              }}
            </div>
            <div
              v-if="memberShipInfo.diffCount"
              class="info-dashboard-text font-weight-bold ml-2"
            >
              次
            </div>
          </div> -->
        </div>
        <div class="d-flex justify-space-between">
          <span v-if="memberShipInfo.word" class="font-weight-bold">
            {{
              memberShipInfo.word.includes('延續')
                ? memberShipInfo.word.slice(0, 2)
                : memberShipInfo.word
            }}
          </span>
          <span class="primary--text font-weight-bold ml-2 member-ship-grade">
            {{ memberShipInfo.nextGrade }}
          </span>
        </div>
      </div>
    </div>

    <div
      class="info-dashboard-item d-none d-md-flex mb-4 mb-md-0"
      @click="clickTo('/reward')"
    >
      <div class="info-dashboard-item-content">
        <div class="d-flex mb-0 mb-md-3 info-dashboard-title">
          <div class="mr-2" style="height: 27px">
            <background-svg
              backgroungUrl="/ri-couon.svg"
              width="24px"
              height="24px"
              color="#EA7D08"
            ></background-svg>
          </div>
          <div class="font-weight-bold info-dashboard-title-text">折價券</div>
        </div>
        <div class="d-flex justify-space-between">
          <div class="mb-0 mb-md-3">
            <div class="font-weight-bold mb-1 mb-md-3 info-dashboard-text">
              尚未使用
            </div>
            <div class="font-weight-bold info-dashboard-text">即將到期</div>
          </div>
          <div class="d-flex flex-column align-end">
            <div class="d-flex">
              <div
                class="ml-4 font-weight-bold info-dashboard-value mb-2 mb-md-3 cursor-pointer"
                @click.stop="clickTo('/reward')"
              >
                {{ userInfo.availableReward }}
              </div>
              <div
                class="info-dashboard-text font-weight-bold d-none d-md-block ml-2"
              >
                元
              </div>
            </div>
            <div class="d-flex">
              <div
                class="ml-4 font-weight-bold info-dashboard-value cursor-pointer"
                @click.stop="clickTo('/reward')"
              >
                {{ userInfo.expiredRewardAfter7 }}
              </div>
              <div
                class="info-dashboard-text font-weight-bold d-none d-md-block ml-2"
              >
                元
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="info-dashboard-item d-none d-md-flex"
      @click="clickTo('/my-order')"
    >
      <div class="info-dashboard-item-content">
        <div
          class="d-flex mb-0 mb-md-3 info-dashboard-title justify-space-between"
        >
          <div class="d-flex align-top">
            <v-icon class="mr-2 pb-1" color="#EA7D08" size="18"
              >fa fa-regular fa-basket-shopping</v-icon
            >
            <div class="font-weight-bold info-dashboard-title-text">
              購物清單
            </div>
          </div>
        </div>
        <div class="justify-space-between d-flex">
          <div>
            <div class="font-weight-bold mb-0 mb-md-3 info-dashboard-text">
              待取貨
            </div>
            <div class="font-weight-bold info-dashboard-text">待出貨</div>
          </div>
          <div class="d-flex flex-column align-end">
            <div
              class="ml-4 font-weight-bold info-dashboard-value mb-0 mb-md-3 cursor-pointer"
              @click.stop="clickTo('/my-order?status=取貨點已到貨')"
            >
              {{ userInfo.receiveStatus2 }}
            </div>
            <div
              class="ml-4 font-weight-bold info-dashboard-value cursor-pointer"
              @click.stop="clickTo('/my-order?status=訂單成立')"
            >
              {{ userInfo.receiveStatus0 }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="info-dashboard-item flex-column">
      <div
        class="mb-md-0 d-flex justify-center"
        @click="clickTo('/my-oppoint')"
      >
        <div class="info-dashboard-item-content">
          <div class="d-flex justify-center">
            <div class="info-dashboard-item-img pt-2 pt-md-0">
              <v-img src="/open-point.png" contain></v-img>
            </div>
          </div>
          <div
            class="d-flex justify-center flex-column mt-md-4"
            style="margin-top: 6px"
          >
            <div class="d-flex justify-space-between">
              <div class="font-weight-bold mb-0 mb-md-3 info-dashboard-text">
                本月贈
              </div>
              <div
                class="font-weight-bold info-dashboard-value mb-0 mb-md-3 mx-1 mx-md-4 cursor-pointer"
                @click.stop="clickTo('/my-oppoint')"
              >
                {{ userInfo.opPoint }}
              </div>
              <div class="info-dashboard-text font-weight-bold">點</div>
            </div>
          </div>
        </div>
      </div>
      <div class="mb-md-0 d-flex justify-center" @click="clickTo('/my-follow')">
        <div class="info-dashboard-item-content">
          <div class="d-flex justify-center flex-column">
            <div
              class="d-flex justify-space-between align-center mt-1 mt-md-0"
              style="width: 100%"
            >
              <div class="d-flex justify-center align-center">
                <div class="mr-2" style="height: 27px">
                  <background-svg
                    backgroungUrl="/ri-chat-heart-line.svg"
                    width="24px"
                    height="24px"
                    color="#EA7D08"
                  ></background-svg>
                </div>
                <div class="font-weight-bold info-dashboard-title-text">
                  追蹤清單
                </div>
              </div>
              <div
                class="ml-4 font-weight-bold info-dashboard-value cursor-pointer"
                @click.stop="clickTo('/my-follow')"
              >
                {{ userInfo.trackProduct }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- <div
      class="info-dashboard-item d-none d-md-flex"
      @click="clickTo('/my-wish')"
    >
      <div class="info-dashboard-item-content">
        <div
          class="d-flex mb-0 mb-md-3 info-dashboard-title justify-space-between"
        >
          <div class="d-flex align-top">
            <div class="mr-2" style="height: 27px">
              <background-svg
                backgroungUrl="/ri-magic-line.svg"
                width="24px"
                height="24px"
                color="#EA7D08"
              ></background-svg>
            </div>
            <div class="font-weight-bold info-dashboard-title-text">許願池</div>
          </div>
        </div>
        <div class="justify-space-between d-flex" style="width: 100%">
          <div>
            <div class="font-weight-bold mb-0 mb-md-3 info-dashboard-text">
              許願中
            </div>
            <div class="font-weight-bold info-dashboard-text">已還願</div>
          </div>
          <div class="d-flex flex-column align-end">
            <div
              class="ml-4 font-weight-bold info-dashboard-value mb-0 mb-md-3 cursor-pointer"
              @click.stop="clickTo('/my-wish?status=許願中')"
            >
              {{ userInfo.recommend }}
            </div>
            <div
              class="ml-4 font-weight-bold info-dashboard-value cursor-pointer"
              @click.stop="clickTo('/my-wish?status=已開團')"
            >
              {{ userInfo.recommendSuccess }}
            </div>
          </div>
        </div>
      </div>
    </div> -->

    <div class="info-dashboard-item flex-column d-flex d-md-none">
      <div class="mb-md-0 d-flex justify-center" @click="clickTo('/my-order')">
        <div class="info-dashboard-item-content">
          <div
            class="d-flex mb-0 mb-md-3 pt-2 info-dashboard-title justify-space-between"
          >
            <div class="d-flex align-top">
              <v-icon class="mr-2 pb-1" color="#EA7D08" size="18"
                >fa fa-regular fa-basket-shopping</v-icon
              >
              <div class="font-weight-bold info-dashboard-title-text">
                購物清單
              </div>
            </div>
          </div>
          <div
            class="d-flex justify-center flex-column mt-md-4"
            style="margin-top: 6px"
          >
            <div class="d-flex justify-space-between">
              <div class="font-weight-bold mb-0 mb-md-3 info-dashboard-text">
                待取貨
              </div>
              <div
                class="font-weight-bold info-dashboard-value mb-0 mb-md-3 cursor-pointer"
                @click.stop="clickTo('/my-order?status=取貨點已到貨')"
              >
                {{ userInfo.receiveStatus2 }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mb-md-0 d-flex justify-center" @click="clickTo('/my-follow')">
        <div class="info-dashboard-item-content">
          <div class="d-flex justify-center flex-column">
            <div
              class="d-flex justify-space-between align-center mt-1 mt-md-0"
              style="width: 100%"
            >
              <div class="d-flex justify-center align-center">
                <div class="font-weight-bold info-dashboard-title-text">
                  待出貨
                </div>
              </div>
              <div
                class="ml-4 font-weight-bold info-dashboard-value cursor-pointer"
                @click.stop="clickTo('/my-order?status=訂單成立')"
              >
                {{ userInfo.receiveStatus0 }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="info-dashboard-item flex-column d-flex d-md-none">
      <div class="mb-md-0 d-flex justify-center" @click="clickTo('/reward')">
        <div class="info-dashboard-item-content">
          <div
            class="d-flex mb-0 mb-md-3 pt-2 info-dashboard-title justify-space-between"
          >
            <div class="d-flex align-top">
              <div class="mr-2" style="height: 27px">
                <background-svg
                  backgroungUrl="/ri-couon.svg"
                  width="24px"
                  height="24px"
                  color="#EA7D08"
                ></background-svg>
              </div>
              <div class="font-weight-bold info-dashboard-title-text">
                折價券
              </div>
            </div>
          </div>
          <div
            class="d-flex justify-center flex-column mt-md-4"
            style="margin-top: 6px"
          >
            <div class="d-flex justify-space-between">
              <div class="font-weight-bold mb-0 mb-md-3 info-dashboard-text">
                尚未使用
              </div>
              <div
                class="font-weight-bold info-dashboard-value mb-0 mb-md-3 cursor-pointer"
                @click.stop="clickTo('/reward')"
              >
                {{ userInfo.availableReward }}
              </div>
              <div class="font-weight-bold info-dashboard-text">元</div>
            </div>
          </div>
        </div>
      </div>
      <div class="mb-md-0 d-flex justify-center" @click="clickTo('/my-follow')">
        <div class="info-dashboard-item-content">
          <div class="d-flex justify-center flex-column">
            <div
              class="d-flex justify-space-between align-center mt-1 mt-md-0"
              style="width: 100%"
            >
              <div class="d-flex justify-center align-center">
                <div class="font-weight-bold info-dashboard-title-text">
                  即將到期
                </div>
              </div>
              <div
                class="font-weight-bold info-dashboard-value cursor-pointer"
                @click.stop="clickTo('/reward')"
              >
                {{ userInfo.expiredRewardAfter7 }}
              </div>
              <div class="font-weight-bold info-dashboard-text">元</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- <div
      class="info-dashboard-item d-flex d-md-none"
      style="position: relative"
      @click="showShop = !showShop"
    >
      <div class="info-dashboard-item-content">
        <div
          class="d-flex mb-0 mb-md-3 pt-2 info-dashboard-title justify-space-between"
        >
          <div class="d-flex align-top">
            <v-icon class="mr-2 pb-1" color="#EA7D08" size="18"
              >fa fa-regular fa-basket-shopping</v-icon
            >
            <div class="font-weight-bold info-dashboard-title-text">
              購物清單
            </div>
          </div>
          <div
            class="ml-4 font-weight-bold info-dashboard-value mb-1 mb-md-3 cursor-pointer d-block d-md-none"
            v-if="!showShop"
          >
            {{ userInfo.receiveStatus2 + userInfo.receiveStatus0 }}
          </div>
          <div style="height: 25.19px" v-else>
            <v-icon size="20" color="primary">
              fa-light fa-circle-chevron-up
            </v-icon>
          </div>
        </div>
      </div>
      <div class="mobile-info-area" :class="{ active: showShop }">
        <div class="justify-space-between d-flex">
          <div style="flex: 1 0 auto; padding-left: 32px">
            <div
              class="font-weight-bold mb-0 mb-md-3 mt-2 info-dashboard-text"
              @click.stop="clickTo('/my-order?status=取貨點已到貨')"
            >
              待取貨
            </div>
            <div
              class="font-weight-bold info-dashboard-text mb-2"
              @click.stop="clickTo('/my-order?status=訂單成立')"
            >
              待出貨
            </div>
          </div>
          <div class="d-flex flex-column align-end">
            <div
              class="ml-4 font-weight-bold info-dashboard-value mb-1 mb-md-3 mt-2 cursor-pointer"
              @click.stop="clickTo('/my-order?status=取貨點已到貨')"
            >
              {{ userInfo.receiveStatus2 }}
            </div>
            <div
              class="ml-4 font-weight-bold info-dashboard-value cursor-pointer"
              @click.stop="clickTo('/my-order?status=訂單成立')"
            >
              {{ userInfo.receiveStatus0 }}
            </div>
          </div>
        </div>
      </div>
    </div> -->

    <!-- <div
      class="info-dashboard-item d-flex d-md-none"
      style="position: relative"
      @click="showWish = !showWish"
    >
      <div class="info-dashboard-item-content">
        <div
          class="d-flex mb-0 mb-md-3 pt-2 info-dashboard-title justify-space-between"
        >
          <div class="d-flex align-top">
            <div class="mr-2" style="height: 27px">
              <background-svg
                backgroungUrl="/ri-couon.svg"
                width="24px"
                height="24px"
                color="#EA7D08"
              ></background-svg>
            </div>

            <div class="font-weight-bold info-dashboard-title-text">折價券</div>
          </div>
          <div
            class="ml-4 font-weight-bold info-dashboard-value mb-1 mb-md-3 cursor-pointer d-block d-md-none"
            v-if="!showWish"
          >
            {{ userInfo.availableReward }}
          </div>
          <div v-else>
            <v-icon size="20" color="primary">
              fa-light fa-circle-chevron-up
            </v-icon>
          </div>
        </div>
      </div>
      <div class="mobile-info-area" :class="{ active: showWish }">
        <div class="justify-space-between d-flex">
          <div style="flex: 1 0 auto; padding-left: 32px">
            <div
              class="font-weight-bold mb-0 mb-md-3 mt-2 info-dashboard-text"
              @click.stop="clickTo('/reward')"
            >
              可用張數
            </div>
            <div
              class="font-weight-bold info-dashboard-text mb-2"
              @click.stop="clickTo('/reward')"
            >
              即將到期
            </div>
          </div>
          <div class="d-flex flex-column align-end">
            <div
              class="ml-4 font-weight-bold info-dashboard-value mb-1 mb-md-3 mt-3 cursor-pointer"
              @click.stop="clickTo('/reward')"
            >
              {{ userInfo.availableReward }}
            </div>
            <div
              class="ml-4 font-weight-bold info-dashboard-value cursor-pointer"
              @click.stop="clickTo('/reward')"
            >
              {{ userInfo.expiredRewardAfter7 }}
            </div>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>
<script>
export default {
  props: ['isLogin', 'userInfo', 'memberShipInfo'],
  mounted() {},
  watch: {},
  data() {
    return {
      isLoading: false,
      showShop: false,
      showWish: false,
    }
  },
  methods: {
    clickTo(url) {
      if (url.startsWith('/')) {
        this.$router.push(url)
      }
    },
  },
  beforeDestroy() {},
}
</script>
<style scoped>
.info-dashboard {
  border: 3px solid #ea7d08;
  border-radius: 5px;
  font-size: 18px;
  justify-content: space-around;
  display: flex;
}
.info-dashboard-item-content {
  width: fit-content;
  min-width: 116px;
}
.info-dashboard-text {
  line-height: 2;
  height: 30px;
}
.info-dashboard-value {
  background-color: #fff0e4;
  padding: 4px 6px 1px 6px;
  border-radius: 5px;
  color: #ea7d08;
  min-width: 28px;
  text-align: center;
}
.info-dashboard-item {
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  height: fit-content;
  cursor: pointer;
}
.info-dashboard-item::after {
  position: absolute;
  content: '';
  display: block;
  width: 2px;
  /* height: 79px; */
  height: 83px;
  background-color: #d9d9d9;
  right: -1px;
  top: 21px;
}
.info-dashboard .info-dashboard-item:nth-child(4)::after {
  display: none;
}
.info-dashboard-item-img {
  width: 162px;
}
.mobile-info-area {
  position: absolute;
  width: 98%;
  background-color: #fff;
  padding: 0px 10px;
  border-radius: 0 0 10px 10px;
  top: 35px;
  z-index: 5;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  height: initial;
  max-height: 0px;
  overflow: hidden;
  transition: all 0.3s ease-in-out;
}

.mobile-info-area.active {
  max-height: 1000px;
}

.member-ship-grade {
  border-bottom: 3px solid var(--v-primary-base);
}
@media (max-width: 960px) {
  .info-dashboard {
    flex-wrap: wrap;
    box-shadow: 0px 2px 2px rgba(34, 62, 66, 0.25);
    border: 2px solid #ea7d08;
    font-size: 16px;
    position: relative;
    border-radius: 10px;
  }
  .info-dashboard:after {
    position: absolute;
    content: '';
    display: block;
    width: 96%;
    height: 2px;
    background-color: #d9d9d9;
    right: 2%;
    /* top: 74%; */
    top: 52%;
    /* bottom: 10px; */
  }
  .info-dashboard-item {
    width: 50%;
  }
  .info-dashboard .info-dashboard-item:nth-child(even)::after {
    display: none;
  }
  /* .info-dashboard .info-dashboard-item:nth-last-child(2)::after {
    display: none;
  } */
  .info-dashboard-item-img {
    width: 146px;
  }
  .info-dashboard-text {
    height: initial;
    line-height: 1.5;
  }
  .info-dashboard-value {
    padding: 2px 3px 0px 3px;
    line-height: 1.2;
    height: 21.19px;
  }
  .info-dashboard-item::after {
    /* top: 2px; */
    top: 9px;
  }
  .info-dashboard-title-text {
    line-height: 1.5;
  }
  .info-dashboard-item-content {
    width: fit-content;
    min-width: 87%;
  }
}
</style>
