<template>
  <div class="text-xs">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on }">
        <div v-on="on">Realce</div>
      </template>

      <!-- CONTEÚDO DO DIALOG -->
      <v-card>
        <v-card-title class="title font-weight-regular justify-space-between">
          <span>Realce</span>
          <v-avatar color="teal darken-1" class="subheading white--text" size="24" v-text="step"></v-avatar>
        </v-card-title>

        <v-window v-model="step">
          <v-window-item :value="1">
            <v-card-text>
              <v-btn
                block
                :disabled="!primaryImageSelected"
                large
                outline
                @click="step = 2"
              >Transformação Linear</v-btn>
              <v-btn
                block
                :disabled="!primaryImageSelected"
                large
                outline
                @click="step = 3"
              >Transformação Não-Linear</v-btn>
              <v-btn
                block
                :disabled="!primaryImageSelected"
                large
                outline
                @click="histogramEqualization()"
              >Equalização de Histograma</v-btn>
              <v-btn
                block
                :disabled="!primaryImageSelected"
                large
                outline
                @click="step = 4"
              >Correção Gama</v-btn>
              <v-btn
                block
                :disabled="!primaryImageSelected"
                large
                outline
                @click="bitsSlicing()"
              >Fatiamento de bits</v-btn>
            </v-card-text>
          </v-window-item>

          <v-window-item :value="2">
            <v-card-text>
              <v-range-slider
                style="margin-left: 15px; margin-right: 15px;"
                v-model="interval"
                color="teal darken-1"
                always-dirty
                thumb-label="always"
                step="0.1"
                tick-size="1"
                min="0"
                max="1"
              ></v-range-slider>
              <v-btn
                block
                :disabled="!primaryImageSelected"
                large
                outline
                @click="linearTransformation()"
              >Aplicar Intervalo</v-btn>

              <v-divider style="margin: 20px 20px 20px 20px; background-color: #00897b;"></v-divider>

              <v-btn
                block
                :disabled="!primaryImageSelected"
                large
                outline
                @click="invertColors()"
              >Negativo da Imagem</v-btn>
            </v-card-text>
          </v-window-item>

          <v-window-item :value="3">
            <v-card-text>
              <v-btn
                block
                :disabled="!primaryImageSelected"
                large
                outline
                @click="noLinearTransform('logarithm')"
              >Logaritmo</v-btn>
              <v-btn
                block
                :disabled="!primaryImageSelected"
                large
                outline
                @click="noLinearTransform('root')"
              >Raiz Quadrada</v-btn>
              <v-btn
                block
                :disabled="!primaryImageSelected"
                large
                outline
                @click="noLinearTransform('exponential')"
              >Exponencial</v-btn>
              <v-btn
                block
                :disabled="!primaryImageSelected"
                large
                outline
                @click="noLinearTransform('square')"
              >Quadrado</v-btn>
            </v-card-text>
          </v-window-item>

          <v-window-item :value="4">
            <v-card-text>
              <v-slider
                v-model="correction"
                color="teal darken-1"
                thumb-label="always"
                step="0.1"
                min="0"
                max="2"
              ></v-slider>
              <v-btn
                block
                :disabled="!primaryImageSelected"
                large
                outline
                @click="gamaCorrection()"
              >Aplicar Correção</v-btn>
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
  name: "dialog-enhancement",

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
      interval: [0, 1],
      correction: 1,
    };
  },

  methods: {
    linearTransformation() {
      let primaryImage = this.$store.state.primaryImage.data;
      let matrix = [];
      let imageData = null;

      let intervalMaximum = this.interval[1] * 255;
      let intervalMinimum = this.interval[0] * 255;

      let maximumRed = -Infinity;
      let minimumRed = Infinity;

      let maximumGreen = -Infinity;
      let minimumGreen = Infinity;

      let maximumBlue = -Infinity;
      let minimumBlue = Infinity;

      for (let i = 0; i < primaryImage.height; i++) {
        let red = 0;
        let green = 0;
        let blue = 0;
        for (let j = 0; j < primaryImage.width * 4; j++) {
          red = primaryImage.data[i * primaryImage.width * 4 + j++];
          green = primaryImage.data[i * primaryImage.width * 4 + j++];
          blue = primaryImage.data[i * primaryImage.width * 4 + j++];

          minimumRed = Math.min(red, minimumRed);
          maximumRed = Math.max(red, maximumRed);

          minimumGreen = Math.min(green, minimumGreen);
          maximumGreen = Math.max(green, maximumGreen);

          minimumBlue = Math.min(blue, minimumBlue);
          maximumBlue = Math.max(blue, maximumBlue);
        }
      }

      for (let i = 0; i < primaryImage.height; i++) {
        let line = [];

        let red = 0;
        let green = 0;
        let blue = 0;

        for (let j = 0; j < primaryImage.width * 4; j++) {
          red = primaryImage.data[i * primaryImage.width * 4 + j++];
          green = primaryImage.data[i * primaryImage.width * 4 + j++];
          blue = primaryImage.data[i * primaryImage.width * 4 + j++];

          line.push(
            ((intervalMaximum - intervalMinimum) / (maximumRed - minimumRed)) *
              (red - minimumRed) +
              intervalMinimum
          );
          line.push(
            ((intervalMaximum - intervalMinimum) /
              (maximumGreen - minimumGreen)) *
              (green - minimumGreen) +
              intervalMinimum
          );
          line.push(
            ((intervalMaximum - intervalMinimum) /
              (maximumBlue - minimumBlue)) *
              (blue - minimumBlue) +
              intervalMinimum
          );
          line.push(primaryImage.data[i * primaryImage.width * 4 + j]);
        }

        matrix.push(line);
      }

      let arrayHue = new MatrixToArray(matrix);

      imageData = new ImageData(
        new Uint8ClampedArray(arrayHue),
        primaryImage.width,
        primaryImage.height
      );

      this.addImage("linearTransformation", imageData);

      this.interval = [0, 2];
      this.step = 1;
      this.dialog = false;
    },

    invertColors() {
      let primaryImage = this.$store.state.primaryImage.data;
      let matrix = [];
      let imageData = null;

      for (let i = 0; i < primaryImage.height; i++) {
        let line = [];

        let red = 0;
        let green = 0;
        let blue = 0;

        for (let j = 0; j < primaryImage.width * 4; j++) {
          red = primaryImage.data[i * primaryImage.width * 4 + j++];
          green = primaryImage.data[i * primaryImage.width * 4 + j++];
          blue = primaryImage.data[i * primaryImage.width * 4 + j++];

          line.push(255 - red);
          line.push(255 - green);
          line.push(255 - blue);
          line.push(primaryImage.data[i * primaryImage.width * 4 + j]);
        }

        matrix.push(line);
      }

      let arrayHue = new MatrixToArray(matrix);

      imageData = new ImageData(
        new Uint8ClampedArray(arrayHue),
        primaryImage.width,
        primaryImage.height
      );

      this.addImage("invertColors", imageData);

      this.step = 1;
      this.dialog = false;
    },

    noLinearTransform(operation) {
      let primaryImage = this.$store.state.primaryImage.data;
      let matrix = [];
      let imageData = null;

      let maximumRed = -Infinity;
      let minimumRed = Infinity;

      let maximumGreen = -Infinity;
      let minimumGreen = Infinity;

      let maximumBlue = -Infinity;
      let minimumBlue = Infinity;

      for (let i = 0; i < primaryImage.height; i++) {
        let red = 0;
        let green = 0;
        let blue = 0;
        for (let j = 0; j < primaryImage.width * 4; j++) {
          red = primaryImage.data[i * primaryImage.width * 4 + j++];
          green = primaryImage.data[i * primaryImage.width * 4 + j++];
          blue = primaryImage.data[i * primaryImage.width * 4 + j++];

          minimumRed = Math.min(red, minimumRed);
          maximumRed = Math.max(red, maximumRed);

          minimumGreen = Math.min(green, minimumGreen);
          maximumGreen = Math.max(green, maximumGreen);

          minimumBlue = Math.min(blue, minimumBlue);
          maximumBlue = Math.max(blue, maximumBlue);
        }
      }

      for (let i = 0; i < primaryImage.height; i++) {
        let line = [];

        let red = 0;
        let green = 0;
        let blue = 0;

        for (let j = 0; j < primaryImage.width * 4; j++) {
          red = primaryImage.data[i * primaryImage.width * 4 + j++];
          green = primaryImage.data[i * primaryImage.width * 4 + j++];
          blue = primaryImage.data[i * primaryImage.width * 4 + j++];

          switch (operation) {
            case "logarithm":
              line.push((Math.log(red) * 255) / Math.log(1 + maximumRed));
              line.push((Math.log(green) * 255) / Math.log(1 + maximumGreen));
              line.push((Math.log(blue) * 255) / Math.log(1 + maximumBlue));
              line.push(primaryImage.data[i * primaryImage.width * 4 + j]);
              break;
            case "root":
              line.push((Math.sqrt(red) * 255) / Math.sqrt(1 + maximumRed));
              line.push((Math.sqrt(green) * 255) / Math.sqrt(1 + maximumGreen));
              line.push((Math.sqrt(blue) * 255) / Math.sqrt(1 + maximumBlue));
              line.push(primaryImage.data[i * primaryImage.width * 4 + j]);
              break;
            case "exponential":
              line.push(
                (Math.exp(red + 1) * 255) /
                  (Math.E + 1) ** (maximumRed + minimumRed)
              );
              line.push(
                (Math.exp(green + 1) * 255) /
                  (Math.E + 1) ** (maximumGreen + minimumGreen)
              );
              line.push(
                (Math.exp(blue + 1) * 255) /
                  (Math.E + 1) ** (maximumBlue + minimumBlue)
              );
              line.push(primaryImage.data[i * primaryImage.width * 4 + j]);
              break;
            case "square":
              line.push((Math.pow(red, 2) * 255) / maximumRed ** 2);
              line.push((Math.pow(green, 2) * 255) / maximumGreen ** 2);
              line.push((Math.pow(blue, 2) * 255) / maximumBlue ** 2);
              line.push(primaryImage.data[i * primaryImage.width * 4 + j]);
              break;
            default:
              break;
          }
        }

        matrix.push(line);
      }

      let arrayHue = new MatrixToArray(matrix);

      imageData = new ImageData(
        new Uint8ClampedArray(arrayHue),
        primaryImage.width,
        primaryImage.height
      );

      this.addImage("noLinearTransformation", imageData);

      this.step = 1;
      this.dialog = false;
    },

    histogramEqualization() {},

    gamaCorrection() {
      let primaryImage = this.$store.state.primaryImage.data;
      let matrix = [];
      let imageData = null;

      let correction = this.correction;

      let maximum = -Infinity;

      for (let i = 0; i < primaryImage.height; i++) {
        let red = 0;
        let green = 0;
        let blue = 0;
        for (let j = 0; j < primaryImage.width * 4; j++) {
          red = primaryImage.data[i * primaryImage.width * 4 + j++];
          green = primaryImage.data[i * primaryImage.width * 4 + j++];
          blue = primaryImage.data[i * primaryImage.width * 4 + j++];

          maximum = Math.max(red, green, blue, maximum);
        }
      }

      for (let i = 0; i < primaryImage.height; i++) {
        let line = [];

        let red = 0;
        let green = 0;
        let blue = 0;

        for (let j = 0; j < primaryImage.width * 4; j++) {
          red = primaryImage.data[i * primaryImage.width * 4 + j++];
          green = primaryImage.data[i * primaryImage.width * 4 + j++];
          blue = primaryImage.data[i * primaryImage.width * 4 + j++];

          line.push(
            (Math.pow(red, correction) * 255) / Math.pow(maximum, correction)
          );
          line.push(
            (Math.pow(green, correction) * 255) / Math.pow(maximum, correction)
          );
          line.push(
            (Math.pow(blue, correction) * 255) / Math.pow(maximum, correction)
          );
          line.push(primaryImage.data[i * primaryImage.width * 4 + j]);
        }

        matrix.push(line);
      }

      let array = new MatrixToArray(matrix);

      imageData = new ImageData(
        new Uint8ClampedArray(array),
        primaryImage.width,
        primaryImage.height
      );

      this.addImage("gamaCorrection", imageData);

      this.correction = 1;
      this.step = 1;
      this.dialog = false;
    },

    bitsSlicing() {
      let primaryImage = this.$store.state.primaryImage.data;
      let matrixBitZero = [];
      let matrixBitOne = [];
      let matrixBitTwo = [];
      let matrixBitThree = [];
      let matrixBitFour = [];
      let matrixBitFive = [];
      let matrixBitSix = [];
      let matrixBitSeven = [];
      let imageData = null;

      for (let i = 0; i < primaryImage.height; i++) {
        let lineZero = [];
        let lineOne = [];
        let lineTwo = [];
        let lineThree = [];
        let lineFour = [];
        let lineFive = [];
        let lineSix = [];
        let lineSeven = [];

        let red = 0;
        let green = 0;
        let blue = 0;

        for (let j = 0; j < primaryImage.width * 4; j++) {
          red = primaryImage.data[i * primaryImage.width * 4 + j++];
          green = primaryImage.data[i * primaryImage.width * 4 + j++];
          blue = primaryImage.data[i * primaryImage.width * 4 + j++];

          lineZero.push(red & 1);
          lineZero.push(green & 1);
          lineZero.push(blue & 1);
          lineZero.push(primaryImage.data[i * primaryImage.width * 4 + j]);

          lineOne.push(red & 2);
          lineOne.push(green & 2);
          lineOne.push(blue & 2);
          lineOne.push(primaryImage.data[i * primaryImage.width * 4 + j]);

          lineTwo.push(red & 4);
          lineTwo.push(green & 4);
          lineTwo.push(blue & 4);
          lineTwo.push(primaryImage.data[i * primaryImage.width * 4 + j]);

          lineThree.push(red & 8);
          lineThree.push(green & 8);
          lineThree.push(blue & 8);
          lineThree.push(primaryImage.data[i * primaryImage.width * 4 + j]);

          lineFour.push(red & 16);
          lineFour.push(green & 16);
          lineFour.push(blue & 16);
          lineFour.push(primaryImage.data[i * primaryImage.width * 4 + j]);

          lineFive.push(red & 32);
          lineFive.push(green & 32);
          lineFive.push(blue & 32);
          lineFive.push(primaryImage.data[i * primaryImage.width * 4 + j]);

          lineSix.push(red & 64);
          lineSix.push(green & 64);
          lineSix.push(blue & 64);
          lineSix.push(primaryImage.data[i * primaryImage.width * 4 + j]);

          lineSeven.push(red & 128);
          lineSeven.push(green & 128);
          lineSeven.push(blue & 128);
          lineSeven.push(primaryImage.data[i * primaryImage.width * 4 + j]);
        }

        matrixBitZero.push(lineZero);
        matrixBitOne.push(lineOne);
        matrixBitTwo.push(lineTwo);
        matrixBitThree.push(lineThree);
        matrixBitFour.push(lineFour);
        matrixBitFive.push(lineFive);
        matrixBitSix.push(lineSix);
        matrixBitSeven.push(lineSeven);
      }

      let array = [];

      array = new MatrixToArray(matrixBitSeven);

      imageData = new ImageData(
        new Uint8ClampedArray(array),
        primaryImage.width,
        primaryImage.height
      );

      this.addImage("BitSeven", imageData);

      array = new MatrixToArray(matrixBitSix);

      imageData = new ImageData(
        new Uint8ClampedArray(array),
        primaryImage.width,
        primaryImage.height
      );

      this.addImage("BitSix", imageData);

      array = new MatrixToArray(matrixBitFive);

      imageData = new ImageData(
        new Uint8ClampedArray(array),
        primaryImage.width,
        primaryImage.height
      );

      this.addImage("BitFive", imageData);

      array = new MatrixToArray(matrixBitFour);

      imageData = new ImageData(
        new Uint8ClampedArray(array),
        primaryImage.width,
        primaryImage.height
      );

      this.addImage("BitFour", imageData);

      array = new MatrixToArray(matrixBitThree);

      imageData = new ImageData(
        new Uint8ClampedArray(array),
        primaryImage.width,
        primaryImage.height
      );

      this.addImage("BitThree", imageData);

      array = new MatrixToArray(matrixBitTwo);

      imageData = new ImageData(
        new Uint8ClampedArray(array),
        primaryImage.width,
        primaryImage.height
      );

      this.addImage("BitTwo", imageData);

      array = new MatrixToArray(matrixBitOne);

      imageData = new ImageData(
        new Uint8ClampedArray(array),
        primaryImage.width,
        primaryImage.height
      );

      this.addImage("BitOne", imageData);

      array = new MatrixToArray(matrixBitZero);

      imageData = new ImageData(
        new Uint8ClampedArray(array),
        primaryImage.width,
        primaryImage.height
      );

      this.addImage("BitZero", imageData);

      this.step = 1;
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
