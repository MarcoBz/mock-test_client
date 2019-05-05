<template>
  <div id="test">
      <div class="row justify-content-md-center" v-for="(question, index) in questions" v-if="showTest">
        <div class="coloredCol col col-sm-1 border" v-bind:class="[colorClass[index]]"></div>
        <div class="questionCol col col-sm-5 border">{{question.question}}</div>
        <div class="answersCol col col-sm-5 border">
          <div class="form-check" v-for="answer in question.answers">
            <label>
              <input class="form-check-input" :name="index" :value="answer.pointer" type="radio" :disabled="showCorrectAnswers" v-model="question.givenAnswer">
              <span>{{answer.pointer}}- {{answer.answer}}</span>
            </label>
          </div>
        </div>
        <div class="resultCol col col-sm-1 border">
          <div v-show="showCorrectAnswers">{{question.correctAnswer}}</div>
        </div>
      </div>

      <div class="row justify-content-md-center">
        <div class="col col-sm-3">
          <button class="btn" v-on:click="getResults">Get Results</button>
        </div>
        <div class="col col-sm-3">
          <button class="btn" v-on:click="restart">Restart</button>
        </div>
        <div class="col col-sm-3">
          <button class="btn" v-on:click="retry">Retry</button>
        </div>
        <div class="col col-sm-3">
          <button class="btn" v-on:click="refresh">Refresh</button>
        </div>
      </div>
      <Results v-if="showResults" v-bind:parameters = "parameters" v-bind:questions = "questions" ref="Results"/>
      <div v-if="showModal">
        <transition name="modal">
          <div class="modal-mask">
            <div class="modal-wrapper">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-body">
                    <div class="container-fluid">
                      <div class="row justify-content-md-center">
                        <div class="col">
                          {{text}}
                        </div>
                      </div>
                    </div>  
                  </div>
                  <div class="modal-footer">
                    <div class="container-fluid">
                      <div class="row justify-content-md-center">
                        <div class="col-md">
                          <button type="button" class="btn" @click="shufflePosition">
                            YES
                          </button>                          
                        </div>
                        <div class="col-md">
                          <button type="button" class="btn" @click="noShufflePosition">
                            NO
                          </button> 
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
  </div>
</template>

