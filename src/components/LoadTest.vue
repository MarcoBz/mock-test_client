<template>
  <div id = "loadtest">
    <div class="container-fluid align-middle">
        <div class = "row" v-if="show">
          <div class = "col col-md-4 text-center">
            <button class="btn margin-btn" v-on:click="chooseTest(test.testName)"  v-bind:class="{'btn-success' : test.isClicked}" v-for="test in tests"> {{test.testName}}</button>
          </div>
          <div class = "col col-md-4 text-center">
            <div v-if="showTestDetails">
              <div v-for="moduleObj in modules"> 
                <button class="btn" v-on:click="chooseModule(moduleObj.moduleName)" v-bind:class="{'btn-success' : moduleObj.isClicked}" > {{moduleObj.moduleName}}</button> 
              </div>
            </div>
          </div>
          <div class = "col col-md-4 text-center" >
            <div v-if="showTestDetails">
              <div class = "row">Number of questions : {{testSettings.numbersOfQuestions}}</div>
              <div class = "row">Points for correct answer: {{testSettings.correctAnswersPoints}}</div>
              <div class = "row">Points for wrong answer : {{testSettings.wrongAnswersPoints}}</div>
              <div class = "row">Points for no answer : {{testSettings.noAnswersPoints}}</div>
              <div class = "row">Number of Answers : {{testSettings.numbersOfAnswers}}</div>
              <div class = "row">Minutes for test : {{testSettings.timeForTest}}</div>
            </div>
          </div>
        </div>
        <div class = "row" v-if="showGetQuestions">
          <div class = "col text-center">
            <button class="btn margin-btn" v-on:click="loadQuestions" v-bind:class="{'btn-success' : isLoadButtonClicked}"> Load questions </button>
          </div>
        </div>
        <div class = "row" v-if="showGetQuestions">
          <div class = "col text-center">
            <DragAndDrop @parsedJson="parsedJSONFunction" @changedFile="clear" ref="dragAndDropComp"/>
          </div>
        </div>

        <div class = "row" v-if="showCreateTestButton">
          <div class = "col text-center">
            <button class="btn btn-primary margin-btn" v-on:click="createTest"> Create Test </button>
          </div>
        </div>

    </div>
  </div>
</template>

<script>
  import userService from '../../services/userService'
  import DragAndDrop from './DragAndDrop'
  export default {
    name: 'LoadTest',
    props: ["user"],
    components: {
      DragAndDrop
    },
    data () {
      return {
        show: false,
        tests: [],
        modules: [],
        testSettings: {                
          numbersOfQuestions: null,
          correctAnswersPoints: null,
          wrongAnswersPoints: null,
          noAnswersPoints: null,
          numbersOfAnswers: null,
          timeForTest: null
        },
        showTestDetails: false,
        chosenTestName: null,
        chosenModulesName: [],
        isLoadButtonClicked: false,
        showGetQuestions: false,
        allQuestions: [],
        showCreateTestButton: false
      }
    },

    async mounted(){
      let response
      try{
        response = await (userService.getTest(this.user))
      }
      catch (err){
        response = err.response
      }
      finally {
        if (response.data.content) {
          for (let i = 0; i < response.data.content.length; i++){
            this.tests.push({
              testName: response.data.content[i].testName,
              createdDate: response.data.content[i].createdDate,
              isClicked: false
            })
            this.show = true
          }
        }
      }
    },

    methods: {

      createTest(){
        let value = {

          test: this.chosenTestName,
          modules: this.chosenModulesName,
          allQuestions: this.allQuestions,
          testSettings: this.testSettings,
          saveResults: true

        }

        this.$emit('gotQuestions', value)
      },

      parsedJSONFunction(value){
        for (let i = 0; i < value.length; i++) this.allQuestions.push(value[i])
        console.log(this.allQuestions)
        this.showCreateTestButton= true
        this.isLoadButtonClicked= false
      },

      clear(){
        this.isLoadButtonClicked= false
        this.showCreateTestButton= false
        this.allQuestions= []
      },

      async loadQuestions(){
        
        this.showCreateTestButton= false
        this.allQuestions= []
        if (this.isLoadButtonClicked){
          this.isLoadButtonClicked= false
          this.showCreateTestButton= false
        }
        else{
          let response
          try{
            response = await (userService.getTest(this.user, this.chosenTestName, "questions"))
          }
          catch (err){
            response = err.response
          }
          finally {
            if (response.data.content) {
              for (let i = 0; i < response.data.content.length; i++) this.allQuestions.push(response.data.content[i])
              if(this.$refs.dragAndDropComp) this.$refs.dragAndDropComp.clear()
              this.isLoadButtonClicked = true
              this.showCreateTestButton = true
            }
          }
        }

      },

      chooseTest(testName){
        this.tests.find(c => c.testName === testName).isClicked = true
        if(this.chosenTestName) this.tests.find(c => c.testName === this.chosenTestName).isClicked = false
        if(this.chosenTestName != testName) {
            this.chosenTestName = testName
            this.showTestDetails = true
        }
        else {
          this.chosenTestName = null
          this.showTestDetails = false
          this.showGetQuestions= false
          this.clear()
        }

        this.modules = []
        this.chooseModuleName()
        this.getTestSettings()
      },

      async getTestSettings(){
        let response
        try{
          response = await (userService.getTest(this.user, this.chosenTestName, "testSettings"))
        }
        catch (err){
          response = err.response
        }
        finally {
          if (response.data.content) {
              this.testSettings= {
                numbersOfQuestions: response.data.content.numbersOfQuestions,
                correctAnswersPoints: response.data.content.correctAnswersPoints,
                wrongAnswersPoints: response.data.content.wrongAnswersPoints,
                noAnswersPoints: response.data.content.noAnswersPoints,
                numbersOfAnswers: response.data.content.numbersOfAnswers,
                timeForTest: response.data.content.timeForTest
              }
          }
        }  
      },

      chooseModule(moduleName){
        if (this.modules.find(c => c.moduleName === moduleName).isClicked) {
          for( let i = 0; i < this.chosenModulesName.length; i++){ 
            if ( this.chosenModulesName[i] === moduleName) {
              this.chosenModulesName.splice(i, 1); 
            }
          }
          this.modules.find(c => c.moduleName === moduleName).isClicked = false
        }
        else {
          this.modules.find(c => c.moduleName === moduleName).isClicked = true
          this.chosenModulesName.push(moduleName)
        }
        if (this.chosenModulesName.length > 0) this.showGetQuestions = true
        else {
          this.showGetQuestions = false
          this.clear()
        }

      },

      async chooseModuleName(){
        let response
        try{
          response = await (userService.getTest(this.user, this.chosenTestName, "modules"))
        }
        catch (err){
          response = err.response
        }
        finally {
          if (response.data.content) {
            for (let i = 0; i < response.data.content.length; i++){
              this.modules.push({
                moduleName: response.data.content[i].moduleName,
                createdDate: response.data.content[i].createdDate,
                isClicked: false
              })
            }
          }
        }        
      },


    }
  }
</script>

<style>
  .margin-btn{
    margin: 10px
  }
</style>
