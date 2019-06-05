<template>
  <div id="mocktest">
    <div id = "body-mocktest" class = "container" v-if="inputCreated">
      <div class="row">
        <div class="col">
          <Test v-bind:allQuestions="allQuestions" v-bind:testSettings = "testSettings"  ref="Test" @updateResults="updateResults"/> 
        </div>
      </div>
      <div class="row">
        <div class="col">
          <Results v-if="showResults" v-bind:testSettings = "testSettings" v-bind:questions = "questions" ref="Results"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Test from './Test'
import Results from './Results'
export default {
  name: 'ShowTest',
  props: ["user","allQuestions", "testName", "modules", "testSettings"],
  components: {
    Test,
    Results
  },
  data () {
    return {
      inputCreated: false,
      showResults: false,
      questions: null
    }
  },

  mounted(){
    if (!this.allQuestions) {
      this.$emit('refreshAll')
    }
    else{
      this.inputCreated = true
      if (this.$refs.Test) this.$refs.Test.refresh()
    }
  },

  methods: {
    updateResults(value){
      if (value.gotResults){
        this.showResults = true
        this.questions = value.questions
      }
      else{
        this.showResults = false
        this.questions = null
      }
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
  color: #42b983;
}
</style>