<script>
import router from '../router'
import Results from './Results'
export default {
  name: 'Test',
  components: {
    Results
  },
  props: ["allQuestions", "parameters"],
  data () {
    return {
      colorClass:[],
      shuffledQuestions: [],
      questions: [],
      showCorrectAnswers: false,
      nQuestions: this.parameters.nQuestions,
      showResults: false,
      showModal: false,
      test: null,
      showTest: false
    }
  },

  mounted(){
    if (this.$refs.Results) this.$refs.Results.clear()
    this.prepareQuestions()
    this.getQuestions()
    this.showTest= true
  },

  methods:{
    shuffle(array) {
      let counter = array.length;

      // While there are elements in the array
      while (counter > 0) {
          // Pick a random index
          let index = Math.floor(Math.random() * counter);

          // Decrease counter by 1
          counter--;

          // And swap the last element with it
          let temp = array[counter];
          array[counter] = array[index];
          array[index] = temp;
      }
      return array;
    },

    shuffleAnswers(questions){
      for (let i = 0; i < questions.length; i++){
        questions[i].answers = this.shuffle(questions[i].answers)
        let correctAnswerPointerIsUpdated = false
        for (let j = 0; j < questions[i].answers.length; j++){
          let pointersArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
          if (questions[i].answers[j].pointer == questions[i].correctAnswer && !correctAnswerPointerIsUpdated) {
            questions[i].correctAnswer = pointersArray[j]
            correctAnswerPointerIsUpdated = true
          }
          questions[i].answers[j].pointer = pointersArray[j]
        }
      }
      return(questions)
    },

    prepareQuestions(){

      for (let i = 0; i < this.allQuestions.length; i++) this.shuffledQuestions.push(this.allQuestions[i])

      this.shuffledQuestions = this.shuffle(this.shuffledQuestions)
      this.shuffledQuestions = this.shuffleAnswers(this.shuffledQuestions)
      
    },
    
    getQuestions(){
      for ( let i = 0; i < this.nQuestions; i++){
        let chosenQuestion = this.shuffledQuestions.pop()
        this.questions.push({
          question: chosenQuestion.question,
          answers: chosenQuestion.answers,
          correctAnswer: chosenQuestion.correctAnswer,
          givenAnswer: null,
          correctAnswerText: chosenQuestion.answers.find( c => c.pointer === chosenQuestion.correctAnswer)
        })
      }
    },

    getResults(){
      // router.push({ name: 'Results', params: {questions: this. questions, nQuestions: this.nQuestions, correctAnswersPoints: this.correctAnswersPoints, noAnswersPoints: this.noAnswersPoints, wrongAnswersPoints: this.wrongAnswersPoints}})
      this.showCorrectAnswers = true
      for(let i = 0; i < this.questions.length; i++){
        if (!this.questions[i].givenAnswer) {
          this.colorClass.push("background bg-warning")
        }
        else if (this.questions[i].givenAnswer == this.questions[i].correctAnswer) this.colorClass.push("background bg-success")
        else this.colorClass.push("background bg-danger")     
      }
      this.showResults = true
    },

    refresh(){
      window.scrollTo(0,0)
      this.clear()
      this.nQuestions = this.parameters.nQuestions
      this.prepareQuestions()
      this.getQuestions()
      this.showTest= true
    },

    restart(){
      window.scrollTo(0,0)
      if (this.$refs.Results) this.$refs.Results.clear()
      this.showResults = false
      this.showCorrectAnswers = false,
      this.colorClass = []

      for (let i = 0; i < this.questions.length; i++){
        this.questions[i].givenAnswer = null
      }
      //this.showTest= false
      this.showModal = true
      this.text = "Restart same test - Would you like to shuffle the position of questions and answers?"
    },

    retry(){
      window.scrollTo(0,0)
      if (this.$refs.Results) this.$refs.Results.clear()
      this.showResults = false
      this.showCorrectAnswers = false,
      this.colorClass = []
      let wrongQuestions = this.questions.filter((question) => {
        return question.givenAnswer != question.correctAnswer || !question.givenAnswer
      })

      let wrongQuestionsArray = wrongQuestions.map((question) => {
        return question.question
      })

      this.prepareQuestions()
      this.shuffledQuestions = this.shuffledQuestions.filter((question) => {
        return !wrongQuestionsArray.includes(question.question)
      })
      for (let i = 0; i < this.questions.length; i++){
        if (this.questions[i].givenAnswer == this.questions[i].correctAnswer){
          let chosenQuestion = this.shuffledQuestions.pop()
          this.questions[i] = {
            question: chosenQuestion.question,
            answers: chosenQuestion.answers,
            correctAnswer: chosenQuestion.correctAnswer,
            givenAnswer: null,
            correctAnswerText: chosenQuestion.answers.find( c => c.pointer === chosenQuestion.correctAnswer)
          }
        }
        else{
          this.questions[i].givenAnswer = null
        }
      }
      wrongQuestions = null
      wrongQuestionsArray = null
      //this.showTest= false
      this.showModal = true
      this.text = "Retry wrong o no answered questions with other random questions - Would you like to shuffle the position of questions and answers?"
    },

    shufflePosition(){
      this.questions = this.shuffle(this.questions)
      this.questions = this.shuffleAnswers(this.questions)
      this.showModal = false
      this.text = null
      this.showTest= true
    },

    noShufflePosition(){
      this.showModal = false
      this.text = null
      this.showTest= true
    },

    clear(){
      this.showResults = false
      this.questions = []
      this.showCorrectAnswers = false
      this.shuffledQuestions = []
      this.colorClass = []
      this.nQuestions = null
      if (this.$refs.Results) this.$refs.Results.clear()
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
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
</style>
