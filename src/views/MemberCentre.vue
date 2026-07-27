<template>
  <v-container class="my-8">
    <v-row>
      <v-col cols="12" class="pt-0"
        ><v-breadcrumbs
          large
          :items="items"
          class="primary--text pa-0"
        ></v-breadcrumbs
      ></v-col>
      <v-col v-if="membershipInfo.monthlyInfo.length > 0" cols="12"
        ><div class="d-flex align-center text-h6">
          <div class="mr-2">您好，</div>
          <div class="mr-2" style="width: 20px">
            <v-img
              :width="20"
              :src="membershipInfo.currentGradeImgUrl"
              aspect-ratio="1"
              cover
            ></v-img>
          </div>

          <div
            class="font-weight-bold"
            :style="`color: ${membershipInfo.currentGradeColor}`"
          >
            {{ membershipInfo.currentGrade }}
          </div>
          <div class="ml-1 primary--text">{{ display_name }}</div>
        </div></v-col
      >
      <v-col cols="12" lg="8">
        <v-row>
          <v-col v-if="membershipInfo.monthlyInfo.length > 0" cols="12">
            <v-card>
              <div class="member-centre-head" @click="clickTo('/profile')">
                會員身分等級表
              </div>

              <div class="pa-5">
                <v-row>
                  <v-col>
                    <div class="d-flex mb-2 wrap-member-level-area">
                      <div
                        v-for="item in membershipInfo.monthlyInfo"
                        :key="item.month"
                        class="member-level-area"
                      >
                        <div
                          class="d-flex align-center justify-center member-level-area-title"
                        >
                          {{ item.month }}
                        </div>
                        <div
                          class="d-flex align-center justify-center"
                          style="height: 48px"
                        >
                          <v-tooltip
                            v-model="show[item.month]"
                            bottom
                            :nudge-top="7"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <div
                                v-if="item.imgUrl"
                                icon
                                v-bind="attrs"
                                v-on="on"
                                class="tooltip-arrow"
                                style="width: 32px; height: 32px"
                              >
                                <v-img
                                  :width="32"
                                  :src="item.imgUrl"
                                  aspect-ratio="1"
                                  cover
                                ></v-img>
                              </div>
                            </template>
                            <div
                              style="
                                color: #565656;
                                background-color: #fff;
                                font-size: 14px;
                                border: 1px solid #f8822b;
                                border-top: 8px solid #f8822b;
                                padding: 8px;
                              "
                            >
                              <div>{{ item.grade }}</div>
                              <div>{{ item.period }}</div>
                              <div>
                                本月消費
                                <span style="color: #ca1f1d">{{
                                  item.checkoutMonthAmt
                                }}</span>
                                元
                              </div>
                              <div>
                                結帳金額
                                <span style="color: #ca1f1d">{{
                                  item.checkoutAmt
                                }}</span>
                                元
                              </div>
                            </div>
                          </v-tooltip>
                        </div>
                      </div>
                    </div>
                    <div class="d-flex justify-space-between align-center mb-2">
                      <div class="text-subtitle-2" style="color: #565656">
                        會籍有效期限
                        {{
                          this.$dayjs(membershipInfo.expire).format(
                            'YYYY/MM/DD'
                          )
                        }}
                        <span class="d-none d-sm-inline">|</span>
                        <span style="white-space: nowrap">
                          更新日期
                          {{
                            this.$dayjs(membershipInfo.update).format(
                              'YYYY/MM/DD'
                            )
                          }}
                        </span>
                      </div>
                      <div
                        class="text-subtitle-2"
                        style="
                          color: #0029ff;
                          text-underline-offset: 3px;
                          white-space: nowrap;
                        "
                      >
                        <router-link to="/group-buy">分級辦法</router-link>
                      </div>
                    </div>
                    <!-- <v-divider height="2" class="mb-3"> </v-divider> -->
                    <div
                      class="mb-3"
                      style="
                        width: 100%;
                        height: 2px;
                        background-color: #d9d9d9;
                      "
                    ></div>
                    <div class="d-flex align-end font-weight-bold mb-1">
                      <div>目前年度累計消費</div>
                      <div
                        class="mx-1 font-weight-bold primary--text"
                        v-if="
                          membershipInfo.currentAmt !== null &&
                          membershipInfo.currentAmt !== undefined
                        "
                      >
                        {{ membershipInfo.currentAmt.toLocaleString() }}
                      </div>
                      <div>元 /</div>
                      <div
                        class="ml-2 mr-1 primary--text"
                        v-if="
                          membershipInfo.targetAmt !== null &&
                          membershipInfo.targetAmt !== undefined
                        "
                      >
                        {{ membershipInfo.targetAmt.toLocaleString() }}
                      </div>
                      元
                    </div>
                    <v-progress-linear
                      class="mb-3"
                      color="primary"
                      :value="
                        (membershipInfo.currentAmt / membershipInfo.targetAmt) *
                        100
                      "
                      rounded
                      height="7"
                    ></v-progress-linear>
                    <div class="d-flex font-weight-bold mb-2">
                      <div>本月消費</div>
                      <div
                        class="mx-1 font-weight-bold primary--text"
                        v-if="
                          membershipInfo.currentMonthAmt !== null &&
                          membershipInfo.currentMonthAmt !== undefined
                        "
                      >
                        {{ membershipInfo.currentMonthAmt.toLocaleString() }}
                      </div>
                      <div>元</div>
                    </div>
                    <div
                      v-if="membershipInfo.diffAmt !== 0"
                      class="font-weight-bold mb-2"
                    >
                      <div class="d-flex">
                        <div style="width: 64px; white-space: nowrap">
                          <span style="letter-spacing: 7.6px">再消</span>費
                        </div>
                        <div
                          class="mx-1 font-weight-bold primary--text"
                          v-if="
                            membershipInfo.diffAmt !== null &&
                            membershipInfo.diffAmt !== undefined
                          "
                        >
                          {{ membershipInfo.diffAmt.toLocaleString() }}
                        </div>
                        <div>元</div>
                      </div>
                    </div>
                    <div v-else class="mb-2 font-weight-bold primary--text">
                      恭喜您！已達成
                    </div>
                    <div
                      class="d-flex align-center text-subtitle-1 font-weight-bold"
                    >
                      <div class="mr-2">{{ membershipInfo.word }}</div>
                      <div class="mr-1" style="width: 20px">
                        <v-img
                          :width="20"
                          :src="membershipInfo.nextGradeImgUrl"
                          aspect-ratio="1"
                          cover
                        ></v-img>
                      </div>

                      <div class="ml-1 primary--text mr-2">
                        {{ membershipInfo.nextGrade }}
                      </div>
                      <div>好康優惠</div>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-card></v-col
          >
          <v-col cols="12"
            ><v-card class="">
              <div class="member-centre-head" @click="clickTo('/profile')">
                基本資料
              </div>
              <div class="pa-5">
                <v-row>
                  <v-col cols="12 pb-0 pb-sm-4" sm="6"
                    ><div class="member-centre-info-text">
                      <span class="font-weight-bold" style="color: #ca1f1d"
                        >公司別 : </span
                      ><span style="color: #555">{{ company_name }}</span>
                    </div>
                    <div class="member-centre-info-text">
                      <span class="font-weight-bold" style="color: #ca1f1d"
                        >員工編號 : </span
                      ><span style="color: #555">{{ emp_no_s }}</span>
                    </div>
                    <div class="member-centre-info-text">
                      <span class="font-weight-bold" style="color: #ca1f1d"
                        >姓名 : </span
                      ><span style="color: #555">{{ display_name }}</span>
                    </div>
                    <div class="member-centre-info-text">
                      <span class="font-weight-bold" style="color: #ca1f1d"
                        >E-mail : </span
                      ><span style="color: #555">{{ email }}</span>
                    </div>
                    <div class="member-centre-info-text">
                      <span class="font-weight-bold" style="color: #ca1f1d"
                        >手機號碼 : </span
                      ><span style="color: #555">{{ phone_number }}</span>
                    </div>
                    <div class="member-centre-info-text d-flex align-center">
                      <span class="font-weight-bold" style="color: #ca1f1d"
                        >性別 : </span
                      ><v-radio-group
                        row
                        class="pa-0 ma-0 ml-2"
                        v-model="sex"
                        hide-details
                        disabled
                      >
                        <v-radio label="男" value="M"></v-radio>
                        <v-radio label="女" value="F"></v-radio>
                      </v-radio-group></div
                  ></v-col>
                  <v-col cols="12 pt-0 pt-sm-4 pb-12 pb-sm-4" sm="6"
                    ><div class="member-centre-info-text">
                      <span class="font-weight-bold" style="color: #ca1f1d"
                        >生日 : </span
                      ><span style="color: #555">{{ birthday }}</span>
                    </div>
                    <div class="member-centre-info-text">
                      <span class="font-weight-bold" style="color: #ca1f1d"
                        >贈品領取窗口 : </span
                      ><span style="color: #555">{{ getAreaName }}</span>
                    </div>
                    <div class="member-centre-info-text">
                      <span class="font-weight-bold" style="color: #ca1f1d"
                        >電子發票手機條碼 : </span
                      ><span style="color: #555">{{ carrier_id }}</span>
                    </div>
                    <div class="member-centre-info-text d-flex align-center">
                      <span class="font-weight-bold" style="color: #ca1f1d"
                        >訂閱團購網通知 : </span
                      ><v-radio-group
                        row
                        class="pa-0 ma-0 ml-2"
                        v-model="edm_notification"
                        hide-details
                        disabled
                      >
                        <v-radio label="是" value="Y"></v-radio>
                        <v-radio label="否" value="N"></v-radio>
                      </v-radio-group>
                    </div>
                    <div class="d-flex justify-end user-info-btn">
                      <router-link to="/profile">
                        <svg
                          class="cursor-pointer"
                          width="144"
                          height="32"
                          viewBox="0 0 144 32"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="1"
                            y="1"
                            width="142"
                            height="30"
                            rx="15"
                            stroke="#F8822B"
                            stroke-width="2"
                          />
                          <path
                            d="M19.152 15.84L20.08 16.208C19.104 17.232 17.456 18.064 15.936 18.56C15.776 18.336 15.488 18.032 15.248 17.856C16.688 17.424 18.304 16.672 19.152 15.84ZM20.688 17.376L21.6 17.76C20.384 19.088 18.24 20.096 16.096 20.672C15.936 20.448 15.696 20.096 15.472 19.888C17.504 19.424 19.6 18.512 20.688 17.376ZM22.192 19.12L23.216 19.568C21.632 21.472 18.608 22.624 15.216 23.216C15.104 22.928 14.832 22.512 14.592 22.256C17.808 21.792 20.752 20.768 22.192 19.12ZM17.024 8.56L18.144 8.832C17.36 10.736 16.128 12.544 14.832 13.728C14.64 13.536 14.192 13.168 13.92 13.008C15.2 11.936 16.368 10.272 17.024 8.56ZM16.672 10.304H23.184V11.312H16.064L16.672 10.304ZM20.992 10.528L22.128 10.8C20.832 13.84 18.08 15.568 14.768 16.592C14.624 16.352 14.272 15.872 14.048 15.648C17.28 14.816 19.904 13.248 20.992 10.528ZM16.56 10.928C17.536 12.848 19.952 14.784 23.696 15.488C23.472 15.712 23.184 16.16 23.04 16.448C19.28 15.6 16.88 13.504 15.824 11.52L16.56 10.928ZM12.96 10.464H14.016V20.624H12.96V10.464ZM11.712 8.656L12.832 8.976C11.92 11.744 10.496 14.56 8.896 16.416C8.8 16.144 8.48 15.504 8.272 15.2C9.664 13.6 10.944 11.136 11.712 8.656ZM10.432 12.576L11.552 11.472L11.584 11.504V23.28H10.432V12.576ZM25.744 14.256H29.808V15.36H25.744V14.256ZM25.104 9.968H30.544V15.968H29.392V11.088H25.104V9.968ZM25.104 14.256H26.272V19.36C26.272 19.872 26.384 19.952 27.056 19.952C27.36 19.952 28.912 19.952 29.312 19.952C29.888 19.952 29.984 19.696 30.048 18.064C30.304 18.272 30.8 18.464 31.136 18.544C30.992 20.576 30.656 21.088 29.408 21.088C29.088 21.088 27.232 21.088 26.928 21.088C25.504 21.088 25.104 20.736 25.104 19.376V14.256ZM32.8 11.504H39.392V12.64H32.8V11.504ZM33.216 8.576L34.464 8.784C33.84 11.68 32.8 14.336 31.408 16.064C31.168 15.856 30.64 15.488 30.336 15.312C31.744 13.728 32.704 11.232 33.216 8.576ZM36.96 11.952L38.176 12.096C37.28 18.064 35.232 21.392 30.48 23.344C30.352 23.072 29.984 22.544 29.744 22.272C34.32 20.624 36.192 17.488 36.96 11.952ZM33.28 12.528C34.144 17.072 36.016 20.736 39.584 22.24C39.312 22.48 38.928 22.944 38.736 23.28C35.024 21.536 33.152 17.728 32.176 12.736L33.28 12.528ZM43.632 14.032V16.448H52.416V14.032H43.632ZM42.608 13.216H53.504V17.264H42.608V13.216ZM45.232 11.488H50.816V12.336H45.232V11.488ZM47.424 13.472H48.448V16.816H47.424V13.472ZM47.92 9.536C46.496 10.992 43.824 12.624 41.168 13.616C41.024 13.344 40.752 12.928 40.528 12.672C43.248 11.744 45.952 10.112 47.28 8.56H48.416C50.224 10.304 53.008 11.776 55.488 12.512C55.232 12.768 54.96 13.2 54.784 13.504C52.432 12.688 49.552 11.104 47.92 9.536ZM44.608 14.512L45.472 14.224C45.888 14.784 46.272 15.536 46.432 16.048L45.504 16.384C45.376 15.872 45.008 15.088 44.608 14.512ZM50.368 14.16L51.392 14.48C51.024 15.168 50.624 15.904 50.304 16.384L49.456 16.096C49.76 15.552 50.176 14.704 50.368 14.16ZM43.552 18.032H52.592V23.264H51.376V18.88H44.736V23.28H43.552V18.032ZM44.256 19.952H51.904V20.832H44.256V19.952ZM44.256 21.92H51.904V22.784H44.256V21.92ZM60.224 10.16V11.808H67.824V10.16H60.224ZM59.024 9.184H69.088V12.8H59.024V9.184ZM59.536 16.592V17.728H68.496V16.592H59.536ZM59.536 18.576V19.728H68.496V18.576H59.536ZM59.536 14.624V15.744H68.496V14.624H59.536ZM58.336 13.728H69.728V20.608H58.336V13.728ZM61.392 20.592L62.512 21.328C61.232 22.112 59.152 22.88 57.504 23.296C57.296 23.04 56.896 22.656 56.608 22.416C58.288 22.016 60.384 21.248 61.392 20.592ZM65.296 21.424L66.336 20.64C68 21.136 70.144 21.92 71.392 22.448L70.352 23.312C69.168 22.752 66.992 21.92 65.296 21.424ZM73.536 9.744L74.064 8.928C75.168 9.216 76.656 9.76 77.424 10.16L76.896 11.088C76.144 10.672 74.656 10.096 73.536 9.744ZM72.736 13.12C73.888 12.848 75.584 12.368 77.248 11.904L77.376 12.848C75.92 13.312 74.416 13.808 73.2 14.176L72.736 13.12ZM79.6 9.744H86.032V10.656H78.896L79.6 9.744ZM85.712 9.744H85.904L86.112 9.696L86.912 9.936C86.464 10.768 85.872 11.664 85.296 12.224L84.336 11.888C84.848 11.392 85.392 10.592 85.712 9.92V9.744ZM81.584 10.064H82.688C82.352 12.336 81.328 13.584 78.064 14.24C77.952 13.984 77.696 13.584 77.488 13.376C80.448 12.88 81.312 11.888 81.584 10.064ZM82.64 10.352C82.96 11.712 83.744 13.024 87.296 13.536C87.072 13.776 86.8 14.208 86.672 14.512C82.88 13.856 82.08 12.128 81.664 10.448L82.64 10.352ZM79.856 8.56L80.944 8.736C80.4 9.904 79.584 11.088 78.336 12.048C78.128 11.824 77.712 11.568 77.424 11.44C78.624 10.624 79.44 9.52 79.856 8.56ZM76.048 16.928V18.016H84.112V16.928H76.048ZM76.048 18.8V19.92H84.112V18.8H76.048ZM76.048 15.056V16.144H84.112V15.056H76.048ZM74.88 14.256H85.312V20.72H74.88V14.256ZM81.328 21.536L82.304 20.928C84.064 21.472 86 22.176 87.152 22.72L85.824 23.328C84.816 22.8 83.072 22.112 81.328 21.536ZM77.568 20.896L78.656 21.392C77.36 22.16 75.328 22.896 73.728 23.344C73.536 23.104 73.12 22.64 72.848 22.432C74.496 22.08 76.416 21.52 77.568 20.896ZM91.328 8.624H92.448V23.264H91.328V8.624ZM88.752 13.936H95.072V15.072H88.752V13.936ZM91.152 14.528L91.872 14.848C91.312 17.024 90.176 19.792 89.104 21.248C88.976 20.896 88.688 20.384 88.496 20.064C89.52 18.832 90.64 16.4 91.152 14.528ZM92.416 15.28C92.864 15.76 94.496 17.936 94.864 18.464L94.064 19.424C93.664 18.56 92.352 16.464 91.824 15.776L92.416 15.28ZM88.864 9.808L89.744 9.584C90.192 10.704 90.56 12.16 90.672 13.12L89.728 13.376C89.648 12.416 89.28 10.928 88.864 9.808ZM94.032 9.52L95.088 9.792C94.672 11.008 94.176 12.512 93.744 13.408L92.976 13.168C93.328 12.208 93.808 10.608 94.032 9.52ZM100.24 8.576H101.376V23.28H100.24V8.576ZM95.04 18.752L103.264 17.28L103.456 18.384L95.232 19.872L95.04 18.752ZM96.24 10.528L96.864 9.712C97.792 10.256 98.896 11.072 99.424 11.664L98.784 12.592C98.272 11.968 97.168 11.104 96.24 10.528ZM95.424 14.56L95.984 13.712C96.944 14.208 98.128 14.96 98.704 15.536L98.096 16.48C97.536 15.904 96.384 15.088 95.424 14.56Z"
                            fill="#F8822B"
                          />
                          <g clip-path="url(#clip0_198_1801)">
                            <path
                              d="M121.243 23H133V25H115V20.757L124.9 10.857L129.142 15.101L121.242 23H121.243ZM126.313 9.44402L128.435 7.32202C128.623 7.13455 128.877 7.02924 129.142 7.02924C129.407 7.02924 129.661 7.13455 129.849 7.32202L132.678 10.151C132.865 10.3386 132.971 10.5929 132.971 10.858C132.971 11.1232 132.865 11.3775 132.678 11.565L130.556 13.686L126.314 9.44402H126.313Z"
                              fill="#F8822B"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_198_1801">
                              <rect
                                width="24"
                                height="24"
                                fill="white"
                                transform="translate(112 4)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                      </router-link>
                    </div>
                  </v-col>
                </v-row>
              </div> </v-card
          ></v-col>
          <v-col cols="12" md="6"
            ><v-card>
              <div class="member-centre-head" @click="clickTo('/my-order')">
                消費累積
              </div>
              <div class="py-4 d-flex justify-space-between cursor-pointer">
                <div
                  class="d-flex justify-center flex-column w-100"
                  style="border-right: 2px solid #d9d9d9"
                  @click="clickTo('/my-order?dates=year')"
                >
                  <div
                    class="member-centre-info-title font-weight-bold text-center mb-2"
                  >
                    今年累積消費
                  </div>
                  <div
                    class="member-centre-info-value text-center mb-1"
                    v-if="
                      userInfo.currentYearSpending !== null &&
                      userInfo.currentYearSpending !== undefined
                    "
                  >
                    ${{ userInfo.currentYearSpending.toLocaleString() }}
                  </div>
                </div>
                <div
                  class="d-flex justify-center flex-column w-100"
                  @click="clickTo('/my-order?dates=month')"
                >
                  <div
                    class="member-centre-info-title font-weight-bold text-center mb-2"
                  >
                    本月累積消費
                  </div>
                  <div
                    class="member-centre-info-value text-center mb-1"
                    v-if="
                      userInfo.currentMonthSpending !== null &&
                      userInfo.currentMonthSpending !== undefined
                    "
                  >
                    ${{ userInfo.currentMonthSpending.toLocaleString() }}
                  </div>
                </div>
              </div>
            </v-card></v-col
          ><v-col cols="12" md="6"
            ><v-card>
              <div class="member-centre-head" @click="clickTo('/my-order')">
                出貨狀態
              </div>
              <div
                class="py-4 d-flex justify-space-between"
                style="min-height: 108px"
              >
                <div
                  class="d-flex justify-center align-center w-100"
                  style="border-right: 2px solid #d9d9d9"
                >
                  <div
                    class="member-centre-info-title font-weight-bold text-center mr-3"
                  >
                    待取貨
                  </div>
                  <div
                    class="member-centre-wrap-ship-value"
                    @click.stop="clickTo('/my-order?status=取貨點已到貨')"
                  >
                    <div
                      class="member-centre-ship-value text-center px-1"
                      v-if="
                        userInfo.receiveStatus2 !== null &&
                        userInfo.receiveStatus2 !== undefined
                      "
                    >
                      {{ userInfo.receiveStatus2.toLocaleString() }}
                    </div>
                  </div>
                </div>
                <div class="d-flex justify-center align-center w-100">
                  <div
                    class="member-centre-info-title font-weight-bold text-center mr-3"
                  >
                    待出貨
                  </div>
                  <div
                    class="member-centre-wrap-ship-value"
                    @click.stop="clickTo('/my-order?status=訂單成立')"
                  >
                    <div
                      class="member-centre-ship-value text-center px-1"
                      v-if="
                        userInfo.receiveStatus0 !== null &&
                        userInfo.receiveStatus0 !== undefined
                      "
                    >
                      {{ userInfo.receiveStatus0.toLocaleString() }}
                    </div>
                  </div>
                </div>
              </div>
            </v-card></v-col
          >
          <v-col cols="12"
            ><v-card>
              <div class="member-centre-head" @click="clickTo('/reward')">
                我的折價券
              </div>
              <div>
                <div
                  class="d-flex justify-space-between align-center px-3 py-3"
                >
                  <div class="font-weight-bold" style="color: #555">
                    您尚未領取的折價券({{ userInfo.availableReceiveReward }})
                  </div>

                  <router-link to="/reward?tab=tab-1"
                    ><svg
                      class="cursor-pointer"
                      width="80"
                      height="28"
                      viewBox="0 0 80 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="80" height="28" rx="14" fill="#F8822B" />
                      <path
                        d="M12.742 9.452H25.258V10.432H12.742V9.452ZM14.184 13.96H18.104V14.786H14.184V13.96ZM14.184 16.2H18.104V17.026H14.184V16.2ZM20.442 11.804H21.436V17.558H20.442V11.804ZM17.726 11.678H18.748V18.916C18.748 19.448 18.622 19.728 18.23 19.896C17.852 20.064 17.236 20.064 16.284 20.064C16.228 19.798 16.074 19.406 15.934 19.14C16.634 19.168 17.278 19.168 17.474 19.154C17.67 19.14 17.726 19.084 17.726 18.902V11.678ZM23.284 11.384H24.32V18.818C24.32 19.434 24.18 19.728 23.746 19.896C23.312 20.05 22.612 20.078 21.52 20.078C21.464 19.798 21.296 19.35 21.142 19.07C21.996 19.098 22.752 19.098 22.99 19.084C23.214 19.07 23.284 19.014 23.284 18.818V11.384ZM14.912 7.59L15.878 7.226C16.424 7.828 17.012 8.654 17.278 9.2L16.242 9.578C16.018 9.046 15.444 8.192 14.912 7.59ZM22.108 7.184L23.228 7.548C22.696 8.416 22.066 9.382 21.548 10.04L20.624 9.69C21.128 9.018 21.758 7.94 22.108 7.184ZM13.624 11.678H18.062V12.588H14.618V20.05H13.624V11.678ZM32.902 7.94L33.63 7.24C34.736 7.786 36.094 8.64 36.78 9.284L35.996 10.068C35.366 9.424 34.008 8.514 32.902 7.94ZM31.292 10.096H38.95V11.104H31.292V10.096ZM31.516 14.268H38.698V15.262H31.516V14.268ZM30.564 18.65H39.44V19.672H30.564V18.65ZM34.526 10.432H35.632V19.322H34.526V10.432ZM30.074 10.096L31.012 10.474C29.99 12.196 28.394 13.932 26.924 15.052C26.812 14.828 26.49 14.31 26.308 14.1C27.708 13.134 29.178 11.622 30.074 10.096ZM29.598 7.254L30.606 7.66C29.738 8.892 28.352 10.25 27.05 11.104C26.938 10.866 26.672 10.446 26.504 10.236C27.666 9.494 28.968 8.276 29.598 7.254ZM28.604 12.91L29.584 11.944L29.626 11.958V20.134H28.604V12.91ZM40.826 13.092H45.516V14.03H40.826V13.092ZM41.904 10.838H45.39V11.748H41.904V10.838ZM42.324 13.582H43.276V20.106H42.324V13.582ZM45.04 13.092H45.978V17.25C45.978 17.712 45.908 17.992 45.572 18.16C45.236 18.314 44.732 18.328 43.976 18.328C43.962 18.048 43.85 17.67 43.724 17.418C44.284 17.432 44.718 17.432 44.872 17.418C45.012 17.404 45.04 17.362 45.04 17.236V13.092ZM46.244 7.898H53.314V8.808H46.244V7.898ZM47.756 13.106V14.478H51.858V13.106H47.756ZM47.756 15.248V16.634H51.858V15.248H47.756ZM47.756 10.964V12.322H51.858V10.964H47.756ZM46.776 10.152H52.88V17.46H46.776V10.152ZM49.254 8.346L50.444 8.486C50.206 9.298 49.954 10.18 49.73 10.768L48.806 10.586C48.974 9.956 49.17 8.99 49.254 8.346ZM48.176 17.712L49.1 18.258C48.33 19 47.014 19.756 45.894 20.176C45.74 19.966 45.404 19.644 45.194 19.462C46.314 19.056 47.574 18.328 48.176 17.712ZM50.346 18.314L51.144 17.782C51.998 18.272 53.076 19.028 53.65 19.56L52.81 20.162C52.292 19.644 51.214 18.846 50.346 18.314ZM43.038 7.254H43.612V7.478H43.934V7.758C43.36 8.948 42.408 10.586 40.896 11.958C40.756 11.734 40.476 11.356 40.28 11.202C41.624 10.04 42.548 8.472 43.038 7.254ZM43.164 7.254H43.962C44.9 8.052 46.062 9.242 46.608 10.026L45.922 10.908C45.39 10.124 44.298 8.808 43.374 8.038H43.164V7.254ZM61.154 9.172H66.32V10.194H61.154V9.172ZM54.658 8.122H61.504V9.102H54.658V8.122ZM56.296 10.964H59.936V11.93H56.296V10.964ZM56.296 13.876H59.936V14.828H56.296V13.876ZM66.012 9.172H66.194L66.39 9.144L67.062 9.326C66.39 14.898 64.248 18.188 61.252 19.924C61.084 19.658 60.79 19.266 60.552 19.07C63.324 17.628 65.41 14.338 66.012 9.424V9.172ZM62.428 10.25C63.17 14.296 64.794 17.614 67.678 19.098C67.44 19.308 67.104 19.7 66.936 19.98C63.898 18.258 62.288 14.842 61.42 10.446L62.428 10.25ZM55.75 8.5H56.758V17.586H55.75V8.5ZM59.502 8.5H60.51V20.092H59.502V8.5ZM54.378 17.278C55.75 17.11 57.864 16.816 59.908 16.508L59.964 17.474C58.046 17.782 56.03 18.104 54.574 18.328L54.378 17.278Z"
                        fill="white"
                      />
                    </svg>
                  </router-link>
                </div>
                <v-divider></v-divider>
                <div
                  class="d-flex justify-space-between align-center px-3 py-3"
                >
                  <div class="font-weight-bold" style="color: #555">
                    您待使用的折價券({{ userInfo.availableReward }})
                  </div>
                  <router-link to="/reward"
                    ><svg
                      class="cursor-pointer"
                      width="80"
                      height="28"
                      viewBox="0 0 80 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="80" height="28" rx="14" fill="#F8822B" />
                      <path
                        d="M12.742 9.452H25.258V10.432H12.742V9.452ZM14.184 13.96H18.104V14.786H14.184V13.96ZM14.184 16.2H18.104V17.026H14.184V16.2ZM20.442 11.804H21.436V17.558H20.442V11.804ZM17.726 11.678H18.748V18.916C18.748 19.448 18.622 19.728 18.23 19.896C17.852 20.064 17.236 20.064 16.284 20.064C16.228 19.798 16.074 19.406 15.934 19.14C16.634 19.168 17.278 19.168 17.474 19.154C17.67 19.14 17.726 19.084 17.726 18.902V11.678ZM23.284 11.384H24.32V18.818C24.32 19.434 24.18 19.728 23.746 19.896C23.312 20.05 22.612 20.078 21.52 20.078C21.464 19.798 21.296 19.35 21.142 19.07C21.996 19.098 22.752 19.098 22.99 19.084C23.214 19.07 23.284 19.014 23.284 18.818V11.384ZM14.912 7.59L15.878 7.226C16.424 7.828 17.012 8.654 17.278 9.2L16.242 9.578C16.018 9.046 15.444 8.192 14.912 7.59ZM22.108 7.184L23.228 7.548C22.696 8.416 22.066 9.382 21.548 10.04L20.624 9.69C21.128 9.018 21.758 7.94 22.108 7.184ZM13.624 11.678H18.062V12.588H14.618V20.05H13.624V11.678ZM32.902 7.94L33.63 7.24C34.736 7.786 36.094 8.64 36.78 9.284L35.996 10.068C35.366 9.424 34.008 8.514 32.902 7.94ZM31.292 10.096H38.95V11.104H31.292V10.096ZM31.516 14.268H38.698V15.262H31.516V14.268ZM30.564 18.65H39.44V19.672H30.564V18.65ZM34.526 10.432H35.632V19.322H34.526V10.432ZM30.074 10.096L31.012 10.474C29.99 12.196 28.394 13.932 26.924 15.052C26.812 14.828 26.49 14.31 26.308 14.1C27.708 13.134 29.178 11.622 30.074 10.096ZM29.598 7.254L30.606 7.66C29.738 8.892 28.352 10.25 27.05 11.104C26.938 10.866 26.672 10.446 26.504 10.236C27.666 9.494 28.968 8.276 29.598 7.254ZM28.604 12.91L29.584 11.944L29.626 11.958V20.134H28.604V12.91ZM44.48 8.794H53.468V9.774H44.48V8.794ZM45.866 12.028V14.128H51.984V12.028H45.866ZM44.9 11.132H53.006V15.024H44.9V11.132ZM45.768 15.304C47.084 17.502 49.954 18.804 53.594 19.21C53.37 19.434 53.104 19.854 52.964 20.148C49.254 19.616 46.384 18.16 44.9 15.598L45.768 15.304ZM48.372 7.296H49.408V13.498C49.408 16.2 48.946 18.888 44.606 20.176C44.48 19.938 44.186 19.518 43.976 19.294C48.134 18.244 48.372 15.85 48.372 13.484V7.296ZM43.878 7.212L44.872 7.52C43.92 9.886 42.422 12.238 40.868 13.792C40.77 13.554 40.476 13.008 40.28 12.756C41.694 11.426 43.066 9.34 43.878 7.212ZM42.408 10.88L43.402 9.886L43.416 9.9V20.19H42.408V10.88ZM56.73 8.234H65.788V9.242H56.73V8.234ZM56.73 11.496H65.774V12.49H56.73V11.496ZM56.66 14.842H65.802V15.836H56.66V14.842ZM56.142 8.234H57.178V13.316C57.178 15.444 56.926 18.342 55.26 20.204C55.092 19.994 54.672 19.644 54.448 19.504C55.988 17.768 56.142 15.276 56.142 13.302V8.234ZM65.368 8.234H66.404V18.692C66.404 19.378 66.236 19.7 65.774 19.882C65.298 20.05 64.486 20.064 63.156 20.05C63.114 19.77 62.946 19.308 62.792 19.028C63.786 19.07 64.738 19.056 65.004 19.056C65.27 19.042 65.368 18.958 65.368 18.692V8.234ZM60.538 8.612H61.602V19.994H60.538V8.612Z"
                        fill="white"
                      />
                    </svg>
                  </router-link>
                </div>
              </div> </v-card
          ></v-col>
          <v-col cols="12">
            <div class="member-centre-icon-list pa-4">
              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                  v-for="(memberNavArray, index) in navArray"
                  :key="'newMemberNavArray' + index"
                >
                  <div>
                    <div class="d-flex align-center mb-3">
                      <div class="member-centre-icon-list-point"></div>
                      <div
                        class="member-centre-icon-list-title font-weight-bold ml-2"
                      >
                        {{ memberNavArray[0].title }}
                      </div>
                    </div>
                    <div class="d-flex justify-unset" style="flex-wrap: wrap">
                      <div
                        class="d-flex justify-center mb-4 cursor-pointer"
                        style="width: 25%"
                        v-for="item in memberNavArray"
                        :key="item.id"
                      >
                        <router-link
                          style="text-decoration: none"
                          v-if="item.to"
                          :to="item.to"
                          ><div style="width: fit-content">
                            <div class="d-flex justify-center mb-3">
                              <v-img
                                class="d-none d-lg-block"
                                :src="`./${item.name}.png`"
                                :max-width="64"
                              ></v-img>
                              <v-img
                                class="d-block d-lg-none"
                                :src="`./${item.name}.png`"
                                :max-width="56"
                              ></v-img>
                            </div>
                            <div class="member-centre-icon-list-name">
                              {{ item.name }}
                            </div>
                          </div></router-link
                        >
                        <div v-else>
                          <div
                            class="d-flex justify-center mb-3"
                            @click="
                              $store.commit('toLine')
                              getActiveBottomNavigation(4)
                              toLine()
                            "
                          >
                            <v-img
                              class="d-none d-lg-block"
                              :src="`./${item.name}.png`"
                              :max-width="64"
                            ></v-img>
                            <v-img
                              class="d-block d-lg-none"
                              :src="`./${item.name}.png`"
                              :max-width="56"
                            ></v-img>
                          </div>
                          <div class="member-centre-icon-list-name">
                            {{ item.name }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-col>
          <!-- <v-col cols="12">
            <router-link
              class="zone-013"
              style="text-decoration: none"
              to="/price-match"
            >
              <v-sheet
                class="mx-auto mt-0 px-3 py-1 font-weight-bold d-flex align-center cursor-pointer"
                style="
                  border-radius: 100px;
                  border: 2.5px solid #ca1f1d;
                  background: #fff;
                  width: 100%;
                  padding: 8px 16px;
                  color: #ca1f1d;
                  font-size: 20px;
                "
                outlined
                ><svg
                  class="mr-2"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_198_1316)">
                    <path
                      d="M5.889 16H2C1.73478 16 1.48043 15.8947 1.29289 15.7071C1.10536 15.5196 1 15.2652 1 15V9.00002C1 8.73481 1.10536 8.48045 1.29289 8.29291C1.48043 8.10538 1.73478 8.00002 2 8.00002H5.889L11.183 3.66802C11.2563 3.60797 11.3451 3.56996 11.4391 3.55841C11.5331 3.54687 11.6284 3.56227 11.714 3.60282C11.7996 3.64337 11.872 3.7074 11.9226 3.78745C11.9732 3.86751 12.0001 3.9603 12 4.05502V19.945C12.0001 20.0397 11.9732 20.1325 11.9226 20.2126C11.872 20.2926 11.7996 20.3567 11.714 20.3972C11.6284 20.4378 11.5331 20.4532 11.4391 20.4416C11.3451 20.4301 11.2563 20.3921 11.183 20.332L5.889 16ZM19.406 20.134L17.99 18.718C18.938 17.8745 19.6964 16.8397 20.2152 15.6817C20.734 14.5237 21.0015 13.2689 21 12C21.0012 10.6661 20.7054 9.34867 20.1339 8.14339C19.5624 6.93811 18.7296 5.87526 17.696 5.03202L19.116 3.61202C20.3345 4.64357 21.3132 5.9285 21.9841 7.37722C22.6549 8.82593 23.0016 10.4035 23 12C23 15.223 21.614 18.122 19.406 20.134ZM15.863 16.591L14.441 15.169C14.9265 14.7957 15.3196 14.3158 15.5899 13.7663C15.8602 13.2167 16.0006 12.6124 16 12C16 10.57 15.25 9.31502 14.12 8.60802L15.559 7.16902C16.3165 7.72621 16.9321 8.45387 17.3562 9.29314C17.7802 10.1324 18.0008 11.0597 18 12C18 13.842 17.17 15.49 15.863 16.591Z"
                      fill="#CA1F1D"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_198_1316">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                團購網超便宜買貴退差價!
              </v-sheet></router-link
            >
          </v-col> -->
        </v-row>
      </v-col>
      <v-col cols="12" lg="4"
        ><v-card>
          <div class="member-centre-head" @click="clickTo('/rebate')">
            活動攻略
          </div>
          <div class="pa-3">
            <div v-if="activityArray.length > 0">
              <v-img
                style="margin: 0 auto"
                :class="{ 'cursor-pointer': activityArray[0].activity_url }"
                max-width="800px"
                :src="activityArray[0].img_url"
                @click="clickTo(`/rebate?id=activity-${activityArray[0].id}`)"
              ></v-img>
            </div>
          </div> </v-card
      ></v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import { apiAxios } from '@/api'

