<template>
  <div class="flex flex-col items-center">
    <BaseTerminal />
  </div>
</template>

<script>
import BaseTerminal from "./components/BaseTerminal.vue";

export default {
    name: "App",
    components: {
        BaseTerminal
    }
};
</script>

<style>
#app {
    font-family: FiraMono NF, Consolas, Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
