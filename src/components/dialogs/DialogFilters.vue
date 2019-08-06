<template>
  <div class="text-xs">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on }">
        <div v-on="on">Filtros</div>
      </template>

      <v-card>
        <v-card-title class="title font-weight-regular justify-space-between">
          <span>Filtros</span>
          <v-avatar color="teal darken-1" class="subheading white--text" size="24" v-text="step"></v-avatar>
        </v-card-title>

        <!-- CONTEÚDO DO DIALOG -->
        <v-window v-model="step">
          <v-window-item :value="1">
            <v-card-text>
              <v-btn block :disabled="!primaryImageSelected" large outline @click="step = 2">Passa Baixa</v-btn>
              <v-btn block :disabled="!primaryImageSelected" large outline @click="step = 6">Passa Alta</v-btn>
              <v-btn block :disabled="!primaryImageSelected" large outline @click="step = 7">Meios Tons</v-btn>
            </v-card-text>
          </v-window-item>

          <v-window-item :value="2">
            <v-card-text>
              <v-btn block :disabled="!primaryImageSelected" large outline @click="step = 3">Média</v-btn>
              <v-btn block :disabled="!primaryImageSelected" large outline @click="step = 4">Mediana</v-btn>
              <v-btn block :disabled="!primaryImageSelected" large outline>Máximo</v-btn>
              <v-btn block :disabled="!primaryImageSelected" large outline>Mínimo</v-btn>
              <v-btn block :disabled="!primaryImageSelected" large outline>Moda</v-btn>
              <v-btn block :disabled="!primaryImageSelected" large outline @click="step = 5">Com Preservação de Bordas</v-btn>
            </v-card-text>
          </v-window-item>

          <v-window-item :value="3">
            <v-card-text>
              <v-btn block :disabled="!primaryImageSelected" large outline>3X3</v-btn>
              <v-btn block :disabled="!primaryImageSelected" large outline>5X5</v-btn>
            </v-card-text>
          </v-window-item>

          <v-window-item :value="4">
            <v-card-text>
              <v-btn block :disabled="!primaryImageSelected" large outline>3X3</v-btn>
              <v-btn block :disabled="!primaryImageSelected" large outline>5X5</v-btn>
            </v-card-text>
          </v-window-item>

          <v-window-item :value="5">
            <v-card-text>
              <v-btn block :disabled="!primaryImageSelected" large outline>Kawahara</v-btn>
              <v-btn block :disabled="!primaryImageSelected" large outline>Tomita e Tsuji</v-btn>
              <v-btn block :disabled="!primaryImageSelected" large outline>Nagao e Matsuyama</v-btn>
              <v-btn block :disabled="!primaryImageSelected" large outline>Somboonkaew</v-btn>
            </v-card-text>
          </v-window-item>

          <v-window-item :value="6">
            <v-card-text>
              <v-btn block :disabled="!primaryImageSelected" large outline>H1</v-btn>
              <v-btn block :disabled="!primaryImageSelected" large outline>H2</v-btn>
              <v-btn block :disabled="!primaryImageSelected" large outline>M1</v-btn>
              <v-btn block :disabled="!primaryImageSelected" large outline>M2</v-btn>
              <v-btn block :disabled="!primaryImageSelected" large outline>M3</v-btn>
              <v-btn block :disabled="!primaryImageSelected" large outline>Alto Reforço</v-btn>
            </v-card-text>
          </v-window-item>

          <v-window-item :value="7">
            <v-card-text>
              <v-btn block :disabled="!primaryImageSelected" large outline @click="step = 8">Pontilhado Ordenado</v-btn>
              <v-btn block :disabled="!primaryImageSelected" large outline @click="step = 9">Pontilhado com Difusão</v-btn>
            </v-card-text>
          </v-window-item>

          <v-window-item :value="8">
            <v-card-text>
              <v-btn block :disabled="!primaryImageSelected" large outline>2X2</v-btn>
              <v-btn block :disabled="!primaryImageSelected" large outline>2X3</v-btn>
              <v-btn block :disabled="!primaryImageSelected" large outline>3X3</v-btn>
            </v-card-text>
          </v-window-item>

          <v-window-item :value="9">
            <v-card-text>
              <v-btn block :disabled="!primaryImageSelected" large outline>Floyd e Steinberg</v-btn>
              <v-btn block :disabled="!primaryImageSelected" large outline>Rogers</v-btn>
              <v-btn block :disabled="!primaryImageSelected" large outline>Jarvis, Judice & Ninke</v-btn>
              <v-btn block :disabled="!primaryImageSelected" large outline>Stucki</v-btn>
              <v-btn block :disabled="!primaryImageSelected" large outline>Stevenson e Arce</v-btn>
            </v-card-text>
          </v-window-item>
        </v-window>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn :disabled="step === 1" flat @click="step = 1">Voltar</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="teal darken-1" flat @click="dialog = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "dialog-filters",

  computed: {
    primaryImageSelected() {
      return JSON.stringify(this.$store.state.primaryImage) !==
        JSON.stringify({})
        ? true
        : false;
    }
  },

  data() {
    return {
      dialog: false,
      step: 1,
    };
  }
};
</script>