export default {
  data() {
    return {
      show: {},
      items: [
        {
          text: '首頁',
          disabled: false,
          to: '/',
        },
        {
          text: '會員中心',
          to: '/member-centre',
        },
      ],
      activityArray: [],
      edm_notification: 'N',
      userInfo: {},
      phone_number: '',
      email: '',
      carrier_id: '',
      display_name: '',
      emp_no_s: '',
      company_name: '',
      gid: '',
      sex: '',
      birthday_menu: false,
      birthday: '',
      receive_area: '',
      receive_area_lists: [],
      isFirstFillInBirthday: true,
      membershipInfo: { monthlyInfo: [] },
    }
  },
  computed: {
    ...mapState(['newMemberNavArray']),
    ...mapGetters(['isLogin']),
    getAreaName() {
      const result = this.receive_area_lists.find(
        item => item.receive_area === this.receive_area
      )
      return result ? result.area_name : '找不到相應的區域名稱'
    },
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
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      apiAxios({
        method: 'post',
        url: '/Users/GetUserInfo',
        data: {},
      }).then(res => {
        this.userInfo = res.result[0]
      })

      apiAxios({
        method: 'post',
        url: '/Users/GetUserProfile',
        data: {},
      }).then(res => {
        if (res.result[0]) {
          this.phone_number = res.result[0].phone_number
          this.email = res.result[0].email
          this.edm_notification = res.result[0].edm_notification
          this.carrier_id = res.result[0].carrier_id
          this.display_name = res.result[0].display_name
          this.company_name = res.result[0].company_name
          this.emp_no_s = res.result[0].emp_no_s
          this.gid = res.result[0].gid
          this.sex = res.result[0].sex
          this.birthday = res.result[0].birthday
            ? this.$dayjs(res.result[0].birthday).format('YYYY-MM-DD')
            : null
          this.receive_area = res.result[0].receive_area
          this.isFirstFillInBirthday = this.birthday ? false : true
        }
      })
      apiAxios({
        method: 'post',
        url: '/ReceiveArea/GetReceiveArea',
        data: {},
      }).then(res => {
        this.receive_area_lists = res.result
      })
      apiAxios({
        method: 'post',
        url: '/Activity/GetActivityOverview',
      }).then(res => {
        this.activityArray = res.result
      })
      if (this.isLogin) {
        apiAxios({
          method: 'post',
          url: '/MemberShip/GetMembershipInfo',
          data: {},
        }).then(res => {
          this.membershipInfo = res.result
        })
      }
    },
    clickTo(url) {
      let regex = new RegExp('^/.*?')
      if (regex.test(url)) {
        this.$router.push(url)
      } else if (url) {
        if (window.GroupJSInterface) {
          let newUrl = new URL(url)
          newUrl.searchParams.set('external_browser', 2)
          window.location.href = newUrl.href
        } else {
          window.open(url)
        }
      }
    },
  },
}
</script>
<style scoped>
.v-tooltip__content.menuable__content__active {
  opacity: 1 !important;
}
.v-tooltip__content {
  background-color: transparent;
}

