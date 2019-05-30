<template>
  <div class="container-fluid align-middle">
      <div class = "row">
        <div class = "col col-sm-6 text-center">
          <input  id="userName" v-model="user"  placeholder="User Name" v-bind:class="{ 'border border-danger' :userError}" v-on:keydown="deleteBorder()">
        </div>
        <div class = "col col-sm-6 text-left">
         <button class = "btn" v-on:click="getUser()">Login</button>
        </div>
      </div>
  </div>
</template>

<script>
  import userService from '../../services/userService'
  export default {
    name: 'Login',
    data () {
      return {
        user: null,
        userError: false,
        userExist: false
      }
    },
    methods: {
      async getUser () {
        let response
        try{
          response = await (userService.getUser(this.user))
        }
        catch (err){
          response = err.response
        }
        finally {
          if (response.data.content) {
              this.userExist = true
              this.$emit('logged', this.user)
            }
          else {
            this.user = null
            this.userError = true
            }
        }
      },

      deleteBorder(){
        this.userError = false
      }
    }
  }
</script>

<style>

</style>
