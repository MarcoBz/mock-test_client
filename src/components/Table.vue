<template>
  <div id="table">
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Question</th>
          <th scope="col">Answer</th>
          <th scope="col">Correct Answer</th>
          <th scope="col" class="text text-left">String</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for = "row in rows">
          <th scope="row">{{row.numRow}}</th>
          <td><button class  ="btn" v-on:click="questionButton(row.numRow)" v-bind:class= "{'btn-success' : row.isQuestion}" ></button></td>
          <td><button class  ="btn" v-on:click="answerButton(row.numRow)" v-bind:class= "{'btn-info' : row.isAnswer}"></button></td>
          <td><button class  ="btn" v-on:click="correctAnswerButton(row.numRow)" v-bind:class= "{'btn-danger' : row.isCorrect}"></button></td>
          <td class="text text-left" v-bind:class= "{'text-success' : row.isQuestion, 'text-info' : row.isAnswer, 'text-danger' : row.isCorrect}">{{row.str}}</td>
        </tr>
      </tbody>
    </table>
    <button class  ="btn" v-on:click="download" >Download</button>
    <div v-if="showModal">
    <transition name="modal">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-body">
                <div class="container-fluid">
                  <div v-for="question in questions" >
                    <div v-if="!question.correctAnswer">
                      <div class="row justify-content-md-center">
                        <div class="col col-lg-2 border">
                        </div>
                        <div class="col col-lg-10 border font-weight-bold">
                          {{question.question}}
                        </div>
                      </div>
                      <div class="row justify-content-md-center" v-for="answer in question.answers">
                        <div class="col col-lg-2 border">
                          <button class  ="btn" v-on:click="correctAnswerButton(answer.numRow)" v-bind:class= "{'btn-danger' : rows.find(c => c.numRow === answer.numRow).isCorrect}"></button>
                        </div>
                        <div class="col col-lg-10 border text text-left" v-bind:class= "{'text-danger' : rows.find(c => c.numRow === answer.numRow).isCorrect}" >
                          {{answer.str}}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>  
              </div>
              <div class="modal-footer">
                <div class="row justify-content-md-center">
                  <div class="col col-lg-4"></div>
                  <div class="col col-lg-4">
                    <button type="button" class="btn" v-on:click="showModal = false"> Ok </button>
                  </div>
                  <div class="col col-lg-4"></div>
                  
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
export default {
  name: 'Table',
  props: ["allRows"],
  data () {
    return {
      rows : [],
      questions: [],
      pointersArray: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
      showModal: false
    }
  },

  mounted(){
  
    if (!this.allRows) {
      this.$emit('refresh')
    }
    else {    
      for (let i = 0; i < this.allRows.length; i++){
        this.rows.push({
          str: this.allRows[i],
          numRow: i,
          isQuestion: false,
          isAnswer: false,
          isCorrect: false,
          showModal: false
        })
      }
    }
  },

  methods: {

    createQuestionsArray(){
      let questionStr = ""
      let answersArray = []
      let correctAnswer = ""

  //     let shuffled = this.shuffle(this.rows)
  // //100 questions
  //     let number = 250
  //     for (let i = 0; i < number * 5; i++){
  //       this.questions.push({
  //           question: shuffled[i].str,
  //           answers: [
  //             shuffled[i+1].str,
  //             shuffled[i+2].str,
  //             shuffled[i+3].str,
  //             shuffled[i+4].str
  //           ],
  //           correct: this.pointersArray[parseInt(Math.random() * 4)] 
  //       })
  //       i += 4
  //     }

      for (let i = 0; i < this.allRows.length; i++){
        if (this.rows.find(c => c.numRow === i).isQuestion){
          questionStr = this.rows.find(c => c.numRow === i).str
        }
        else if (this.rows.find(c => c.numRow === i).isAnswer){
          answersArray.push({
            str: this.rows.find(c => c.numRow === i).str,
            numRow: i
          })
          if (this.rows.find(c => c.numRow === i).isCorrect){
            
            correctAnswer = this.rows.find(c => c.numRow === i).str
          }
        }
        if(( i+1 == this.allRows.length || this.rows.find(c => c.numRow === i+1).isQuestion) && questionStr  != ""){
          this.questions.push({
            question: questionStr,
            answers: answersArray,
            correctAnswer: this.pointersArray[answersArray.indexOf(answersArray.find(c => c.str == correctAnswer))]
          })  
          answersArray = []
          correctAnswer = ""        
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

    csvFile(){
      let csv = ""
      for (let i = 0; i < this.questions.length; i++){
        let answerArray = []
        for (let j = 0; j < this.questions[i].answers.length; j++) answerArray.push(this.questions[i].answers[j].str)
        csv += this.questions[i].question + "$" + answerArray.join("$") + "$" + this.questions[i].correctAnswer
        if ( i + 1 != this.questions.length) csv += "\n"
      }
      if (csv != ""){
        var hiddenElement = document.createElement('a')
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv)
        let currentDate = new Date().toISOString()
        hiddenElement.download = 'csv_' + currentDate + '.csv'
        hiddenElement.click()
        }
    },

    jsonFile(){
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

    download(){
      this.questions = []
      this.createQuestionsArray()
      let checkAllCorrectAnswers = true
      for(let i = 0; i < this.questions.length; i++){
        if (!this.questions[i].correctAnswer) checkAllCorrectAnswers = false
      }


      if (checkAllCorrectAnswers){
        // this.csvFile()
        this.jsonFile()
        this.$emit('refresh')        
      }
      else{
        this.showModal = true
      }

    },
    questionButton(numRow){
      if (!this.rows.find(c => c.numRow === numRow).isQuestion) this.rows.find(c => c.numRow === numRow).isQuestion = true
      else this.rows.find(c => c.numRow === numRow).isQuestion = false
    },
    answerButton(numRow){
      if (!this.rows.find(c => c.numRow === numRow).isAnswer) this.rows.find(c => c.numRow === numRow).isAnswer = true
      else this.rows.find(c => c.numRow === numRow).isAnswer = false
    },
    correctAnswerButton(numRow){
      if (!this.rows.find(c => c.numRow === numRow).isCorrect) this.rows.find(c => c.numRow === numRow).isCorrect = true
      else this.rows.find(c => c.numRow === numRow).isCorrect = false
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

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
</style>
