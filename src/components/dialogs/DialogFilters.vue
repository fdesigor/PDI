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
              <v-btn
                block
                :disabled="!primaryImageSelected"
                large
                outline
                @click="step = 2"
              >Passa Baixa</v-btn>
              <v-btn
                block
                :disabled="!primaryImageSelected"
                large
                outline
                @click="step = 6"
              >Passa Alta</v-btn>
              <v-btn
                block
                :disabled="!primaryImageSelected"
                large
                outline
                @click="step = 7"
              >Meios Tons</v-btn>
            </v-card-text>
          </v-window-item>

          <v-window-item :value="2">
            <v-card-text>
              <v-btn block :disabled="!primaryImageSelected" large outline @click="step = 3">Média</v-btn>
              <v-btn block :disabled="!primaryImageSelected" large outline @click="step = 4">Mediana</v-btn>
              <v-btn block :disabled="!primaryImageSelected" large outline>Máximo</v-btn>
              <v-btn block :disabled="!primaryImageSelected" large outline>Mínimo</v-btn>
              <v-btn block :disabled="!primaryImageSelected" large outline>Moda</v-btn>
              <v-btn
                block
                :disabled="!primaryImageSelected"
                large
                outline
                @click="step = 5"
              >Com Preservação de Bordas</v-btn>
            </v-card-text>
          </v-window-item>

          <v-window-item :value="3">
            <v-card-text>
              <v-btn
                block
                :disabled="!primaryImageSelected"
                large
                outline
                @click="lowPass(3, 'average')"
              >3X3</v-btn>
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
              <v-btn
                block
                :disabled="!primaryImageSelected"
                large
                outline
                @click="step = 8"
              >Pontilhado Ordenado</v-btn>
              <v-btn
                block
                :disabled="!primaryImageSelected"
                large
                outline
                @click="step = 9"
              >Pontilhado com Difusão</v-btn>
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
import MatrixToArray from "../../utils/MatrixToArray";

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
      step: 1
    };
  },

  methods: {
    lowPass(mask, operation) {
      let primaryImage = this.$store.state.primaryImage.data;
      let matrix = [];
      let imageData = null;

      let convolutionMatrix = [];

      for (let i = 0; i < primaryImage.height; i++) {
        let row = [];
        for (let j = 0; j < primaryImage.width; j++) {
          row.push(primaryImage.data[i * primaryImage.width * 4 + j++]);
        }
        convolutionMatrix.push(row);
      }

      for (let i = 0; i < primaryImage.height; i++) {
        let line = [];
        for (let j = 0; j < primaryImage.width; j++) {
          let convolutionArray = [];

          for (
            let convolutionIndexI = -1;
            convolutionIndexI <= 1;
            convolutionIndexI++
          ) {
            let convolutionLine = convolutionMatrix[i + convolutionIndexI];
            let convolutionPixel = 0;

            for (
              let convolutionIndexJ = -1;
              convolutionIndexJ <= 1;
              convolutionIndexJ++
            ) {
              convolutionPixel = convolutionLine[j + convolutionIndexJ];

              if (convolutionPixel) {
                convolutionArray.push(convolutionPixel);
              }
            }
          }

          let red = 0;
          let green = 0;
          let blue = 0;
          let alpha = 0;

          let redArray = [];
          let greenArray = [];
          let blueArray = [];
          let alphaArray = [];

          for (let index = 0; index < convolutionArray.length; index++) {
            redArray.push(convolutionArray[index++]);
            greenArray.push(convolutionArray[index++]);
            blueArray.push(convolutionArray[index++]);
            alphaArray.push(convolutionArray[index]);
          }

          switch (operation) {
            case "average":
              for (let k = 0; k < redArray.length; k++) {
                red += redArray[k];
              }

              for (let k = 0; k < greenArray.length; k++) {
                green += greenArray[k];
              }

              for (let k = 0; k < blueArray.length; k++) {
                blue += blueArray[k];
              }

              for (let k = 0; k < alphaArray.length; k++) {
                alpha += alphaArray[k];
              }

              red = red / redArray.length;
              green = green / greenArray.length;
              blue = blue / blueArray.length;
              // alpha = alpha / alphaArray.length;
              alpha = 255;

              break;

            case "median":
              break;

            case "maximum":
              break;

            case "minimum":
              break;

            case "moda":
              break;

            default:
              break;
          }

          line.push(red);
          line.push(green);
          line.push(blue);
          line.push(alpha);
        }

        matrix.push(line);
      }

      console.log(matrix);

      let arrayFinal = new MatrixToArray(matrix);

      imageData = new ImageData(
        new Uint8ClampedArray(arrayFinal),
        primaryImage.width,
        primaryImage.height
      );

      this.addImage(operation, imageData);

      this.dialog = false;
    },

    addImage(imageName, imageData) {
      let canvas = document.createElement("canvas");
      let context = canvas.getContext("2d");

      canvas.width = imageData.width;
      canvas.height = imageData.height;
      context.putImageData(imageData, 0, 0);

      this.$store.commit("PUSH_IMAGE_IN_PANEL", {
        id: String(this.$store.state.listPanelImages.length),
        name: `${imageName}.png`,
        url: canvas.toDataURL(),
        data: imageData,
        border: String("image-noborder")
      });
    }
  }
};
</script>
