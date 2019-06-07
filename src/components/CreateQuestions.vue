<template>
  <div class="container-fluid align-middle">
    <div class="row">
      <div class="col col-12"> 
        <DragAndDrop @parsedPDF="parsedPDFFunction" @parsedJson="parsedJSONFunction" @changedFile="clear" ref="dragAndDropComp"/>
      </div>
    </div>
    <div class="row justify-content-md-center">
      <div v-on:click="chooseTestName" class="col col-12" v-show="pdfParsed || jsonParsed" ><button class="btn">Choose Test</button></div>
    </div>

    <div v-if="showModal" >
      <transition name="modal">
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-body">
                    <div class="container-fluid">
                      <div class="row justify-content-md-center">
                        <div class="col col-6">
                          <div class="row justify-content-md-center" v-for="test in tests">
                            <div class="col">
                              <button class="btn" v-on:click="chooseTest(test.testName)"  v-bind:class="{'btn-success' : test.isClicked}"> {{test.testName}}</button>
                            </div>
                          </div>
                        </div>
                        <div class="col col-6">
                          <div class="row justify-content-md-center" v-for="moduleObj in modules">
                            <div class="col">
                              <button v-if="moduleObj.moduleName" class="btn" v-on:click="chooseModule(moduleObj.moduleName)" v-bind:class="{'btn-success' : moduleObj.isClicked}"> {{moduleObj.moduleName}}</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div> 
                </div>
                <div class="modal-footer">
                    <div class="container-fluid">
                      <div class="row justify-content-md-center">
                        <div class="col col-6">
                          <button class="btn" v-on:click="createQuestions()" v-if="pdfParsed">Create Questions</button>
                          <button class="btn" v-on:click="saveQuestions()" v-if="jsonParsed">Save Questions</button>
                        </div>
                        <div class="col col-6">
                          <button class="btn" v-on:click="clearTestName()">Clear</button>
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
  import DragAndDrop from './DragAndDrop'
  import userService from '../../services/userService'
  export default {
    name: 'CreateQuestions',
    props: ['user', 'testName'],
    components: {
      DragAndDrop
    },
    data () {
      return {
        allRows: [],
        allQuestions: [],
        pdfParsed: false,
        jsonParsed: false,
        showModal: false,
        tests: [],
        modules: [],
        chosenTestName: null,
        chosenModulesName: ['general']
      }
    },
    methods: {

      async saveQuestions(){
        console.log(this.allQuestions)
        let response
        try{
          let op = "add"
          let path = "/questions"
          let value = []
          for (let i = 0; i < this.allQuestions.length; i++){
            let answerArray = []
            for (let j = 0; j < this.allQuestions[i].answers.length; j++) answerArray.push(this.allQuestions[i].answers[j].answer)
            value.push({
              question: this.allQuestions[i].question,
              answers: answerArray,
              correctAnswer: this.allQuestions[i].correctAnswer,
              testName: this.chosenTestName,
              modules: this.chosenModulesName
            })
          }
          response = await userService.patchTest(this.user, this.chosenTestName, op, path, value)
        }
        catch (err){
          response = err.response
        }
        finally {
          if (response.data.content) {
            this.$emit('refresh')  
            this.showModal= false
            document.getElementById('body').className = ''
          }
        }
      },

      clearAll(){
        if(this.$refs.dragAndDropComp) this.$refs.dragAndDropComp.clear()
        this.allRows = []
        this.allQuestions = []
        this.pdfParsed= false
        this.jsonParsed= false
        this.tests= []
        this.modules= []
        this.chosenTestName= null
        this.chosenModulesName= ['general']

      },

      clear(){
        this.allRows = []
        this.allQuestions = []
        this.pdfParsed= false
        this.jsonParsed= false
        this.tests= []
        this.modules= []
        this.chosenTestName= null
        this.chosenModulesName= ['general']
      },

      createQuestions(){
        this.showModal = false
        let value = {
          test: this.chosenTestName,
          modules: this.chosenModulesName,
          rows: this.allRows
        }
        this.$emit('createQuestions', value)
      },

      clearTestName(){
        this.showModal = false
        this.tests = []
        this.modules = []
      },

      chooseTest(testName){
        this.tests.find(c => c.testName === testName).isClicked = true
        if(this.chosenTestName) this.tests.find(c => c.testName === this.chosenTestName).isClicked = false
        if(this.chosenTestName != testName) this.chosenTestName = testName
        else this.chosenTestName = null

        this.modules = []
        this.chooseModuleName()

      },

      chooseModule(moduleName){
        if (this.modules.find(c => c.moduleName === moduleName).isClicked) {
          for( let i = 0; i < this.modules.length; i++){ 
            if ( this.modules[i].moduleName === moduleName) {
              this.modules.splice(i, 1); 
            }
          }
          this.modules.find(c => c.moduleName === moduleName).isClicked = false
        }
        else {
          this.modules.find(c => c.moduleName === moduleName).isClicked = true
          this.chosenModulesName.push(moduleName)
        }
      },

      parsedPDFFunction(value){
        for (let i = 0; i < value.length; i++) this.allRows.push(value[i])
        this.pdfParsed = true
        this.jsonParsed= false
      },

      parsedJSONFunction(value){
        for (let i = 0; i < value.length; i++) this.allQuestions.push(value[i])
        this.pdfParsed = false
        this.jsonParsed= true
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

              if (response.data.content[i].moduleName != "general") this.modules.push({
                moduleName: response.data.content[i].moduleName,
                createdDate: response.data.content[i].createdDate,
                isClicked: false
              })
            }
          }
        }        
      },

      async chooseTestName(){
        let response
        try{
          response = await (userService.getTest(this.user))
        }
        catch (err){
          response = err.response
        }
        finally {
          if (response.data.content) {
            this.showModal = true
            for (let i = 0; i < response.data.content.length; i++){
              this.tests.push({
                testName: response.data.content[i].testName,
                createdDate: response.data.content[i].createdDate,
                isClicked: false
              })
            }
          }
        }
      }

    }
  }
</script>

<style>

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
</style>
