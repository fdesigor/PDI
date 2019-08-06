<template>
  <v-footer :inset="footer.inset" app>
    <v-spacer></v-spacer>
    <span class="teal--text px-3">
      <strong>Igor Fernandes dos Santos</strong>
      &copy; {{ new Date().getFullYear() }}
    </span>
  </v-footer>
</template>

<script>
export default {
  name: "footer-tool",

  data: () => ({
    footer: {
      inset: false
    }
  })
};
</script>