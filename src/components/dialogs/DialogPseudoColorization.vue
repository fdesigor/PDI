<template>
  <div class="text-xs">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on }">
        <div v-on="on">Pseudocolorização</div>
      </template>

      <v-card>
        <v-card-title class="headline" primary-title>Pseudocolorização</v-card-title>

        <!-- CONTEÚDO DO DIALOG -->
        <v-card-text>
          <v-btn
            block
            :disabled="!primaryImageSelected"
            large
            outline
            @click="densitySlicing()"
          >Fatiamento por Densidade</v-btn>
          <v-btn
            block
            :disabled="!primaryImageSelected"
            large
            outline
            @click="colorRedistribution()"
          >Redistribuição de Cores</v-btn>
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
  name: "dialog-pseudo-colorization",

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
    densitySlicing() {
      let primaryImage = this.$store.state.primaryImage.data;
      let matrixColorization = [];
      let imageData = null;

      for (let i = 0; i < primaryImage.height; i++) {
        let lineColorization = [];

        let red = 0;
        let green = 0;
        let blue = 0;

        for (let j = 0; j < primaryImage.width * 4; j++) {
          red = primaryImage.data[i * primaryImage.width * 4 + j++];
          green = primaryImage.data[i * primaryImage.width * 4 + j++];
          blue = primaryImage.data[i * primaryImage.width * 4 + j++];

          if (red === green && green === blue && red > 0 && red <= 28) {
            // AMARELO
            red = 234;
            green = 161;
            blue = 43;
          } else if (red === green && green === blue && red > 28 && red <= 57) {
            // LARANJA
            red = 255;
            green = 153;
            blue = 77;
          } else if (red === green && green === blue && red > 57 && red <= 85) {
            // VERMELHO
            red = 234;
            green = 47;
            blue = 62;
          } else if (
            red === green &&
            green === blue &&
            red > 85 &&
            red <= 113
          ) {
            // ROSA
            red = 202;
            green = 53;
            blue = 111;
          } else if (
            red === green &&
            green === blue &&
            red > 113 &&
            red <= 141
          ) {
            // VIOLETA
            red = 212;
            green = 108;
            blue = 255;
          } else if (
            red === green &&
            green === blue &&
            red > 141 &&
            red <= 169
          ) {
            // ROXO
            red = 119;
            green = 45;
            blue = 195;
          } else if (
            red === green &&
            green === blue &&
            red > 169 &&
            red <= 197
          ) {
            // AZUL
            red = 66;
            green = 59;
            blue = 229;
          } else if (
            red === green &&
            green === blue &&
            red > 197 &&
            red <= 225
          ) {
            // TURQUESA
            red = 87;
            green = 195;
            blue = 193;
          } else if (
            red === green &&
            green === blue &&
            red > 225 &&
            red <= 255
          ) {
            // VERDE
            red = 111;
            green = 234;
            blue = 140;
          }

          lineColorization.push(red);
          lineColorization.push(green);
          lineColorization.push(blue);
          lineColorization.push(
            primaryImage.data[i * primaryImage.width * 4 + j]
          );
        }

        matrixColorization.push(lineColorization);
      }

      let arrayHue = new MatrixToArray(matrixColorization);

      imageData = new ImageData(
        new Uint8ClampedArray(arrayHue),
        primaryImage.width,
        primaryImage.height
      );

      this.addImage("densitySlicing", imageData);

      this.dialog = false;
    },

    colorRedistribution() {
      let primaryImage = this.$store.state.primaryImage.data;
      let matrixColorization = [];
      let imageData = null;

      for (let i = 0; i < primaryImage.height; i++) {
        let lineColorization = [];

        let red = 0;
        let green = 0;
        let blue = 0;

        for (let j = 0; j < primaryImage.width * 4; j++) {
          red = primaryImage.data[i * primaryImage.width * 4 + j++];
          green = primaryImage.data[i * primaryImage.width * 4 + j++];
          blue = primaryImage.data[i * primaryImage.width * 4 + j++];

          if (red < 128) {
            red += green + Math.floor(Math.random()* (50 - 80) + 80)
          } else {
            red -= blue + Math.floor(Math.random()* (50 - 80) + 80)
          } 
          
          if (green < 128) {
            green += blue + Math.floor(Math.random()* (50 - 80) + 80)
          } else {
            green -= red + Math.floor(Math.random()* (50 - 80) + 80)
          }
          
          if (blue < 128){
            blue += red + Math.floor(Math.random()* (50 - 80) + 80)
          } else {
            blue -= green + Math.floor(Math.random()* (50 - 80) + 80)
          }

          lineColorization.push(red);
          lineColorization.push(green);
          lineColorization.push(blue);
          lineColorization.push(
            primaryImage.data[i * primaryImage.width * 4 + j]
          );
        }

        matrixColorization.push(lineColorization);
      }

      let arrayHue = new MatrixToArray(matrixColorization);

      imageData = new ImageData(
        new Uint8ClampedArray(arrayHue),
        primaryImage.width,
        primaryImage.height
      );

      this.addImage("densitySlicing", imageData);

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
