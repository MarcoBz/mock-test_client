<template>
  <div id="results">
    <div class = "container">
      <div class="row justify-content-md-center text text-success font-weight-bold">Corrent Answers = {{correctAnswers}}/{{numbersOfQuestions}}</div>
      <div class="row justify-content-md-center text text-danger font-weight-bold">Wrong Answers = {{wrongAnswers}}/{{numbersOfQuestions}}</div>
      <div class="row justify-content-md-center text text-warning font-weight-bold">No Answers ={{noAnswers}}/{{numbersOfQuestions}}</div>
      <div class="row justify-content-md-center text font-weight-bold">Total Points = {{totalPoints}}/{{numbersOfQuestions}}</div>
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
import userService from '../../services/userService'
export default {
  name: 'Results',
  props: ["questions", "testSettings", "user", "testName", "modules"],
  data () {
    return {
      numbersOfQuestions: this.testSettings.numbersOfQuestions,
      correctAnswersPoints: this.testSettings.correctAnswersPoints,
      noAnswersPoints: this.testSettings.noAnswersPoints,
      wrongAnswersPoints: this.testSettings.wrongAnswersPoints,
      correctAnswers: 0,
      wrongAnswers: 0,
      noAnswers: 0,
      totalPoints: 0,
      showResults: false
    }
  },

  async mounted(){
    if (this.questions) {
      for (let i = 0; i < this.questions.length; i++){
        if (!this.questions[i].givenAnswer) this.noAnswers++
        else if (this.questions[i].givenAnswer == this.questions[i].correctAnswer) this.correctAnswers++
        else this.wrongAnswers++
      }
      this.totalPoints = this.correctAnswers * this.correctAnswersPoints + this.wrongAnswers * this.wrongAnswersPoints + this.noAnswers * this.noAnswersPoints
      let response
      let results = {
        numbersOfQuestions: this.numbersOfQuestions,
        correctAnswersPoints: this.correctAnswersPoints,
        noAnswersPoints: this.noAnswersPoints,
        wrongAnswersPoints: this.wrongAnswersPoints,        
      } 
      // try{
      //   response = await userService.postResult(this.user, this.testName, this.modules, this.totalPoints, results)
      // }
      // catch (err){
      //   response = err.response
      // }
      // finally {
      //   if (response.status === 201) {
      //     this.showResults = true
      //   }
      // }
      this.showResults = true
    }

  },

  methods:{
    clear(){
      this.numbersOfQuestions = null
      this.correctAnswersPoints= null
      this.noAnswersPoints= null
      this.wrongAnswersPoints= null
      this.correctAnswers= 0
      this.wrongAnswers= 0
      this.noAnswers= 0
      this.totalPoints= 0
      this.showResults = false
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
