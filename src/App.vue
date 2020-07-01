<template>
  <div id="app">
    <Main></Main>
  </div>
</template>

<script>
import Main from './components/Main'
export default {
  components: {Main},
  name: 'App'
}
</script>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height:100vh
}
</style>