.tooltip-arrow {
  position: relative;
}
.tooltip-arrow::after {
  content: '';
  position: absolute;
  display: block;
  width: 10px;
  height: 10px;
  background-color: #f8822b;
  bottom: -13px;
  left: 12px;
  transform: rotate(0deg);
  opacity: 0;
  transition: 0.3s all;
}
.tooltip-arrow:hover::after {
  transform: rotate(45deg);
  opacity: 1;
}
.w-100 {
  width: 100%;
}
.user-info-btn {
  position: absolute;
  bottom: 10px;
  right: 20px;
}
.member-centre-head {
  cursor: pointer;
  padding: 8px 16px;
  height: 48px;
  border-radius: 5px 5px 0px 0px;
  background: linear-gradient(
    180deg,
    rgba(207, 54, 44, 0.77) 0%,
    rgba(250, 16, 0, 0.6) 20.31%,
    #b93229 99.99%,
    rgba(185, 50, 41, 0) 100%
  );
  color: #fff;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%; /* 32px */
}
.member-centre-info-text {
  font-size: 16px;
  font-weight: 400;
  line-height: 150%;
  margin-bottom: 10px;
}

.member-centre-info-title {
  color: #555;
  font-family: Roboto;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%;
}
.member-centre-info-value {
  color: #ca1f1d;
  font-family: Roboto;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 135%;
}
.member-centre-ship-value {
  color: #ca1f1d;
  font-size: 24px;
  font-weight: 700;
  line-height: 135%;
}
.member-centre-wrap-ship-value {
  position: relative;
}
.member-centre-wrap-ship-value::after {
  position: absolute;
  content: '';
  display: block;
  bottom: 0px;
  right: 0px;
  height: 1px;
  width: 100%;
  background-color: #ca1f1d;
}
.member-centre-icon-list {
  border-radius: 10px;
  border: 1px solid #d9d9d9;
  background: #fff;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
}
.member-centre-icon-list-point {
  width: 9px;
  height: 9px;
  border-radius: 5px;
  background-color: #ca1f1d;
  display: block;
}
.member-centre-icon-list-title {
  color: #ca1f1d;
  font-family: Roboto;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%;
}
.member-centre-icon-list-name {
  color: #555;
  font-size: 16px;
  line-height: 150%;
  text-align: center;
}
.member-level-area {
  width: 100%;
  height: 72px;
  background-color: #f9f9f9;
  margin-right: 2px;
  margin-bottom: 2px;
}
.member-level-area-title {
  background-color: #e6e6e6;
  font-size: 20px;
  color: #868686;
  font-weight: bold;
  height: 24px;
}

@media (max-width: 1263px) {
  .member-centre-icon-list-name {
    font-size: 16px;
    text-wrap: nowrap;
  }
}

@media (max-width: 959px) {
  .wrap-member-level-area {
    flex-wrap: wrap;
  }
  .member-level-area {
    max-width: 49.5px;
  }
}
@media (max-width: 600px) {
  .user-info-btn {
    left: 20px;
    right: inherit;
  }
}
</style>
