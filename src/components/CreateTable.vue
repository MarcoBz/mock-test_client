<template>
  <div id="table">
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Question</th>
          <th scope="col">
            <div class="row text text-right"> Answers </div>
            <div class="row">
              <div class="col col-md-1" v-for= "i in currentPointersArray">{{i}}</div>
            </div>
          </th> 
          <th scope="col" class="text text-left">String</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for = "row in rows">
          <th scope="row">{{row.numRow}}</th>
          <td><button class  ="btn" v-on:click="questionButton(row.numRow)" v-bind:class= "{'btn-success' : row.isQuestion}" ></button></td>
          <td>
            <div class="row">
              <div class="col col-md-1"v-for= "i in currentPointersArray"><button class  ="btn" v-on:click="answerButton(row.numRow, i)" v-bind:class= "row.pointer === i ? 'btn-info' : ''"></button></div>
            </div>
          </td>
          <td class="text text-left" v-bind:class= "{'text-success' : row.isQuestion, 'text-info' : row.isAnswer, 'text-danger' : row.isCorrect}">{{row.str}}</td>
        </tr>
      </tbody>
    </table>
    <button class  ="btn margin-btn" v-on:click="goToDefineCorrectAnswers" >Define correct answers</button>
    <div v-if="showModal">
      <transition name="modal">
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-body">
                  <div class="container-fluid">
                    <div v-for="question in questions" >
                      <!-- <div v-if="!question.correctAnswer"> -->
                        <div class="row justify-content-md-center">
                          <div class="col col-lg-2 border">
                          </div>
                          <div class="col col-lg-10 border font-weight-bold">
                            {{question.question}}
                          </div>
                        </div>
                        <div class="row justify-content-md-center" v-for="answer in question.answers">
                          <div class="col col-lg-2 border">
                            <button class  ="btn" v-on:click="correctAnswerButton(question.numQuestion, answer.numAnswer)" v-bind:class= "{'btn-danger' : answer.isCorrect}"></button>
                          </div>
                          <div class="col col-lg-10 border text text-left" v-bind:class= "{'text-danger' : answer.isCorrect}" >
                            {{answer.str}}
                          </div>
                        </div>
                      <!-- </div> -->
                    </div>
                    <div class="row justify-content-md-center">
                      <div class="col col-md-4">
                        <button type="button" class="btn" v-on:click= "download" v-bind:disabled="!checkAllCorrectAnswers"> Download </button>
                      </div>
                      <div class="col col-md-4">
                        <button type="button" class="btn" v-on:click= "save" v-bind:disabled="!checkAllCorrectAnswers"> Save </button>
                      </div>
                      <div class="col col-md-4">
                        <button type="button" class="btn" v-on:click= "downloadAndSave" v-bind:disabled="!checkAllCorrectAnswers"> Download and Save</button>
                      </div>
                    </div>
                    <div class="row justify-content-md-center">
                      <div class="col col-md"><button type="button" class="btn" v-on:click= "back"> Back </button></div>
                    </div>
                  </div>  
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <div v-if="showNumberModal" >
      <transition name="modal">
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-body">
                    <div class="container-fluid">
                      <div class="row justify-content-md-center">
                        <div class="col">
                          Number of answers per question
                        </div>
                      </div>
                      <div class="row justify-content-md-center">
                        <div class="col"><input v-model="numberOfAnswers" type="text" placeholder="0" ></div>
                      </div>
                      <div class="row justify-content-md-center">
                        <button type="button" class="btn" @click="goToCreateQuestions"> OK </button>
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
import userService from '../../services/userService'
export default {
  name: 'CreateTable',
  props: ["user","allRows", "testName", "modules"],
  data () {
    return {
      rows : [],
      questions: [],
      pointersArray: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
      showModal: false,
      numberOfAnswers: 0,
      showNumberModal: false,
      currentPointersArray: null,
      checkAllCorrectAnswers: false
    }
  },

  created(){
    this.showNumberModal = true
  },

  mounted(){
    if (!this.allRows) {
      // this.$emit('refresh')
    }
    else {    
      for (let i = 0; i < this.allRows.length; i++){
        this.rows.push({
          str: this.allRows[i],
          numRow: i,
          isQuestion: false,
          isAnswer: false,
          pointer: null,
          isCorrect: false,
          showModal: false,
        })
      }
    }
  },



  methods: {

    goToCreateQuestions(){
     this.showNumberModal = false
     this.currentPointersArray = this.pointersArray.slice(0, this.numberOfAnswers)
    },

    joinAnswers(answersArray){
      let joinedAnswersArray = []
      let numAnswer = 0
      for (let i = 0; i < this.currentPointersArray.length; i++){
        let currentPointer = this.currentPointersArray[i]
        let toJoinAnswersArray = answersArray.filter((answer) => {
          return answer.pointer == currentPointer
        })
        toJoinAnswersArray = toJoinAnswersArray.map((answer) => {
          return answer.str
        })
        joinedAnswersArray.push({
          numAnswer: numAnswer,
          str: toJoinAnswersArray.join(" "),
          pointer: currentPointer,
          isCorrect: false
        })
        numAnswer += 1
      }
      return joinedAnswersArray
    },

    createQuestionsArray(){
      let questionStr = ""
      let answersArray = []
      let joinedAnswersArray = []
      let numQuestion = 0
      for (let i = 0; i < this.allRows.length; i++){
        if (this.rows.find(c => c.numRow === i).isQuestion){
          questionStr = this.rows.find(c => c.numRow === i).str
        }
        else if (this.rows.find(c => c.numRow === i).isAnswer){
          answersArray.push({
            str: this.rows.find(c => c.numRow === i).str,
            numRow: i,
            pointer: this.rows.find(c => c.numRow === i).pointer
          })
        }
        if(( i+1 == this.allRows.length || this.rows.find(c => c.numRow === i+1).isQuestion) && questionStr  != ""){
          joinedAnswersArray = this.joinAnswers(answersArray)
          this.questions.push({
            numQuestion: numQuestion,
            question: questionStr,
            answers: joinedAnswersArray,
            correctAnswer: null
          })  
          answersArray = []
          joinedAnswersArray = []
          numQuestion += 1  
        }
      }
    },
    
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

    downloadJsonFile(){
      let json = []
      for (let i = 0; i < this.questions.length; i++){
        let answerArray = []
        for (let j = 0; j < this.questions[i].answers.length; j++) answerArray.push(this.questions[i].answers[j].str)
        json.push({
          question: this.questions[i].question,
          answers: answerArray,
          correctAnswer: this.questions[i].correctAnswer
        })
      }
      if (json != []){
        var hiddenElement = document.createElement('a')
        hiddenElement.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json))
        let currentDate = new Date().toISOString()
        hiddenElement.download = 'json_' + currentDate + '.json'
        hiddenElement.click()
      }
    },

    async save(){
      if (this.checkAllCorrectAnswers){
        let response
        try{
          let op = "add"
          let path = "/questions"
          let value = []
          for (let i = 0; i < this.questions.length; i++){
            let answerArray = []
            for (let j = 0; j < this.questions[i].answers.length; j++) answerArray.push(this.questions[i].answers[j].str)
            value.push({
              question: this.questions[i].question,
              answers: answerArray,
              correctAnswer: this.questions[i].correctAnswer,
              testName: this.testName,
              modules: this.modules
            })
          }
          response = await userService.patchTest(this.user, this.testName, op, path, value)
        }
        catch (err){
          response = err.response
        }
        finally {
          if (response.data.content) {
            this.$emit('refresh')  
            this.showModal = false; 
            document.getElementById('body').className = ''
          }
        }
      }
    },

    downloadAndSave(){
      if (this.checkAllCorrectAnswers) this.downloadJsonFile()
      this.save()
    },

    download(){
      if (this.checkAllCorrectAnswers){
        this.downloadJsonFile()
        this.$emit('refresh')  
        this.showModal = false; 
        document.getElementById('body').className = ''
      }
    },

    back(){
      this.showModal = false; 
      this.questions = []
    },

    goToDefineCorrectAnswers(){
      this.questions = []
      this.createQuestionsArray()
      this.showModal = true
      document.getElementById("body").className = "modal-open"
    },
    
    questionButton(numRow){
      if (!this.rows.find(c => c.numRow === numRow).isQuestion) {
        this.rows.find(c => c.numRow === numRow).isQuestion = true
        this.rows.find(c => c.numRow === numRow).isAnswer = false
        this.rows.find(c => c.numRow === numRow).isCorrect = false
        this.rows.find(c => c.numRow === numRow).pointer = null
      }
      else this.rows.find(c => c.numRow === numRow).isQuestion = false
    },

    answerButton(numRow, pointer){
      if (!this.rows.find(c => c.numRow === numRow).isAnswer){
        this.rows.find(c => c.numRow === numRow).isAnswer = true
        this.rows.find(c => c.numRow === numRow).isQuestion = false
        this.rows.find(c => c.numRow === numRow).pointer = pointer
      }
      else if (this.rows.find(c => c.numRow === numRow).isAnswer && this.rows.find(c => c.numRow === numRow).pointer != pointer){
        this.rows.find(c => c.numRow === numRow).pointer = pointer
      }
      else if (this.rows.find(c => c.numRow === numRow).isAnswer && this.rows.find(c => c.numRow === numRow).pointer == pointer){
        this.rows.find(c => c.numRow === numRow).isAnswer = false
        this.rows.find(c => c.numRow === numRow).isCorrect = false
        this.rows.find(c => c.numRow === numRow).pointer = null
      }
    },
    correctAnswerButton(numQuestion, numAnswer){
      if(this.questions.find( c => c.numQuestion === numQuestion).answers.find( c=>c.numAnswer === numAnswer).isCorrect) {
        this.questions.find( c => c.numQuestion === numQuestion).answers.find( c=>c.numAnswer === numAnswer).isCorrect = false
        this.questions.find( c => c.numQuestion === numQuestion).correctAnswer = null
      }
      else {
        if (this.questions.find( c => c.numQuestion === numQuestion).answers.find( c=>c.pointer === this.questions.find( c => c.numQuestion === numQuestion).correctAnswer)) this.questions.find( c => c.numQuestion === numQuestion).answers.find( c=>c.pointer === this.questions.find( c => c.numQuestion === numQuestion).correctAnswer).isCorrect = false
        this.questions.find( c => c.numQuestion === numQuestion).answers.find( c=>c.numAnswer === numAnswer).isCorrect = true
        this.questions.find( c => c.numQuestion === numQuestion).correctAnswer = this.questions.find( c => c.numQuestion === numQuestion).answers.find( c=>c.numAnswer === numAnswer).pointer
      }

      let checkAllCorrectAnswers = true
      for(let i = 0; i < this.questions.length; i++){
        if (!this.questions[i].correctAnswer) checkAllCorrectAnswers = false
      }
      if (checkAllCorrectAnswers === true) this.checkAllCorrectAnswers = true
      else this.checkAllCorrectAnswers = false

    }
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
  color: U42b983;
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

.modal-open {
    overflow-y: hidden;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-body {
  margin: 20px 0;
  max-height: 800px;
  overflow-y: auto;
}


.margin-btn{
  margin: 10px
}

</style>
