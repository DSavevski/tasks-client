<template>
    <div>
      {{posts}}
    </div>

</template>

<script>
  import axios from 'axios';
  export default {
    data() {
      return {
        posts: [],
        errors: []
      }
    },

    // Fetches posts when the component is created.
    created() {
      axios.get(`/api/tasks`)
        .then(response => {
          // JSON responses are automatically parsed.
          this.posts = response.data
        })
        .catch(e => {
          this.errors.push(e)
        })

      // async / await version (created() becomes async created())
      //
      // try {
      //   const response = await axios.get(`http://jsonplaceholder.typicode.com/posts`)
      //   this.posts = response.data
      // } catch (e) {
      //   this.errors.push(e)
      // }
    }
  }
</script>

<style scoped>

</style>
