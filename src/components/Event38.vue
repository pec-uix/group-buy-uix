<template>
  <v-container fluid>
    <v-row dense class="d-sm-none">
      <v-col cols="12" class="pb-4">
        <a @click="showQ">
          <v-img
            class="activity-promote"
            id="activity-promote-2"
            src="https://unilife.pec.com.tw/images/event-38-1-mobile.jpg"
          ></v-img>
        </a>
      </v-col>
      <v-col cols="6">
        <router-link to="/activity/2022-0207-1">
          <v-img
            src="https://unilife.pec.com.tw/images/event-38-2-mobile.jpg"
          ></v-img>
        </router-link>
      </v-col>
      <v-col cols="6">
        <router-link to="/activity/2022-0207-2">
          <v-img
            src="https://unilife.pec.com.tw/images/event-38-3-mobile.jpg"
          ></v-img>
        </router-link>
      </v-col>
      <v-col cols="6">
        <router-link to="/activity/2022-0207-4">
          <v-img
            src="https://unilife.pec.com.tw/images/event-38-4-mobile.jpg"
          ></v-img>
        </router-link>
      </v-col>
      <v-col cols="6">
        <router-link to="/activity/2022-0207-5">
          <v-img
            src="https://unilife.pec.com.tw/images/event-38-5-mobile.jpg"
          ></v-img>
        </router-link>
      </v-col>
      <v-col cols="12" class="pt-4">
        <v-img src="https://unilife.pec.com.tw/images/event-38-7.jpg"></v-img>
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
                src="https://unilife.pec.com.tw/images/event-38-8.png"
              ></v-img>
            </div>
            <div class="flip-card-back">
              <v-img
                :src="`https://unilife.pec.com.tw/images/event-38-card-${selectCard}.png`"
              ></v-img>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row dense class="d-none d-sm-flex">
      <v-col cols="12">
        <a @click="showQ">
          <v-img
            class="activity-promote"
            id="activity-promote-1"
            src="https://unilife.pec.com.tw/images/event-38-1-pc.jpg"
          ></v-img>
        </a>
      </v-col>
      <v-col cols="3">
        <router-link to="/activity/2022-0207-1">
          <v-img
            src="https://unilife.pec.com.tw/images/event-38-2-pc.png"
          ></v-img>
        </router-link>
      </v-col>
      <v-col cols="3">
        <router-link to="/activity/2022-0207-2">
          <v-img
            src="https://unilife.pec.com.tw/images/event-38-3-pc.png"
          ></v-img>
        </router-link>
      </v-col>
      <v-col cols="3">
        <router-link to="/activity/2022-0207-4">
          <v-img
            src="https://unilife.pec.com.tw/images/event-38-4-pc.png"
          ></v-img>
        </router-link>
      </v-col>
      <v-col cols="3">
        <router-link to="/activity/2022-0207-5">
          <v-img
            src="https://unilife.pec.com.tw/images/event-38-5-pc.png"
          ></v-img>
        </router-link>
      </v-col>

      <v-col cols="12">
        <v-img
          class="mb-6"
          src="https://unilife.pec.com.tw/images/event-38-7.jpg"
        ></v-img>
        <v-row>
          <v-col
            cols="3"
            class="px-3"
            v-for="(item, index) in items"
            :key="index"
            @click="flip(item)"
          >
            <div class="flip-card">
              <div class="flip-card-inner" :class="{ flipped: item.flipped }">
                <div class="flip-card-front">
                  <v-img
                    src="https://unilife.pec.com.tw/images/event-38-8.png"
                  ></v-img>
                </div>
                <div class="flip-card-back">
                  <v-img
                    :src="`https://unilife.pec.com.tw/images/event-38-card-${selectCard}.png`"
                  ></v-img>
                </div>
              </div>
            </div>
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
          :src="`https://unilife.pec.com.tw/images/event-38-card-${selectCard}.png`"
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
      <!-- <img src="https://unilife.pec.com.tw/images/event-38-card-01.png" /> -->
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
          src: 'https://unilife.pec.com.tw/images/event-38-q1.png',
          optionArray: [
            {
              text: '二話不說，全力幫忙',
              activityType: '2022-0207-5',
              src: 'https://unilife.pec.com.tw/images/event-38-q1-a1.jpg',
              message:
                '妳是個非常有魅力的女孩，待人處事外向、積極、人見人愛，許多人都很喜歡妳，但妳跟不熟的人，可能會誤會妳是社交手腕高的人，水晶系列商品可以慢慢讓您氣場如虹!',
            },
            {
              text: '心很痛但裝大方，不在乎',
              activityType: '2022-0207-1',
              src: 'https://unilife.pec.com.tw/images/event-38-q1-a2.jpg',
              message:
                '妳雖然年紀輕輕，但個性穩重，具有領導能力。在團體中，妳多半處在領導地位。但是有時太不服輸，因而容易得罪朋友，擁有女王風範的妳，應該適合的讓妳自己擁有女性的溫柔魅力，女王節，買個金飾來好好愛自己吧!',
            },
            {
              text: '默默的保持距離',
              activityType: '2022-0207-4',
              src: 'https://unilife.pec.com.tw/images/event-38-q1-a3.jpg',
              message:
                '妳是一個人緣很好的女生，思緒靈活有趣，不會令人覺得厭煩。在戀愛方面，自尊心很強，屬於默默付出的那一型，若是失敗會特別的難過，但還是會努力去挽回，總可以融入大家的妳，巧克力是最適合妳的商品了!',
            },
            {
              text: '哭得很傷心，讓他知道',
              activityType: '2022-0207-2',
              src: 'https://unilife.pec.com.tw/images/event-38-q1-a4.jpg',
              message:
                '妳是一個小公主，脾氣任性，比較嬌生慣養。戀愛方面，妳可能會吸引到霸氣外漏的男孩，不過只要他夠疼妳，妳也願意做一個屬於對方的小女孩，女王節，就做自己的女王吧，選一項屬於自己的禮物吧!',
            },
          ],
        },
        {
          src: 'https://unilife.pec.com.tw/images/event-38-q2.png',
          optionArray: [
            {
              text: '零用錢亂花',
              activityType: '2022-0207-1',
              src: 'https://unilife.pec.com.tw/images/event-38-q2-a1.jpg',
              message:
                '你總是想吃就吃、想生氣就生氣、開心就很開心，對大家毫不保留。雖然挺幼稚，不過有時也就像孩子一樣討人喜歡，感覺上擁有女王風範的妳，其實也很希望能收到喜歡的花束吧!沒關係，女王節買個金飾好好愛自己吧!',
            },
            {
              text: '跟另一半爭執',
              activityType: '2022-0207-2',
              src: 'https://unilife.pec.com.tw/images/event-38-q2-a2.jpg',
              message:
                '你的內心已經趨於成熟，對於身上肩負的責任看得很重，尤其是來自家庭的負荷。你將逐漸建立起屬於自己的家庭，在柴米油鹽的平凡生活中找到小小的幸福，女王節，選一樣喜歡的商品好好犒賞自己吧!',
            },
            {
              text: '成績不佳',
              activityType: '2022-0207-4',
              src: 'https://unilife.pec.com.tw/images/event-38-q2-a3.jpg',
              message:
                '你的內心深處還有很多夢想沒有實現，努力追逐夢想是你目前認為最重要的事。比起平淡的生活，你總是擁有多采多姿的經歷可以和大家分享，多款巧克力最能代表妳現在的生活了!女王節，就買盒巧克力好好的愛自己吧!',
            },
            {
              text: '身體健康狀況',
              activityType: '2022-0207-5',
              src: 'https://unilife.pec.com.tw/images/event-38-q2-a4.jpg',
              message:
                '你的內心深處已經相當平穩，就像老人家一樣，只要穩穩當當，平平安安的過生活就感到安心。水晶類的商品，很適合您目前的狀態呢!選一個您喜歡的水晶，女王節好好愛自己吧!',
            },
          ],
        },
        {
          src: 'https://unilife.pec.com.tw/images/event-38-q3.jpg',
          optionArray: [
            {
              text: 'A',
              activityType: '2022-0207-1',
              src: 'https://unilife.pec.com.tw/images/event-38-q3-a1.jpg',
              message:
                '妳特別驕傲，內心渴望變強大，你會為此努力且拼命，可無論變得多麼優秀，內心深處總會有點點小自卑，看似擁有女王風範的妳，金飾類的商品最能滿足內心的妳了!',
            },
            {
              text: 'B',
              activityType: '2022-0207-2',
              src: 'https://unilife.pec.com.tw/images/event-38-q3-a2.jpg',
              message:
                '無論身處哪種環境，無論是面對工作，還是感情，你都非常的理性，能夠縝密的分析對方的一舉一動，有時候適時的放輕鬆，溫柔一點，生活會更順利唷!女王節，選一個自己喜歡的禮物好好愛自己吧!',
            },
            {
              text: 'C',
              activityType: '2022-0207-5',
              src: 'https://unilife.pec.com.tw/images/event-38-q3-a3.jpg',
              message:
                '性格獨立的妳，崇尚強者,不過相比於此，你更希望自己成為強者，成為被別人依賴的人，女王節，水晶類的商品是最能代表妳的禮物了!',
            },
            {
              text: 'D',
              activityType: '2022-0207-4',
              src: 'https://unilife.pec.com.tw/images/event-38-q3-a4.jpg',
              message:
                '做事認真負責，個人能力很強，你，總能在最短的時間內盡善盡美的完成領導交付的任務，你是上司的得力助手，只要努力，你會成為所在領域的領頭羊，巧克力絕對是妳女王節的首選商品!',
            },
          ],
        },
        {
          src: 'https://unilife.pec.com.tw/images/event-38-q4.png',
          optionArray: [
            {
              text: '中間的花瓶',
              activityType: '2022-0207-4',
              src: 'https://unilife.pec.com.tw/images/event-38-q4-a1.jpg',
              message:
                '你的內外在反差很強大，也許外表是個冰山，內心卻非常熱情奔放，你很會看別人臉色做事，擁有很強的第六感，會先注意到細節，並預先處理。是團體中不可或缺的靈魂決策者有很高的應變能力，可以木訥也可以很熱情，延展性很強，適時的放鬆也很重要，女王節就買盒巧克力放鬆一下吧!',
            },
            {
              text: '貓',
              activityType: '2022-0207-1',
              src: 'https://unilife.pec.com.tw/images/event-38-q4-a2.jpg',
              message:
                '你是一個體貼且善解人意的人，好像能看透每個人心中的想法，是一個很好的聆聽者以及情感開導者，讓身邊的朋友對你非常依賴，有困惑也會主動找你訴苦，深得大家的信任，這樣的你在各種場合中，總是能隨和地展現自我、遊刃有餘，看似擁有女王風範的妳，女王節也需要好好愛自己吧!買個飾品當自己的女王吧!',
            },
            {
              text: '女人',
              activityType: '2022-0207-5',
              src: 'https://unilife.pec.com.tw/images/event-38-q4-a3.jpg',
              message:
                '你是一個思想豐富，但你總是將自己隱藏起來，只會在適當時機展露自己的本能，神秘又極具吸引力。除此之外，你是一個直率的人，随和又重義氣。女王節，水晶的商品是最適合妳的!',
            },
            {
              text: '椅子',
              activityType: '2022-0207-2',
              src: 'https://unilife.pec.com.tw/images/event-38-q4-a4.jpg',
              message:
                '你有著雙重的性格，喜歡一個人沉靜思考的感受，卻也喜歡與大家同樂的感覺。有時候會讓人猜不透你在想些什麼，就像是蒙上了一層面紗，有點距離感跟神秘感。你遇到事情會很專注，雖然有時作風上看有些叛逆，但其實很能給人安定感，不自覺讓人感到信任，女王節買個自己喜歡的禮物好好愛自己吧!',
            },
          ],
        },
        {
          src: 'https://unilife.pec.com.tw/images/event-38-q5.jpg',
          optionArray: [
            {
              text: '牛肉',
              activityType: '2022-0207-1',
              src: 'https://unilife.pec.com.tw/images/event-38-q5-a1.jpg',
              message:
                '好脾氣0壞脾氣100%:你這個人個性有點急，你無法忍受做事情拖拖拉拉的人，這很容易點燃你的怒火，變得不耐煩，不過你通常生氣都是對事不對人，不會記仇、很快心情就會平復了。另外，你很重視家人和朋友，若是身邊的人受到欺負，那你絕對是無法忍受，說什麼也要幫他們出氣，這樣的壞脾氣，其實也是給身邊的人帶來很多安全感呢!擁有女王風範的妳，金條是最能展現妳自己的商品喔!',
            },
            {
              text: '麵條',
              activityType: '2022-0207-4',
              src: 'https://unilife.pec.com.tw/images/event-38-q5-a2.jpg',
              message:
                '好脾氣80%.壞脾氣20%:你雖然不隨便發脾氣，但也不表示你的脾氣好，你的個性穩重，而且相當精明，遇到不滿的事情時，你通常會先忍耐，等到對的時機，便會給對方來個一槍斃命，讓人不寒而標!不過平時的你就是一個大好人，不管跟你玩的有多過火，你都不會發脾氣，所以大家多喜歡跟你做朋友!很會融入大家的妳，女王節就買盒巧克力好好愛自己吧!',
            },
            {
              text: '湯',
              activityType: '2022-0207-2',
              src: 'https://unilife.pec.com.tw/images/event-38-q5-a3.jpg',
              message:
                '好脾氣100%壞脾氣0%:你有很好的修養，遇到無理取鬧的事情，你通常是一笑置之，你並不會真正的發起脾氣來，但是若你遇到真的很自目的人，你還是會漸漸地疏遠對方，並不會真的與對方撕破臉,不過你也不是沒有脾氣的，只要不要踩到你的地雷,大家就相安無事，一旦誤入禁區，那可就嚇人了!好好寵愛自己吧，選樣喜歡的商品來犒賞一下自己!',
            },
            {
              text: '青菜',
              activityType: '2022-0207-5',
              src: 'https://unilife.pec.com.tw/images/event-38-q5-a4.jpg',
              message:
                '好脾氣60%.壞牌氣40%:你是一個很會控制情緒的人，你並不會隨便發脾氣，但也不好惹，有人刻意踩到你的底線時，你會先忍下來，一旦爆發，那可就吃不完兜著走了!你有著硬脾氣，不會輕易的認輸，激將法對你來說可是相當有效，你認真起來，是連自己都會害怕的，雖然你骨子裏流著不屈不饒的血液，但你待人卻是好的無話可說，當你的朋友真的是很值得!氣場如虹的妳，水晶類的商品是最適合妳的了!',
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