<template>
  <div id = "quicktest">
    <div class="container-fluid">
      <div class="row text text-center">
        <div class="col col-md-4"></div>
        <div class="col col-md-4"><input v-model="testName" type="text" placeholder="Test name" v-bind:class="{'border border-danger' : testAlreadyExists}" v-on:keydown="deleteBorder()"></div>
        <div class="col col-md-4"><span v-if="testAlreadyExists" class="text font-weight-bold text-danger">This test already exists</span></div>
      </div>
      <div class="row text text-center">
        <div class="col col-md-6">
          <div class="row text text-center">
            <div class="col"><input v-model="testSettings.numbersOfQuestions" type="text" placeholder="Number of questions" ></div>
          </div> 
          <div class="row text text-center">
            <div class="col"><input v-model="testSettings.numbersOfAnswers" type="text" placeholder="Number of answers" ></div>
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
        <div class="col col-md-6">
          <div class="row text text-left" v-for="moduleName in modules">
            <div class="col col-md-6 border">{{moduleName}}</div>
            <div class="col col-md-1"><button class="btn btn-dark" v-on:click="removeModuleName(moduleName)" v-bind:disabled="moduleName === 'General'"></button></div>
          </div> 
          <div class="row text text-left">
            <div class="col col-md-6"><input type="text" placeholder="Module name" v-model="addedModuleName"></div>
            <div class="col col-md-1"><button class="btn btn-success" v-on:click="addModuleName()"></button></div>
          </div> 
        </div>
      </div>
      <div class="row text text-center">
        <div class="col">
          <button class="btn margin-btn btn-success" v-on:click="saveTest()" v-bind:disabled="!testName">Save Test</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import userService from '../../services/userService'
  export default {
    name: 'SaveTest',
    props: ["user"],
    data () {
      return {
        testName: null,
        modules: ['General'],
        addedModuleName: null,
        testAlreadyExists: false,
        testSettings: {                
          numbersOfQuestions: null,
          correctAnswersPoints: null,
          wrongAnswersPoints: null,
          noAnswersPoints: null,
          numbersOfAnswers: null,
          timeForTest: null
        },
      }
    },

    methods: {

      addModuleName(){
        let checkIfAlreadySaved = false
        for(let i = 0; i < this.modules.length; i++){
          if (this.modules[i] === this.addedModuleName) checkIfAlreadySaved = true
        }

        if (!checkIfAlreadySaved) this.modules.push(this.addedModuleName)
        this.addedModuleName = null
      },

      removeModuleName(moduleName){
        for(let i = 0; i < this.modules.length; i++){
          if (this.modules[i] === moduleName) this.modules.splice(i, 1)
        }        
      },

      async saveTest(){
        let response
        try{
          response = await (userService.getTest(this.user, this.testName))
        }
        catch (err){
          response = err.response
          console.log(err.response)
        }
        finally {
          if (response.data.content) this.testAlreadyExists = true
          else{
            let saveTestResponse
            try{
              saveTestResponse = await (userService.postTest(this.user, this.testName, this.testSettings, this.modules))
            }
            catch (err){
              saveTestResponse = err.response
            }
            finally{
              if (saveTestResponse.status === 201) this.$emit('refresh')
            }
          }
        }
      },

      deleteBorder(){
        this.testAlreadyExists = false
      }

    }
  }
</script>

<style>
  .margin-btn{
    margin: 10px
  }
</style>
