<script>
import { computed } from 'vue'

export default {
  setup () {
    const year = computed(() => new Date().getFullYear())
    return { year }
  }
}
</script>

<template>
    <footer>
      <p>Copyright &copy; {{ year }} </p>
    </footer>
</template>

<style>
</style>
