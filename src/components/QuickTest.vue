<template>
  <div id = "quicktest">
    <div class="container-fluid align-middle">
        <div class="row text text-center">
          <div class="col"><input v-model="testSettings.numbersOfQuestions" type="text" placeholder="Number of questions" ></div>
        </div> 
        <div class="row text text-center">
          <div class="col"><input v-model="testSettings.correctAnswersPoints" type="text" placeholder="Points correct answer" ></div>
        </div>
        <div class="row text text-center">
          <div class="col"><input v-model="testSettings.wrongAnswersPoints" type="text" placeholder="Points wrong answer" ></div>
        </div>
        <div class="row text text-center">
          <div class="col"><input v-model="testSettings.noAnswersPoints" type="text" placeholder="Points no answer" ></div>
        </div>
        <div class="row text text-center">
          <div class="col"><input v-model="testSettings.timeForTest" type="text" placeholder="Minutes for test" ></div>
        </div>
    </div>
    <div class = "row">
      <div class = "col text-center">
        <button class="btn margin-btn" v-on:click="chooseTestName" v-bind:class="{'btn-success' : isLoadButtonClicked}"> Load questions </button>
      </div>
    </div>
    <div class = "row">
      <div class = "col text-center">
        <DragAndDrop @parsedJson="parsedJSONFunction" @changedFile="clear" ref="dragAndDropComp"/>
      </div>
    </div>

    <div class = "row"  v-if="showCreateTestButton && testSettings.numbersOfQuestions > 0">
      <div class = "col text-center">
        <button class="btn btn-primary margin-btn" v-on:click="createTest"> Create Test </button>
      </div>
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
                          <button class="btn" v-on:click="loadQuestions()" v-bind:disabled="!modules.length > 0">Load Questions</button>
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
  import userService from '../../services/userService'
  import DragAndDrop from './DragAndDrop'
  export default {
    name: 'QuickTest',
    props: ["user"],
    components: {
      DragAndDrop
    },
    data () {
      return {
        showModal: false,
        tests: [],
        modules: [],
        testSettings: {                
          numbersOfQuestions: null,
          correctAnswersPoints: null,
          wrongAnswersPoints: null,
          noAnswersPoints: null,
        },
        chosenTestName: null,
        chosenModulesName: [],
        isLoadButtonClicked: false,
        allQuestions: [],
        showCreateTestButton: false
      }
    },

    methods: {

      clearTestName(){
        this.showModal = false
        this.tests = []
        this.modules = []
        this.isLoadButtonClicked= false
        this.showCreateTestButton= false
      },

      createTest(){
        let value = {

          test: this.chosenTestName,
          modules: this.chosenModulesName,
          allQuestions: this.allQuestions,
          testSettings: this.testSettings,
          saveResults: false

        }

        this.$emit('gotQuestions', value)
      },

      parsedJSONFunction(value){
        for (let i = 0; i < value.length; i++) this.allQuestions.push(value[i])
        this.showCreateTestButton= true
        this.isLoadButtonClicked= false
      },

      clear(){
        this.isLoadButtonClicked= false
        this.showCreateTestButton= false
        this.allQuestions= []
      },

      async chooseTestName(){
           
        this.allQuestions= []
        if (this.isLoadButtonClicked){
          this.isLoadButtonClicked= false
          this.showCreateTestButton= false
        }
        else{
          let response
          try{
            response = await (userService.getTest(this.user))
          }
          catch (err){
            response = err.response
          }
          finally {
            if (response.data.content) {
              this.showCreateTestButton= false
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

      async loadQuestions(){
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
              this.showModal = false
            }
          }
        

      },

      chooseTest(testName){
        this.tests.find(c => c.testName === testName).isClicked = true
        this.modules = []
        if(this.chosenTestName) this.tests.find(c => c.testName === this.chosenTestName).isClicked = false
        if(this.chosenTestName != testName) {
            this.chosenTestName = testName
            this.chooseModuleName()
        }
        else {
          this.chosenTestName = null
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

      },


    }
  }
</script>

<style>
  .margin-btn{
    margin: 10px
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

</style>
