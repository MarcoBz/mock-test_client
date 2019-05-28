<template>
  <div id="app">
    <div id = "header" class = "container">
        <div class="row justify-content-md-center">
          <div v-on:click="createMockTest" class="col" v-show="csvParsed"><button class="btn">Create Mock Test</button></div>
        </div>
        <div class="row justify-content-md-center">
          <div v-on:click="createJsonFromCsv" class="col" v-show="csvParsed"><button class="btn">Create Json</button></div>
        </div>
        <div class="row justify-content-md-center">
          <div v-on:click="createMockTest" class="col" v-show="jsonParsed"><button class="btn">Create Mock Test</button></div>
        </div>
        <div class="row justify-content-md-center">
          <div v-on:click="createTable" class="col" v-show="pdfParsed"><button class="btn">Create Json</button></div>
        </div>
    </div>
    <DragAndDrop @changedFile="hideButtonCreate"  @parsedCsv="passFileData"  @parsedPDF="passPDFData" @parsedJson="passJsonData" v-if="!created" ref="dragAndDropComp"/>
    <div id = "main">
      <router-view  @refreshAll="clear" v-if="created" />
    </div>
    <div id = "footer">
      <div class="row justify-content-md-center">
        <div id="clearButton" class="col col-6">
          <button class="btn" v-on:click="clear">Clear</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DragAndDrop from './components/DragAndDrop'
import router from './router'
export default {
  name: "App",
  components: {
    DragAndDrop
  },
  data () {
    return {
      created: false,
      csvParsed: false,
      allQuestions: null,
      pdfParsed: false,
      jsonParsed: false,
      allRows: null
    }
  },

  mounted(){
    router.push({ path: '/'})
  },

  methods: {

    createJsonFromCsv(){
      let json = []
      for (let i = 0; i < this.allQuestions.length; i++){
        let answerArray = []
        for (let j = 0; j < this.allQuestions[i].answers.length; j++) {
          answerArray.push(this.allQuestions[i].answers[j].answer)
        }
        json.push({
          question: this.allQuestions[i].question,
          answers: answerArray,
          correctAnswer: this.allQuestions[i].correctAnswer
        })
      }
      if (json != []){
        var hiddenElement = document.createElement('a')
        hiddenElement.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json))
        let currentDate = new Date().toISOString()
        hiddenElement.download = 'json_' + currentDate + '.json'
        hiddenElement.click()
      }
      this.clear()
    },

    createMockTest(){
      this.created = true
      this.csvParsed = false
      this.jsonParsed = false
      router.push({ name: 'MockTestPage', params: {allQuestions: this.allQuestions}})
    },   
    createTable(){
      this.created = true
      this.pdfParsed = false
      router.push({ name: 'Table', params: {allRows: this.allRows}})
    }, 
    
    clear(){
      if(this.$refs.dragAndDropComp) this.$refs.dragAndDropComp.clear()
      this.created= false
      this.csvParsed= false
      this.allQuestions= null
      this.pdfParsed= false
      this.jsonParsed= false
      this.allRows= null
      router.push({ path : '/'})
    },

    passFileData(value){
      this.allRows = null
      this.pdfParsed = false
      this.jsonParsed = false
      this.allQuestions = value
      this.csvParsed = true
    },

    passPDFData(value){
      this.allQuestions = null
      this.csvParsed = false
      this.jsonParsed = false
      this.allRows = value
      this.pdfParsed = true
    },
    
    passJsonData(value){
      this.allRows = null
      this.csvParsed = false
      this.pdfParsed = false
      this.allQuestions = value
      this.jsonParsed = true
    },

    hideButtonCreate(){
      this.csvParsed = false
      this.pdfParsed = false
      this.allQuestions = null
      this.allRows = null  
      this.jsonParsed = false   
    }

  }

}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
