<template>
  <div id="app">
    <recommend />
  </div>
</template>

<script>
import recommend from './components/recommend.vue'

export default {
  name: 'app',
  components: {
    recommend
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
