<template>
  <div id="app">
    <header>
      <!-- Fixed navbar -->
      <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
        <div class="navbar-brand"><u>Mock Test Creator</u></div>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse " id="navbarCollapse">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item">
              <a class="nav-link" href="#" v-bind:class= "{disabled : !user}" @click="componentsFunction('quickTest')">Quick Test</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" v-bind:class= "{disabled : !user}" @click="componentsFunction('loadTest')">Load Test</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" v-bind:class= "{disabled : !user}" @click="componentsFunction('saveTest')">Save Test</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" v-bind:class= "{disabled : !user}" @click="componentsFunction('createQuestions')">Create Questions</a>
            </li>
          </ul>
        </div>
        <div class="navbar-text text font-weight-bold" v-if="user">
          {{user}} - {{availableTests}}
        </div>
        <!-- <div class="navbar-text text font-weight-bold m-10" v-if="user">
          {{availableTests}}
        </div> -->
      </nav>
    </header>
    <main role="main" class="container-fluid main">
      <div class= "row">

        <div class= "col">
          <Login @logged="gotUser" v-if="!user"/>
          <statistics v-if="user && components.statistics" v-bind:user="user"/>
          <createQuestions  v-if="user && components.createQuestions" v-bind:user="user" @createQuestions= "showTable" ref="createQuestions" @refresh="clear"/>
          <showTable  v-if="user && components.showTable" v-bind:testSettings="testSettings" v-bind:user="user" v-bind:allRows="allRows" v-bind:testName="testName" v-bind:modules="modules" @refresh="clear"/>
          <loadTest  v-if="user && components.loadTest" v-bind:user="user" @gotQuestions="showTest"/>
          <showTest  v-if="user && components.showTest" v-bind:user="user" v-bind:allQuestions="allQuestions" v-bind:testName="testName" v-bind:modules="modules" v-bind:saveResults="saveResults" v-bind:testSettings="testSettings" @updateAvailableTests="updateAvailableTests"/>
          <quickTest v-if="user && components.quickTest"  v-bind:user="user" @gotQuestions="showTest"/>
          <saveTest  v-if="user && components.saveTest" v-bind:user="user" @refresh="clear"/>
        </div>
          <!-- <circular-count-down-timer
            :initial-value="timeInSeconds"
            :stroke-width="5"
            :seconds-stroke-color="'#f00'"
            :minutes-stroke-color="'#0ff'"
            :hours-stroke-color="'#0f0'"
            :underneath-stroke-color="'lightgrey'"
            :seconds-fill-color="'#00ffff66'"
            :minutes-fill-color="'#00ff0066'"
            :hours-fill-color="'#ff000066'"
            :size="100"
            :padding="4"
            :second-label="timeLabel"
            :show-second="true"
            :show-minute="showMinutes"
            :show-hour="false"
            :show-negatives="true"
            :paused="some_variable"
            :notify-every="'minute'"
            @update="updated">
          </circular-count-down-timer> -->
      </div>
    </main>
    <footer class="fixed-bottom">
      <div class="container-fluid footer">
        <span class="text-muted text-center">Powered by MarcoBz</span>
      </div>
    </footer>
  </div>
</template>

<script>
import userService from '../services/userService'
import Login from './components/Login'
import CreateQuestions from './components/CreateQuestions'
import ShowTable from './components/ShowTable'
import ShowTest from './components/ShowTest'
import LoadTest from './components/LoadTest'
import QuickTest from './components/QuickTest'
import SaveTest from './components/SaveTest'
import Statistics from './components/Statistics'
export default {
  name: "App",
  components: {
    Login,
    CreateQuestions,
    ShowTable,
    LoadTest,
    ShowTest,
    QuickTest,
    SaveTest,
    Statistics
  },

  data () {
    return {
      time: 2,
      timeInSeconds: 0,
      timeLabel: "minutes",
      availableTests: null,
      user: null,
      allRows: null,
      allQuestions: [],
      components: {
        createQuestions: false,
        login: false,
        showTable: false,
        loadTest: false,
        showTest: false,
        statistics: true
      },
      testName: null,
      modules: [],
      testSettings: null,
      
      saveResults: false
    }
  },

  methods: {
    updated: (status) => {
        console.log(status);    //{"value": 144, "seconds": 24, "minutes": 2, "hours": 0}
        if (status.value < 60) {
          this.timeLabel= "seconds"
        }
    },
    updateAvailableTests(value){
      this.availableTests = value
    },

    clear(){
      if(this.$refs.createQuestions) this.$refs.createQuestions.clearAll()
      this.modules= []
      this.testName= null
      this.allRows= null
      this.allQuestions= []
      this.testSettings= null
      this.saveResults= false
      this.components= {
        createQuestions: false,
        login: false,
        showTable: false,
        loadTest: false,
        showTest: false,
        quickTest: false,
        saveTest: false,
        statistics: true
      }
    },

    clearTestInfo(){
      this.testName = null
      this.modules = []
      this.allRows = null
      this.testSettings= null
      this.saveResults= false
    },

    gotUser(value){
      this.user = value.user
      this.availableTests = value.availableTests
    },

    componentsFunction(component){
      this.clearTestInfo()
      this.components = {
        createQuestions: false,
        login: false,
        showTable: false,
        loadTest: false,
        showTest: false,
        quickTest: false,
        saveTest: false,
        statistics: false
      } 
      this.components[component] = true
    },

    showTable(value){
      this.clearTestInfo()
      this.testName = value.test
      this.modules = value.modules
      this.allRows = value.rows
      this.components = {
        createQuestions: false,
        login: false,
        showTable: true,
        loadTest: false,
        showTest: false,
        quickTest: false,
        saveTest: false,
        statistics: false
      }
    },

    async showTest(value){

      let response
      let op = "replace"
      let path = "/availableTests"
      let valuePatch = -1
      try{
        response = await userService.patchUser(this.user, op, path, valuePatch)
      }
      catch (err){
        response = err.response
      }
      finally {
        if (response.status === 200) {
          this.availableTests = response.data.content.availableTests
          this.clearTestInfo()
          this.testName = value.test
          this.modules = value.modules
          this.allQuestions = value.allQuestions
          this.testSettings = value.testSettings
          this.saveResults = value.saveResults
          this.components = {
            createQuestions: false,
            login: false,
            showTable: false,
            loadTest: false,
            showTest: true,
            quickTest: false,
            saveTest: false,
            statistics: false
          }
        }
      }      


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

.footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 60px;
    line-height: 60px;
    background-color: #f5f5f5;
}

.main{
  margin-bottom: 60px;
}

</style>
