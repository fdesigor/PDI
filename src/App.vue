<template>
  <div id="app">
    <v-app id="sandbox" :dark="nightMode">
      <header-tool></header-tool>
      <content-tool></content-tool>
      <footer-tool></footer-tool>
    </v-app>
  </div>
</template>

<script>
import HeaderTool from "./components/HeaderTool.vue";
import ContentTool from "./components/ContentTool.vue";
import FooterTool from "./components/FooterTool.vue";

export default {
  name: "app",
  components: {
    HeaderTool,
    ContentTool,
    FooterTool
  },

  data: () => ({
    nightMode: true,
    drawers: ["Default (no property)", "Permanent", "Temporary"],
  }),
};
</script>
