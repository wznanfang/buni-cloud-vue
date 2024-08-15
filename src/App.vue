<template>
  <router-view></router-view>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import Login from '@/components/Login.vue';

export default defineComponent({
  components: {
    Login
  },
});
</script>

<style>
body{
  margin: 0;
}

</style>