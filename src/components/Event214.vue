<template>
  <v-container fluid>
    <v-row dense class="d-md-none">
      <v-col cols="12">
        <a @click="showQ">
          <v-img
            src="https://unilife.pec.com.tw/images/event-214-1-mobile.jpg"
          ></v-img>
        </a>
      </v-col>
      <v-col cols="12">
        <div class="d-flex justify-space-between">
          <div
            class="d-flex flex-column justify-space-between"
            style="width: 35%"
          >
            <router-link to="/activity/2022-0207-1">
              <v-img
                src="https://unilife.pec.com.tw/images/event-214-2-mobile.jpg"
              ></v-img>
            </router-link>
            <router-link to="/activity/2022-0207-4">
              <v-img
                src="https://unilife.pec.com.tw/images/event-214-4-mobile.jpg"
              ></v-img>
            </router-link>
          </div>
          <div
            class="d-flex flex-column justify-space-between"
            style="width: 35%"
          >
            <router-link to="/activity/2022-0207-3">
              <v-img
                src="https://unilife.pec.com.tw/images/event-214-3-mobile.jpg"
              ></v-img>
            </router-link>
            <router-link to="/activity/2022-0207-2">
              <v-img
                src="https://unilife.pec.com.tw/images/event-214-5-mobile.jpg"
              ></v-img>
            </router-link>
          </div>
          <div style="width: 26%">
            <router-link to="/activity/2022-0207-5">
              <v-img
                src="https://unilife.pec.com.tw/images/event-214-6-mobile.jpg"
              ></v-img>
            </router-link>
          </div>
        </div>
      </v-col>
      <v-col cols="12">
        <v-img src="https://unilife.pec.com.tw/images/event-214-7.jpg"></v-img>
      </v-col>
      <v-col
        cols="3"
        v-for="(item, index) in items"
        :key="index"
        @click="flip(item)"
      >
        <div class="flip-card">
          <div class="flip-card-inner" :class="{ flipped: item.flipped }">
            <div class="flip-card-front">
              <v-img
                src="https://unilife.pec.com.tw/images/event-214-8.jpg"
              ></v-img>
            </div>
            <div class="flip-card-back">
              <v-img
                :src="`https://unilife.pec.com.tw/images/event-214-card-${selectCard}.png`"
              ></v-img>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row dense class="d-none d-md-flex">
      <v-col cols="12">
        <a @click="showQ">
          <v-img
            src="https://unilife.pec.com.tw/images/event-214-1-pc.jpg"
          ></v-img>
        </a>
      </v-col>
      <v-col cols="3">
        <router-link to="/activity/2022-0207-2">
          <v-img
            src="https://unilife.pec.com.tw/images/event-214-2-pc.jpg"
          ></v-img>
        </router-link>
      </v-col>
      <v-col cols="3">
        <router-link to="/activity/2022-0207-1">
          <v-img
            src="https://unilife.pec.com.tw/images/event-214-3-pc.jpg"
          ></v-img>
        </router-link>
      </v-col>
      <v-col cols="3">
        <router-link to="/activity/2022-0207-4">
          <v-img
            src="https://unilife.pec.com.tw/images/event-214-4-pc.jpg"
          ></v-img>
        </router-link>
      </v-col>
      <v-col cols="3">
        <router-link to="/activity/2022-0207-3">
          <v-img
            src="https://unilife.pec.com.tw/images/event-214-5-pc.jpg"
          ></v-img>
        </router-link>
      </v-col>

      <v-col cols="9">
        <v-img src="https://unilife.pec.com.tw/images/event-214-7.jpg"></v-img>
        <v-row dense>
          <v-col
            cols="3"
            v-for="(item, index) in items"
            :key="index"
            @click="flip(item)"
          >
            <div class="flip-card">
              <div class="flip-card-inner" :class="{ flipped: item.flipped }">
                <div class="flip-card-front">
                  <v-img
                    src="https://unilife.pec.com.tw/images/event-214-8.jpg"
                  ></v-img>
                </div>
                <div class="flip-card-back">
                  <v-img
                    :src="`https://unilife.pec.com.tw/images/event-214-card-${selectCard}.png`"
                  ></v-img>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="3">
        <router-link to="/activity/2022-0207-5">
          <v-img
            src="https://unilife.pec.com.tw/images/event-214-6-mobile.jpg"
          ></v-img>
        </router-link>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" persistent width="1000px" max-width="80%">
      <v-sheet>
        <v-img :src="selectedQ.src"></v-img>
        <div class="d-flex pa-2 justify-space-between flex-column flex-sm-row">
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
          :src="`https://unilife.pec.com.tw/images/event-214-card-${selectCard}.png`"
        />
        <v-btn
          tile
          block
          dark
          depressed
          color="#ae82f4"
          @click="dialogForCard = false"
          >關閉</v-btn
        >
      </v-sheet>
      <!-- <img src="https://unilife.pec.com.tw/images/event-214-card-01.png" /> -->
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  created() {
    this.cardIndex = Math.floor(Math.random() * 12) + 1
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
          src: 'https://unilife.pec.com.tw/images/event-214-q1.png',
          optionArray: [
            {
              text: '喝下午茶',
              activityType: '2022-0207-4',
              src: 'https://unilife.pec.com.tw/images/event-214-q1-a1.jpg',
              message:
                '你和個性陽光可靠的人最速配。在一段戀愛中，你會比較喜歡逞強，總是在喜歡的人面前裝出很強悍的樣子，但反而是內心有點缺乏安全感的樣子。今年情人節買盒巧克力犒賞一下自己吧!',
            },
            {
              text: '沙灘漫步',
              activityType: '2022-0207-3',
              src: 'https://unilife.pec.com.tw/images/event-214-q1-a2.jpg',
              message:
                '你和充滿藝術氣息的人最合適!你的擇偶標準會比較看重對方的興趣和相處感覺，你希望對方是有事業心、獨立的人。你期許另一半可以懂得品鑒文學或藝術，這樣你們就能一起度過知性悠閒的時光。你們會是很好的伴侶和知音，相處過程幸福又合拍!美麗的花朵最適合陪伴您與伴侶度過今年美好的情人節!',
            },
            {
              text: '隨性聊天',
              activityType: '2022-0207-1',
              src: 'https://unilife.pec.com.tw/images/event-214-q1-a3.jpg',
              message:
                '你和個性獨立務實的人最合適!你是一個有自己興趣、喜歡享受自己小天地的人，所以在和別人相處時希望有適當距離，整天黏在一起反而會讓你產生厭煩感。因此您需要的是金飾金條這類的商品來滿足您與另一半吧!',
            },
            {
              text: '逛街血拚',
              activityType: '2022-0207-2',
              src: 'https://unilife.pec.com.tw/images/event-214-q1-a4.jpg',
              message:
                '你和有責任心、認真堅定的人最速配。不論是對家庭還是對工作都很負責認真，受到身邊人信賴的人最吸引你。這樣的你們婚前可能會有些原則標準，但在婚後都會願意為家庭和對方付出更多，生活絕對超級甜蜜和諧!買個禮物送給另一半會讓您們的感情加溫唷!',
            },
          ],
        },
        {
          src: 'https://unilife.pec.com.tw/images/event-214-q2.png',
          optionArray: [
            {
              text: '空罐頭',
              activityType: '2022-0207-4',
              src: 'https://unilife.pec.com.tw/images/event-214-q2-a1.jpg',
              message:
                '你是一個大話精，在一段戀愛中，你會比較喜歡腳踏兩條船的感覺，那樣的刺激感會讓你上癮，想想愛你的另一半吧，今年情人節買盒巧克力送給她(他)吧!',
            },
            {
              text: '寶箱',
              activityType: '2022-0207-3',
              src: 'https://unilife.pec.com.tw/images/event-214-q2-a2.jpg',
              message:
                '雖然你是一比較花心的人，和另一半出門時，會注視異性，但你最終不敢越軌，今年情人節買束花送給愛你的她(他)吧!',
            },
            {
              text: '一匹狼',
              activityType: '2022-0207-1',
              src: 'https://unilife.pec.com.tw/images/event-214-q2-a3.jpg',
              message:
                '你是一個浪漫、感情豐富的人，和你在一起對方會有滿滿的安全感，今年情人節買金飾送給愛你的她(他)吧!',
            },
            {
              text: '小女孩',
              activityType: '2022-0207-2',
              src: 'https://unilife.pec.com.tw/images/event-214-q2-a4.jpg',
              message:
                '你是一個對愛情死心塌地，且也會要求對方一心一意的人唷，今年情人節買個禮物送給愛你的她(他)吧!',
            },
          ],
        },
        {
          src: 'https://unilife.pec.com.tw/images/event-214-q3.png',
          optionArray: [
            {
              text: 'A',
              activityType: '2022-0207-4',
              src: 'https://unilife.pec.com.tw/images/event-214-q3-a1.jpg',
              message:
                '你習慣把所有事情都掌控在自己手裡，雖然你很喜歡驚喜，那會給你帶來快樂，但同時你又不喜歡那種手足無措的感覺，一見鍾情對你來說，不是一件容易的事，因為你習慣了解一切之後再做決定，即使遇到吸引你的人出現，你也還是會三思而後行，情人節買盒巧克力犒賞一下自己吧!',
            },
            {
              text: 'B',
              activityType: '2022-0207-3',
              src: 'https://unilife.pec.com.tw/images/event-214-q3-a2.jpg',
              message:
                '天生就有文藝氣息的你，有時候很愛幻想，還有點不切實際，嚮往的愛情是像偶像劇那樣浪漫，你很容易一廂情願，還不聽勸朋友不管跟你說什麼都不願意相信，建議你最好提醒自己，凡事都要先冷靜思考一下，情人節送一束鮮花犒賞一下自己吧!',
            },
            {
              text: 'C',
              activityType: '2022-0207-1',
              src: 'https://unilife.pec.com.tw/images/event-214-q3-a3.jpg',
              message:
                '你天生就很夢幻，不會刻意去尋求刺激，安全感對你來說特別重要，你很容易一見鍾情，但是每當要更進一步的時候，卻退縮了，你可能還需要更多勇氣，快告訴你的情人買條金飾送給自己吧!',
            },
            {
              text: 'D',
              activityType: '2022-0207-2',
              src: 'https://unilife.pec.com.tw/images/event-214-q3-a4.jpg',
              message:
                '你的反應很快，也習慣應付各種突發狀況，不過這並不是靠你的分析能力，而是靠你的直覺，你很有可能對一個人一見鍾情，只是並不容易遇到能讓你心動的人，今年情人節，買個禮物犒賞一下自己吧!',
            },
          ],
        },
        {
          src: 'https://unilife.pec.com.tw/images/event-214-q4.png',
          optionArray: [
            {
              text: 'A',
              activityType: '2022-0207-1',
              src: 'https://unilife.pec.com.tw/images/event-214-q4-a1.jpg',
              message:
                '在你的淺意識裡，渴望對方是一個能夠每天下班陪你去市場買菜，一起在家度過夜晚的人，你只是單純希望那個他可以有時間多陪伴你，這就是你最想要的幸福，今年情人節買個金飾送給愛你的她吧!',
            },
            {
              text: 'B',
              activityType: '2022-0207-2',
              src: 'https://unilife.pec.com.tw/images/event-214-q4-a2.jpg',
              message:
                '對你來說，愛上一個人是因為他跟你有相同愛好、習慣等等，那麼你就會感到很幸福，今年情人節買個禮物送給愛你的她吧!',
            },
            {
              text: 'C',
              activityType: '2022-0207-3',
              src: 'https://unilife.pec.com.tw/images/event-214-q4-a3.jpg',
              message:
                '像王子、公主般的伴侶:你喜歡風度翩翩、溫文爾雅、有氣質，就像王子跟公主一般的人，今年情人節買束鮮花送給愛你的她吧!',
            },
            {
              text: 'D',
              activityType: '2022-0207-4',
              src: 'https://unilife.pec.com.tw/images/event-214-q4-a4.jpg',
              message:
                '有藝術天份的伴侶:你喜歡有藝術氣息的人 因為他有無窮的想像力，可為你帶來各種驚喜，這類型的人也很懂得如何去征服你，今年情人節買盒巧克力送給愛你的她吧!',
            },
          ],
        },
        {
          src: 'https://unilife.pec.com.tw/images/event-214-q5.png',
          optionArray: [
            {
              text: 'A',
              activityType: '2022-0207-4',
              src: 'https://unilife.pec.com.tw/images/event-214-q5-a1.jpg',
              message:
                '你是一個有強烈責任感的人，各方面都很獨立，到哪裡的表現也都很不錯，不過在戀人面前就會表現得很柔弱可能是因為你太過依賴對方的關係，獨立一些，情人節買盒巧克力犒賞一下自己吧!',
            },
            {
              text: 'B',
              activityType: '2022-0207-2',
              src: 'https://unilife.pec.com.tw/images/event-214-q5-a2.jpg',
              message:
                '你喜歡集體生活，不喜歡自己去處理事情，有些小事情你也需要詢問別人的意見，才能夠做最後的決定，所以家人和朋友是你的精神支柱，今年情人節買個禮物送給家人跟朋友吧!',
            },
            {
              text: 'C',
              activityType: '2022-0207-3',
              src: 'https://unilife.pec.com.tw/images/event-214-q5-a3.jpg',
              message:
                '你是個相當成熟的人，有著很強烈的使命感，你不害怕孤獨，即使一個人生活也可以過得很好，不過很容易局限在自我認知的範圍內，別人的意見你通常聽不太進去，偶爾靜下來聽聽別人的意見也不錯唷，買束花享受一下今年情人節吧!',
            },
            {
              text: 'D',
              activityType: '2022-0207-1',
              src: 'https://unilife.pec.com.tw/images/event-214-q5-a4.jpg',
              message:
                '你是個多說不做、舉棋不定的人，在平常的生活中，很少有自己的主見，常常希望得到別人的照顧，自立能力不是很強，今年情人節買條金飾送給照顧你的人吧!',
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