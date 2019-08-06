<template>
  <v-content>
    <v-container fluid>
      <v-layout align-center justify-center>
        <!-- PANEL -->
        <v-flex xs10>
          <panel-card></panel-card>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container fluid>
      <v-layout align-center justify-center>
        <!-- CANVAS AND TRANSFORMATIONS -->
        <v-flex xs10>
          <canvas-card></canvas-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import PanelCard from "./cards/PanelCard";
import CanvasCard from "./cards/CanvasCard";

export default {
  name: "content-tool",
  components: {
    PanelCard,
    CanvasCard
  }
};
</script>