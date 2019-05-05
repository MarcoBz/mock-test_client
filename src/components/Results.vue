<template>
  <div id="mocktest">
    <div class = "container">
      <div class="row justify-content-md-center text text-success font-weight-bold">Corrent Answers = {{correctAnswers}}/{{nQuestions}}</div>
      <div class="row justify-content-md-center text text-danger font-weight-bold">Wrong Answers = {{wrongAnswers}}/{{nQuestions}}</div>
      <div class="row justify-content-md-center text text-warning font-weight-bold">No Answers ={{noAnswers}}/{{nQuestions}}</div>
      <div class="row justify-content-md-center text font-weight-bold">Total Points = {{totalPoints}}/{{nQuestions}}</div>
      <hr>
      <div class="row justify-content-md-center text font-weight-bold">Wrong or No answers</div>
      <div class="row justify-content-md-center text font-weight-bold">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col" class="text text-right">Question</th>
              <th scope="col" class="text text-center">Correct Answer</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for = "(question, index) in questions">
                <th scope="row" v-if = "!question.givenAnswer || question.givenAnswer != question.correctAnswer">{{index}}</th>
                <td class="text text-right" v-if = "!question.givenAnswer || question.givenAnswer != question.correctAnswer">{{question.question}}</td>
                <td class="text text-center" v-if = "!question.givenAnswer || question.givenAnswer != question.correctAnswer">{{question.correctAnswerText.answer}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import router from '../router'
export default {
  name: 'Results',
  props: ["questions", "parameters"],
  data () {
    return {
      nQuestions: this.parameters.nQuestions,
      correctAnswersPoints: this.parameters.correctAnswersPoints,
      noAnswersPoints: this.parameters.noAnswersPoints,
      wrongAnswersPoints: this.parameters.wrongAnswersPoints,
      correctAnswers: 0,
      wrongAnswers: 0,
      noAnswers: 0,
      totalPoints: 0
    }
  },

  mounted(){
    
    if (this.questions) {
      for (let i = 0; i < this.questions.length; i++){
        if (!this.questions[i].givenAnswer) this.noAnswers++
        else if (this.questions[i].givenAnswer == this.questions[i].correctAnswer) this.correctAnswers++
        else this.wrongAnswers++
      }
      this.totalPoints = this.correctAnswers * this.correctAnswersPoints + this.wrongAnswers * this.wrongAnswersPoints + this.noAnswers * this.noAnswersPoints
    }

  },

  methods:{
    clear(){
      this.nQuestions = null
      this.correctAnswersPoints= null
      this.noAnswersPoints= null
      this.wrongAnswersPoints= null
      this.correctAnswers= 0
      this.wrongAnswers= 0
      this.noAnswers= 0
      this.totalPoints= 0
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
