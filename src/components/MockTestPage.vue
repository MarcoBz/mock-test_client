<template>
  <div id="mocktest">
    <div id = "header-mocktest" class = "container">
        <div class="row justify-content-md-center">
          <!-- <div class="col col-lg-6"><input id="csvFile" type="text" placeholder="csv File" ></div> -->
          <div class="col"><input v-model="nQuestions" type="text" placeholder="N° Questions" ></div>
        </div>
        <div class="row justify-content-md-center">
          <div class="col col-lg-4"><input v-model="correctAnswersPoints" type="text" placeholder="Points correct answer" ></div>
          <div class="col col-lg-4"><input v-model="wrongAnswersPoints" type="text" placeholder="Points wrong answer" ></div>
          <div class="col col-lg-4"><input v-model="noAnswersPoints" type="text" placeholder="Points no answer" ></div>
        </div>
        <div class="row justify-content-md-center">
          <div v-on:click="goOn" class="col"><button class="btn">Go On</button></div>
        </div>
    </div>
    <div id = "body-mocktest" class = "container" v-if="inputCreated">
      <Test v-bind:allQuestions="allQuestions" v-bind:parameters = "parameters"  ref="Test"/>
    </div>
  </div>
</template>

<script>
import router from '../router'
import Test from './Test'
export default {
  name: 'MockTest',
  props: ["allQuestions"],  
  components: {
    Test
  },
  data () {
    return {
      nQuestions: null,
      correctAnswersPoints: null,
      noAnswersPoints: null,
      wrongAnswersPoints: null,
      inputCreated: false,
      parameters:{
        nQuestions: null,
        correctAnswersPoints: null,
        noAnswersPoints: null,
        wrongAnswersPoints: null     
      }
    }
  },

  mounted(){
    if (!this.allQuestions) {
      this.$emit('refreshAll')
    }
  },

  methods: {

    goOn(){

      this.inputCreated = true
      this.parameters.nQuestions = this.nQuestions
      this.parameters.correctAnswersPoints = this.correctAnswersPoints
      this.parameters.noAnswersPoints = this.noAnswersPoints
      this.parameters.wrongAnswersPoints = this.wrongAnswersPoints
      if (this.$refs.Test) this.$refs.Test.refresh()
    },

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

input:checked + span{
  font-weight: bold
}

h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
