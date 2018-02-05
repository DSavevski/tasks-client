<template>
  <v-parallax  src="/static/material.jpg" height="100%" jumbotron>
    <v-layout fluid column align-center justify-center>
      <h1 class="white--text">Tasks</h1>
      <h4 class="white--text">Task manager integrated with Google!</h4>
      <g-signin-button v-if="!auth.user.authenticated"
        :params="googleSignInParams"
        @success="onSignInSuccess"
        @error="onSignInError">
        Sign in with Google
      </g-signin-button>
    </v-layout>
  </v-parallax>
</template>

<script>
  import auth from '@/auth.js'

  export default {
    data() {
      return {
        googleSignInParams: {
          client_id: '231896855949-9bputvooi1ghj8ta06u0u894pib58pq7.apps.googleusercontent.com'
        },
        auth: auth
      }

    },

    methods: {
      onSignInSuccess(googleUser) {
        auth.signin(googleUser);
      },

      onSignInError(error) {
        console.log('Google sign in error: ', error)
      },

      signOut(){
        auth.signOut();
      }

    },

    mounted: function () {
      this.$nextTick(function () {
        auth.check()
      })
    }

  }
</script>

<style scoped>
  .g-signin-button {
    /* This is where you control how the button looks. Be creative! */
    margin-top: 5px;
    display: inline-block;
    padding: 4px 8px;
    border-radius: 3px;
    background-color: #3c82f7;
    color: #fff;
    font-weight: bold;
    box-shadow: 0 3px 0 #0f69ff;
    cursor: pointer;
  }
</style>
