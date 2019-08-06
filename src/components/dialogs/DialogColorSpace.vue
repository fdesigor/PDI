<template>
  <div class="text-xs">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on }">
        <div v-on="on">Espaço de Cores</div>
      </template>

      <v-card>
        <v-card-title class="headline" primary-title>Espaço de Cores</v-card-title>

        <!-- CONTEÚDO DO DIALOG -->
        <v-card-text>
          <v-btn
            block
            :disabled="!primaryImageSelected"
            large
            outline
            @click="colorSpaceComponents('rgb')"
          >RGB</v-btn>
          <v-btn
            block
            :disabled="!primaryImageSelected"
            large
            outline
            @click="colorSpaceComponents('hsb')"
          >HSB</v-btn>
          <v-btn
            block
            :disabled="!primaryImageSelected"
            large
            outline
            @click="colorSpaceComponents('yuv')"
          >YUV</v-btn>
          <v-btn
            block
            :disabled="!primaryImageSelected"
            large
            outline
            @click="colorSpaceComponents('cmy')"
          >CMY</v-btn>
          <v-btn
            block
            :disabled="!primaryImageSelected"
            large
            outline
            @click="colorSpaceComponents('cmyk')"
          >CMYK</v-btn>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
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
  name: "dialog-color-space",

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
      dialog: false
    };
  },

  methods: {
    colorSpaceComponents(colorSpace) {
      let primaryImage = this.$store.state.primaryImage.data;

      switch (colorSpace) {
        case "rgb":
          this.colorSpaceRGB(primaryImage);
          break;

        case "hsb":
          this.colorSpaceHSB(primaryImage);
          break;

        case "yuv":
          this.colorSpaceYUV(primaryImage);
          break;

        case "cmy":
          this.colorSpaceCMY(primaryImage);
          break;

        case "cmyk":
          this.colorSpaceCMYK(primaryImage);
          break;

        default:
          break;
      }

      this.dialog = false;
    },

    colorSpaceRGB(primaryImage) {
      let matrixRed = [];
      let matrixGreen = [];
      let matrixBlue = [];
      let imageData = null;

      for (let i = 0; i < primaryImage.height; i++) {
        let lineRed = [];
        let lineGreen = [];
        let lineBlue = [];

        for (let j = 0; j < primaryImage.width * 4; j++) {
          // Red
          lineRed.push(primaryImage.data[i * primaryImage.width * 4 + j++]);
          lineRed.push(0);
          lineRed.push(0);
          lineRed.push(255);

          // Green
          lineGreen.push(0);
          lineGreen.push(primaryImage.data[i * primaryImage.width * 4 + j++]);
          lineGreen.push(0);
          lineGreen.push(255);

          // Blue
          lineBlue.push(0);
          lineBlue.push(0);
          lineBlue.push(primaryImage.data[i * primaryImage.width * 4 + j++]);
          lineBlue.push(255);
        }

        matrixRed.push(lineRed);
        matrixGreen.push(lineGreen);
        matrixBlue.push(lineBlue);
      }

      let arrayRed = new MatrixToArray(matrixRed);

      imageData = new ImageData(
        new Uint8ClampedArray(arrayRed),
        primaryImage.width,
        primaryImage.height
      );

      this.addImage("Red", imageData);

      let arrayGreen = new MatrixToArray(matrixGreen);

      imageData = new ImageData(
        new Uint8ClampedArray(arrayGreen),
        primaryImage.width,
        primaryImage.height
      );

      this.addImage("Green", imageData);

      let arrayBlue = new MatrixToArray(matrixBlue);

      imageData = new ImageData(
        new Uint8ClampedArray(arrayBlue),
        primaryImage.width,
        primaryImage.height
      );

      this.addImage("Blue", imageData);
    },

    colorSpaceHSB(primaryImage) {
      let matrixHue = [];
      let matrixSaturation = [];
      let matrixBright = [];
      let imageData = null;

      for (let i = 0; i < primaryImage.height; i++) {
        let lineHue = [];
        let lineSaturation = [];
        let lineBright = [];

        let red = 0;
        let green = 0;
        let blue = 0;

        let minimum = 0;
        let maximum = 0;
        let delta = 0;

        let hue = 0;
        let saturation = 0;
        let bright = 0;

        for (let j = 0; j < primaryImage.width * 4; j++) {
          red = primaryImage.data[i * primaryImage.width * 4 + j++] / 255;
          green = primaryImage.data[i * primaryImage.width * 4 + j++] / 255;
          blue = primaryImage.data[i * primaryImage.width * 4 + j++] / 255;

          minimum = Math.min(red, green, blue);
          maximum = Math.max(red, green, blue);
          delta = maximum - minimum;

          // Hue
          if (delta === 0) {
            hue = 0;
          } else if (red === maximum) {
            hue = (green - blue) / delta;
          } else if (green === maximum) {
            hue = 2 + (blue - red) / delta;
          } else if (blue === maximum) {
            hue = 4 + (red - green) / delta;
          }

          hue *= 60;

          if (hue >= 0 && hue <= 60) {
            red = 255;
            green = hue * 4;
            blue = 0;
          } else if (hue > 60 && hue <= 120) {
            red = 255 - (hue - 60) * 4;
            green = 255;
            blue = 0;
          } else if (hue > 120 && hue <= 180) {
            red = 0;
            green = 255;
            blue = (hue - 120) * 4;
          } else if (hue > 180 && hue <= 240) {
            red = 0;
            green = 255 - (hue - 180) * 4;
            blue = 255;
          } else if (hue > 240 && hue <= 300) {
            red = (hue - 240) * 4;
            green = 0;
            blue = 255;
          } else if (hue > 300 && hue <= 360) {
            red = 255;
            green = 0;
            blue = 255 - (hue - 300) * 4;
          }

          lineHue.push(red);
          lineHue.push(green);
          lineHue.push(blue);
          lineHue.push(255);

          // Saturation
          if (maximum === 0) {
            saturation = 0;
          } else {
            saturation = (delta / maximum) * 255;
          }

          lineSaturation.push(saturation);
          lineSaturation.push(saturation);
          lineSaturation.push(saturation);
          lineSaturation.push(255);

          // Bright
          bright = maximum * 255;

          lineBright.push(bright);
          lineBright.push(bright);
          lineBright.push(bright);
          lineBright.push(255);
        }

        matrixHue.push(lineHue);
        matrixSaturation.push(lineSaturation);
        matrixBright.push(lineBright);
      }

      let arrayHue = new MatrixToArray(matrixHue);

      imageData = new ImageData(
        new Uint8ClampedArray(arrayHue),
        primaryImage.width,
        primaryImage.height
      );

      this.addImage("Hue", imageData);

      let arraySaturation = new MatrixToArray(matrixSaturation);

      imageData = new ImageData(
        new Uint8ClampedArray(arraySaturation),
        primaryImage.width,
        primaryImage.height
      );

      this.addImage("Saturation", imageData);

      let arrayBright = new MatrixToArray(matrixBright);

      imageData = new ImageData(
        new Uint8ClampedArray(arrayBright),
        primaryImage.width,
        primaryImage.height
      );

      this.addImage("Bright", imageData);
    },

    colorSpaceYUV(primaryImage) {
      let matrixY = [];
      let matrixU = [];
      let matrixV = [];
      let imageData = null;

      for (let i = 0; i < primaryImage.height; i++) {
        let lineY = [];
        let lineU = [];
        let lineV = [];

        let red = 0;
        let green = 0;
        let blue = 0;

        let y = 0;
        let u = 0;
        let v = 0;

        for (let j = 0; j < primaryImage.width * 4; j++) {
          red = primaryImage.data[i * primaryImage.width * 4 + j++];
          green = primaryImage.data[i * primaryImage.width * 4 + j++];
          blue = primaryImage.data[i * primaryImage.width * 4 + j++];

          // Y
          y = 0.299 * red + 0.587 * green + 0.114 * blue;

          lineY.push(y);
          lineY.push(y);
          lineY.push(y);
          lineY.push(255);

          // U
          u = -0.14713 * red + -0.28886 * green + 0.436 * blue;

          lineU.push(u);
          lineU.push(u + 15);
          lineU.push(u + 15);
          lineU.push(255);

          // V
          v = 0.615 * red + -0.55861 * green + -0.05639 * blue;

          lineV.push(v + 15);
          lineV.push(v);
          lineV.push(v + 15);
          lineV.push(255);
        }

        matrixY.push(lineY);
        matrixU.push(lineU);
        matrixV.push(lineV);
      }

      let arrayY = new MatrixToArray(matrixY);

      imageData = new ImageData(
        new Uint8ClampedArray(arrayY),
        primaryImage.width,
        primaryImage.height
      );

      this.addImage("Y", imageData);

      let arrayU = new MatrixToArray(matrixU);

      imageData = new ImageData(
        new Uint8ClampedArray(arrayU),
        primaryImage.width,
        primaryImage.height
      );

      this.addImage("U", imageData);

      let arrayV = new MatrixToArray(matrixV);

      imageData = new ImageData(
        new Uint8ClampedArray(arrayV),
        primaryImage.width,
        primaryImage.height
      );

      this.addImage("V", imageData);
    },

    colorSpaceCMY(primaryImage) {
      let matrixCyan = [];
      let matrixMagenta = [];
      let matrixYellow = [];
      let imageData = null;

      for (let i = 0; i < primaryImage.height; i++) {
        let lineCyan = [];
        let lineMagenta = [];
        let lineYellow = [];

        let key = 0;

        let red = 0;
        let green = 0;
        let blue = 0;

        for (let j = 0; j < primaryImage.width * 4; j++) {
          red = primaryImage.data[i * primaryImage.width * 4 + j++] / 255;
          green = primaryImage.data[i * primaryImage.width * 4 + j++] / 255;
          blue = primaryImage.data[i * primaryImage.width * 4 + j++] / 255;

          key = Math.min(red, green, blue);

          // Cyan CMYK
          lineCyan.push(0);
          lineCyan.push(255 - Math.round(((1 - red - key) / (1 - key)) * 255));
          lineCyan.push(255 - Math.round(((1 - red - key) / (1 - key)) * 255));
          lineCyan.push(255);

          // Magenta CMYK
          lineMagenta.push(
            255 - Math.round(((1 - green - key) / (1 - key)) * 255)
          );
          lineMagenta.push(0);
          lineMagenta.push(
            255 - Math.round(((1 - green - key) / (1 - key)) * 255)
          );
          lineMagenta.push(255);

          // Yellow CMYK
          lineYellow.push(
            255 - Math.round(((1 - blue - key) / (1 - key)) * 255)
          );
          lineYellow.push(
            255 - Math.round(((1 - blue - key) / (1 - key)) * 255)
          );
          lineYellow.push(0);
          lineYellow.push(255);
        }

        matrixCyan.push(lineCyan);
        matrixMagenta.push(lineMagenta);
        matrixYellow.push(lineYellow);
      }

      let arrayCyan = new MatrixToArray(matrixCyan);

      imageData = new ImageData(
        new Uint8ClampedArray(arrayCyan),
        primaryImage.width,
        primaryImage.height
      );

      this.addImage("Cyan", imageData);

      let arrayMagenta = new MatrixToArray(matrixMagenta);

      imageData = new ImageData(
        new Uint8ClampedArray(arrayMagenta),
        primaryImage.width,
        primaryImage.height
      );

      this.addImage("Magenta", imageData);

      let arrayYellow = new MatrixToArray(matrixYellow);

      imageData = new ImageData(
        new Uint8ClampedArray(arrayYellow),
        primaryImage.width,
        primaryImage.height
      );

      this.addImage("Yellow", imageData);
    },

    colorSpaceCMYK(primaryImage) {
      let matrixCyan = [];
      let matrixMagenta = [];
      let matrixYellow = [];
      let matrixBlack = [];
      let imageData = null;

      for (let i = 0; i < primaryImage.height; i++) {
        let lineCyan = [];
        let lineMagenta = [];
        let lineYellow = [];
        let lineBlack = [];

        let key = 0;

        let red = 0;
        let green = 0;
        let blue = 0;

        for (let j = 0; j < primaryImage.width * 4; j++) {
          red = primaryImage.data[i * primaryImage.width * 4 + j++] / 255;
          green = primaryImage.data[i * primaryImage.width * 4 + j++] / 255;
          blue = primaryImage.data[i * primaryImage.width * 4 + j++] / 255;

          key = Math.min(red, green, blue);

          // lineCyan.push(0);
          // lineCyan.push(255 - Math.round(((1 - red - key) / (1 - key)) * 255));
          // lineCyan.push(255 - Math.round(((1 - red - key) / (1 - key)) * 255));
          // lineCyan.push(255);

          // Cyan CMYK
          lineCyan.push(((1 - red - key) / (1 - key)) * 255);
          lineCyan.push(255);
          lineCyan.push(255);
          lineCyan.push(255);

          // Magenta CMYK
          lineMagenta.push(255);
          lineMagenta.push(((1 - green - key) / (1 - key)) * 255);
          lineMagenta.push(255);
          lineMagenta.push(255);

          // Yellow CMYK
          lineYellow.push(255);
          lineYellow.push(255);
          lineYellow.push(((1 - blue - key) / (1 - key)) * 255);
          lineYellow.push(255);

          // Black CMYK
          key = 1 - Math.max(red, green, blue);
          lineBlack.push(key * 255);
          lineBlack.push(key * 255);
          lineBlack.push(key * 255);
          lineBlack.push(255);
        }

        matrixCyan.push(lineCyan);
        matrixMagenta.push(lineMagenta);
        matrixYellow.push(lineYellow);
        matrixBlack.push(lineBlack);
      }

      let arrayCyan = new MatrixToArray(matrixCyan);

      imageData = new ImageData(
        new Uint8ClampedArray(arrayCyan),
        primaryImage.width,
        primaryImage.height
      );

      this.addImage("Cyan", imageData);

      let arrayMagenta = new MatrixToArray(matrixMagenta);

      imageData = new ImageData(
        new Uint8ClampedArray(arrayMagenta),
        primaryImage.width,
        primaryImage.height
      );

      this.addImage("Magenta", imageData);

      let arrayYellow = new MatrixToArray(matrixYellow);

      imageData = new ImageData(
        new Uint8ClampedArray(arrayYellow),
        primaryImage.width,
        primaryImage.height
      );

      this.addImage("Yellow", imageData);

      let arrayBlack = new MatrixToArray(matrixBlack);

      imageData = new ImageData(
        new Uint8ClampedArray(arrayBlack),
        primaryImage.width,
        primaryImage.height
      );

      this.addImage("Black", imageData);
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
