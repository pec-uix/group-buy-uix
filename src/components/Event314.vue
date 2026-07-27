<template>
  <v-container fluid>
    <v-row dense class="d-sm-none">
      <v-col cols="12" class="pb-4">
        <a @click="showQ">
          <v-img class="activity-psytest" src="https://unilife.pec.com.tw/images/event-314-1-mobile.jpg"></v-img>
        </a>
      </v-col>
      <v-col cols="12" class="mb-3">
        <v-row>
          <v-col cols="4" style="max-width: 35.2%; padding: 1%">
            <router-link to="/activity/2022-0207-1">
              <v-img class="activity-4" src="https://unilife.pec.com.tw/images/event-314-2-mobile.jpg"></v-img>
            </router-link>
          </v-col>
          <v-col
            cols="8"
            class="d-flex flex-column"
            style="max-width: 64.8%; padding: 1%"
          >
            <router-link style="margin-bottom: 2.5%" to="/activity/2022-0207-4">
              <v-img class="activity-1" src="https://unilife.pec.com.tw/images/event-314-3-mobile.jpg"></v-img>
            </router-link>
            <router-link to="/activity/2022-0207-2">
              <v-img class="activity-2" src="https://unilife.pec.com.tw/images/event-314-4-mobile.jpg"></v-img>
            </router-link>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12">
        <v-row>
          <v-col
            cols="8"
            class="d-flex flex-column pb-0"
            style="max-width: 64.8%; padding: 1%"
          >
            <router-link style="margin-bottom: 2.5%" to="/activity/2022-0207-5">
              <v-img class="activity-5" src="https://unilife.pec.com.tw/images/event-314-5-mobile.jpg"></v-img>
            </router-link>
            <router-link to="/activity/2022-0207-3">
              <v-img class="activity-6" src="https://unilife.pec.com.tw/images/event-314-6-mobile.jpg"></v-img>
            </router-link>
          </v-col>
          <v-col cols="4" class="pb-0" style="max-width: 35.2%; padding: 1%">
            <router-link to="/activity/2022-0207-6">
              <v-img class="activity-3" src="https://unilife.pec.com.tw/images/event-314-7-mobile.jpg"></v-img>
            </router-link>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row dense class="d-none d-sm-flex">
      <v-col cols="12">
        <a @click="showQ">
          <v-img
            class="mb-3 activity-psytest"
            src="https://unilife.pec.com.tw/images/event-314-1-pc.jpg"
          ></v-img>
        </a>
      </v-col>
      <v-col cols="12" class="mb-3">
        <v-row>
          <v-col cols="4" style="max-width: 35.2%; padding: 1%">
            <router-link to="/activity/2022-0207-1">
              <v-img class="activity-4" src="https://unilife.pec.com.tw/images/event-314-2-pc.jpg"></v-img>
            </router-link>
          </v-col>
          <v-col
            cols="8"
            class="d-flex flex-column"
            style="max-width: 64.8%; padding: 1%"
          >
            <router-link style="margin-bottom: 2.5%" to="/activity/2022-0207-4">
              <v-img class="activity-1" src="https://unilife.pec.com.tw/images/event-314-3-pc.jpg"></v-img>
            </router-link>
            <router-link to="/activity/2022-0207-2">
              <v-img class="activity-2" src="https://unilife.pec.com.tw/images/event-314-4-pc.jpg"></v-img>
            </router-link>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12">
        <v-row>
          <v-col
            cols="8"
            class="d-flex flex-column pb-0"
            style="max-width: 64.8%; padding: 1%"
          >
            <router-link style="margin-bottom: 2.5%" to="/activity/2022-0207-5">
              <v-img class="activity-5" src="https://unilife.pec.com.tw/images/event-314-5-pc.jpg"></v-img>
            </router-link>
            <router-link to="/activity/2022-0207-3">
              <v-img class="activity-6" src="https://unilife.pec.com.tw/images/event-314-6-pc.jpg"></v-img>
            </router-link>
          </v-col>
          <v-col cols="4" class="pb-0" style="max-width: 35.2%; padding: 1%">
            <router-link to="/activity/2022-0207-6">
              <v-img class="activity-3" src="https://unilife.pec.com.tw/images/event-314-7-pc.jpg"></v-img>
            </router-link>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" persistent width="1000px" max-width="80%">
      <v-sheet>
        <v-img :src="selectedQ.src"></v-img>
        <div class="d-flex pa-2 justify-space-between flex-column flex-md-row">
          <v-btn
            v-for="option in selectedQ.optionArray"
            :key="option.text"
            class="flex-grow-1 ma-1"
            color="primary"
            outlined
            :to="{
              name: 'Activity',
              params: {
                activityType: option.activityType,
                src: option.src,
              },
            }"
            >{{ option.text }}</v-btn
          >
        </div>
      </v-sheet>
    </v-dialog>

    <v-dialog v-model="dialogForCard" persistent width="fit-content">
      <v-sheet>
        <img
          style="max-width: 80vw; max-height: 80vh"
          :src="`https://unilife.pec.com.tw/images/event-314-card-${selectCard}.png`"
        />
        <v-btn
          tile
          block
          dark
          depressed
          color="#d09b4e"
          @click="dialogForCard = false"
          >關閉</v-btn
        >
      </v-sheet>
      <!-- <img src="https://unilife.pec.com.tw/images/event-314-card-01.png" /> -->
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  created() {
    this.cardIndex = Math.floor(Math.random() * 16) + 1
  },
  data() {
    return {
      dialog: false,
      dialogForCard: false,
      qIndex: 2,
      cardIndex: 2,
      items: [
        { id: 1, flipped: false },
        { id: 2, flipped: false },
        { id: 3, flipped: false },
        { id: 4, flipped: false },
      ],
      q: [
        {
          src: 'https://unilife.pec.com.tw/images/event-314-q1.png',
          optionArray: [
            {
              text: '肥美的荔枝',
              activityType: '2022-0207-4',
              src: 'https://unilife.pec.com.tw/images/event-314-q1-a1.jpg',
              message:
                '你生命中不能缺乏「愛情」，沒有愛情的滋潤，你過著行屍走肉般的生活，無法好好過日子，白色情人節買盒巧克力送給你的愛情吧!',
            },
            {
              text: '軟Q的芭樂',
              activityType: '2022-0207-6',
              src: 'https://unilife.pec.com.tw/images/event-314-q1-a2.jpg',
              message:
                '你生命中不能缺乏「自由」，喜歡隨著自己的心意去做任何事，非常討厭各種束縛和其他人的眼光，白色情人節換輛新車享受自由吧!',
            },
            {
              text: '迷你好吃的橘子',
              activityType: '2022-0207-1',
              src: 'https://unilife.pec.com.tw/images/event-314-q1-a3.jpg',
              message:
                '你生命中不能缺乏「金錢」，對於物質需求有很深的不安全感，所以你總是努力在積蓄金錢，並對此感到滿足，現在是買金飾最適合的時間點了，趁著情人節買個金飾送給自己吧!',
            },
            {
              text: '甜甜的草莓',
              activityType: '2022-0207-5',
              src: 'https://unilife.pec.com.tw/images/event-314-q1-a4.jpg',
              message:
                '你生命中不能缺乏「朋友」。良好親密的人際關係會讓你感到安全、舒適，並且有力氣持續的往前奮鬥，水晶類的商品相信你的朋友會喜歡的，趁著情人節買條水晶項鍊送他吧!',
            },
          ],
        },
        {
          src: 'https://unilife.pec.com.tw/images/event-314-q2.png',
          optionArray: [
            {
              text: 'A',
              activityType: '2022-0207-2',
              src: 'https://unilife.pec.com.tw/images/event-314-q2-a1.jpg',
              message:
                '在這段感情中，似乎你比較愛對方，而你們的深層情感交流面似乎也不夠多，導致愛情有些失衡。如果只有你一昧緊抓著的愛情，但對方沒有讓你感受到完全的幸福，那麼你可能要想辦法轉變一下這個狀況，不然走著走著就變質了，愛累了就好好犒賞自己吧!買樣自己喜歡的禮物吧!',
            },
            {
              text: 'B',
              activityType: '2022-0207-4',
              src: 'https://unilife.pec.com.tw/images/event-314-q2-a2.jpg',
              message:
                '對方對你的愛比較多喔，但他有點欠缺表達能力，這時候建議可以從他的行動跟小細節去觀察，不然你可能會常常感受不到對方的愛，不會表達愛嗎?那就送上對方會喜歡的巧克力吧!',
            },
            {
              text: 'C',
              activityType: '2022-0207-3',
              src: 'https://unilife.pec.com.tw/images/event-314-q2-a3.jpg',
              message:
                '對方對你的愛遠比你愛他來得多，你對他來講可是一個謬思的概念，完全被你迷倒了，對你的愛意相當濃烈，但有時候他實在愛得太用力了，你可能也感受到了一點壓力，情人節就來選一束花療癒一下自己、釋放壓力吧!',
            },
            {
              text: 'D',
              activityType: '2022-0207-1',
              src: 'https://unilife.pec.com.tw/images/event-314-q2-a4.jpg',
              message:
                '你們對彼此的愛可說是旗鼓相當，沒有誰對誰的愛比較多，這是很難得的難，因為你們彼此都真心關心對方，可能也共同經歷了許多，讓你們更加懂得珍惜彼此，情人節買條手鍊、項鍊，讓生活越來越順利吧!',
            },
          ],
        },
        {
          src: 'https://unilife.pec.com.tw/images/event-314-q3.png',
          optionArray: [
            {
              text: '沙灘漫步',
              activityType: '2022-0207-6',
              src: 'https://unilife.pec.com.tw/images/event-314-q3-a1.jpg',
              message:
                '你是一個相當專情的人。你非常珍惜眼前的幸福，背叛感情這樣的事情你從來沒有想過。若是遇到一個適合的對象，可能就此白頭偕老，廝守終生。白色情人節換台新車，等待您愛人與他(她)一同接送您們的愛戀時光!',
            },
            {
              text: '喝下午茶',
              activityType: '2022-0207-2',
              src: 'https://unilife.pec.com.tw/images/event-314-q3-a2.jpg',
              message:
                '你看似專情，但其實只愛自己。你不習慣和別人聊天談心，讓人無法捉摸你的想法，對你始終沒有安全感。你不容易和別人談戀愛，一旦開始就會維持很久。沒關係!選一樣喜歡的商品好好寵愛自己吧!',
            },
            {
              text: '逛街血拚',
              activityType: '2022-0207-5',
              src: 'https://unilife.pec.com.tw/images/event-314-q3-a3.jpg',
              message:
                '你的個性相當豁達，喜歡結交不同的朋友，重視感覺，不拘於傳統的教條。你認為感情的事情勉強不來，因此看得很開也相當以此為傲，但有時候還是會默默地期待那個能相守一輩子的對象出現。水晶類的商品，很適合您目前的狀態呢!選一個您喜歡的水晶，為妳招來好桃花喔!',
            },
            {
              text: '隨興聊天',
              activityType: '2022-0207-1',
              src: 'https://unilife.pec.com.tw/images/event-314-q3-a4.jpg',
              message:
                '你對於愛情的信仰太深，美好愛情該要有的樣子，在你心中已經描繪了一千遍一萬遍。這世界上誰能真的滿足你的完美想像呢？或許有，或許沒有，你願意賭賭看嗎？金飾類的商品最能滿足內心的妳了!',
            },
          ],
        },
        {
          src: 'https://unilife.pec.com.tw/images/event-314-q4.png',
          optionArray: [
            {
              text: '牡丹粉',
              activityType: '2022-0207-4',
              src: 'https://unilife.pec.com.tw/images/event-314-q4-a1.jpg',
              message:
                '一見鍾情對你來說，不是一件容易的事，因為你習慣了解一切之後再做決定，即使遇到吸引你的人出現，你也還是會三思而後行，情人節買盒巧克力犒賞一下自己吧!',
            },
            {
              text: '西柚橘',
              activityType: '2022-0207-3',
              src: 'https://unilife.pec.com.tw/images/event-314-q4-a2.jpg',
              message:
                '天生就有文藝氣息的你，有時候很愛幻想，還有點不切實際，嚮往的愛情是像偶像劇那樣浪漫，情人節送花給愛人或自己是最適合的浪漫喔!',
            },
            {
              text: '玫瑰紅',
              activityType: '2022-0207-1',
              src: 'https://unilife.pec.com.tw/images/event-314-q4-a3.jpg',
              message:
                '你天生不會刻意去尋求刺激，安全感對你來說特別重要，你很容易一見鍾情，但是每當要更進一步的時候，卻退縮了，你可能還需要更多勇氣，快告訴你的情人買條金飾送給自己吧!',
            },
            {
              text: '薔葳紫',
              activityType: '2022-0207-2',
              src: 'https://unilife.pec.com.tw/images/event-314-q4-a4.jpg',
              message:
                '你的反應很快，也習慣應付各種突發狀況，不過這並不是靠你的分析能力，而是靠你的直覺，只是並不容易遇到能讓你心動的人，今年情人節，買個禮物犒賞一下自己吧!',
            },
          ],
        },
        {
          src: 'https://unilife.pec.com.tw/images/event-314-q5.png',
          optionArray: [
            {
              text: 'A',
              activityType: '2022-0207-4',
              src: 'https://unilife.pec.com.tw/images/event-314-q5-a1.jpg',
              message:
                '你是一個有強烈責任感的人，各方面都很獨立，到哪裡的表現也都很不錯，不過在戀人面前就會表現得很柔弱可能是因為你太過依賴對方的關係，情人節買盒巧克力送給愛人或自己吧!',
            },
            {
              text: 'B',
              activityType: '2022-0207-2',
              src: 'https://unilife.pec.com.tw/images/event-314-q5-a2.jpg',
              message:
                '你喜歡集體生活，不喜歡自己去處理事情，有些小事情你也需要詢問別人的意見，才能夠做最後的決定，所以家人和朋友是你的精神支柱，今年情人節買個禮物送給家人跟朋友吧!',
            },
            {
              text: 'C',
              activityType: '2022-0207-6',
              src: 'https://unilife.pec.com.tw/images/event-314-q5-a3.jpg',
              message:
                '你是個相當成熟的人，有著很強烈的使命感，你不害怕孤獨，即使一個人生活也可以過得很好，買輛車享受一下今年情人節吧!',
            },
            {
              text: 'D',
              activityType: '2022-0207-1',
              src: 'https://unilife.pec.com.tw/images/event-314-q5-a4.jpg',
              message:
                '你在平常的生活中，很少有自己的主見，常常希望得到別人的照顧，自立能力不是很強，今年情人節買條金飾送給照顧你的人吧!',
            },
          ],
        },
      ],
    }
  },
  computed: {
    selectedQ() {
      return this.q[this.qIndex]
    },
    selectCard() {
      return this.cardIndex.toString().toString().padStart(2, '0')
    },
  },
  methods: {
    showQ() {
      this.qIndex = Math.floor(Math.random() * this.q.length)
      this.dialog = true
    },
    flip(item) {
      if (this.items.every(x => !x.flipped)) {
        item.flipped = true
        setTimeout(() => {
          this.dialogForCard = true
        }, 800)
      }
    },
    // transitionend() {
    //   this.dialogForCard = true
    // },
  },
}
</script>

<style>
.flip-card {
  background-color: transparent;
  perspective: 1000px; /* Remove this if you don't want the 3D effect */
}

/* This container is needed to position the front and back side */
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

/* Do an horizontal flip when you move the mouse over the flip box container */
/* .flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
} */
.flipped {
  transform: rotateY(180deg);
}
/* Position the front and back side */
/* .flip-card-front, */
.flip-card-back {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden; /* Safari */
  backface-visibility: hidden;
}

/* Style the front side (fallback if image is missing) */
.flip-card-front {
  background-color: #bbb;
  color: black;
  -webkit-backface-visibility: hidden; /* Safari */
  backface-visibility: hidden;
}

/* Style the back side */
.flip-card-back {
  transform: rotateY(180deg);
}
</style>
