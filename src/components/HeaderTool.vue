<template>
  <div>
    <v-navigation-drawer
      v-model="primaryDrawer.model"
      :permanent="primaryDrawer.type === 'permanent'"
      :temporary="primaryDrawer.type === 'temporary'"
      :clipped="primaryDrawer.clipped"
      :floating="primaryDrawer.floating"
      :mini-variant="primaryDrawer.mini"
      absolute
      overflow
      app
    >
      <v-list dense class="pt-0">
        <!-- OPERAÇÕES ARITIMÉTICAS E LÓGICAS -->
        <v-list-tile @click.stop>
          <v-list-tile-action>
            <v-icon color="teal darken-1">control_point</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title class="teal--text">
              <dialog-operations></dialog-operations>
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <!-- ESPAÇO DE CORES -->
        <v-list-tile @click.stop>
          <v-list-tile-action>
            <v-icon color="teal darken-1">color_lens</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title class="teal--text">
              <dialog-color-space></dialog-color-space>
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <!-- PSEUDOCOLORIZAÇÃO -->
        <v-list-tile @click.stop>
          <v-list-tile-action>
            <v-icon color="teal darken-1">colorize</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title class="teal--text">
              <dialog-pseudo-colorization></dialog-pseudo-colorization>
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <!-- REALCE -->
        <v-list-tile @click.stop>
          <v-list-tile-action>
            <v-icon color="teal darken-1">compare</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title class="teal--text">
              <dialog-enhancement></dialog-enhancement>
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar :clipped-left="primaryDrawer.clipped" app absolute>
      <v-toolbar-side-icon
        v-if="primaryDrawer.type !== 'permanent'"
        @click.stop="primaryDrawer.model = !primaryDrawer.model"
      ></v-toolbar-side-icon>
      <v-toolbar-title>Processamento Digital de Imagens</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat icon>
        <v-icon>save_alt</v-icon>
      </v-btn>
      <dialog-shortcuts></dialog-shortcuts>
      <dialog-configurations></dialog-configurations>
    </v-toolbar>
  </div>
</template>

<script>
import DialogOperations from "./dialogs/DialogOperations";
import DialogColorSpace from "./dialogs/DialogColorSpace"
import DialogPseudoColorization from "./dialogs/DialogPseudoColorization"
import DialogEnhancement from "./dialogs/DialogEnhancement"
import DialogShortcuts from "./dialogs/DialogShortcuts";
import DialogConfigurations from "./dialogs/DialogConfigurations";

export default {
  name: "header-tool",

  components: {
    DialogOperations,
    DialogColorSpace,
    DialogPseudoColorization,
    DialogEnhancement,
    DialogShortcuts,
    DialogConfigurations
  },

  data: () => ({
    primaryDrawer: {
      model: false,
      type: "default (no property)",
      clipped: false,
      floating: false,
      mini: false
    }
  })
};
</script>
