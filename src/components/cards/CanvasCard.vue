<template>
  <v-container fluid>
    <v-layout align-center justify-center>
      <v-flex xs8 style="padding: 0px 10px 0px 0px;">
        <v-card>
          <v-card-text>
            <canvas id="canvas"></canvas>

            <!-- ARTIFÍCIO DE PROGRAMAÇÃO PARA USAR O HOOK UPDATED -->
            <div v-show="false">{{ primaryImage }}</div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs4>
        <v-card>
          <v-card-text>
            <v-layout justify-center>
              <span class="teal--text display-1 font-weight-light">Transformações</span>
            </v-layout>

            <v-divider></v-divider>

            <v-window v-model="step">
              <v-window-item :value="0">
                <v-container fluid>
                  <v-layout justify-space-between mb-3>
                    <v-flex text-xs-left>
                      <span class="subheading font-weight-light mr-1">Translação Eixo X:</span>
                      <span class="display-1 font-weight-light" v-text="translateAxisX"></span>
                    </v-flex>
                  </v-layout>

                  <v-layout>
                    <v-slider
                      :disabled="!enableTransformations"
                      v-model="translateAxisX"
                      color="teal darken-1"
                      always-dirty
                      min="-1000"
                      max="1000"
                    >
                      <template v-slot:prepend>
                        <v-icon color="teal darken-1" @click.prevent.stop="translateAxisX--">remove</v-icon>
                      </template>

                      <template v-slot:append>
                        <v-icon color="teal darken-1" @click.prevent.stop="translateAxisX++">add</v-icon>
                      </template>
                    </v-slider>
                  </v-layout>

                  <v-layout justify-space-between mb-3>
                    <v-flex text-xs-left>
                      <span class="subheading font-weight-light mr-1">Translação Eixo Y:</span>
                      <span class="display-1 font-weight-light" v-text="translateAxisY"></span>
                    </v-flex>
                  </v-layout>

                  <v-layout>
                    <v-slider
                      :disabled="!enableTransformations"
                      v-model="translateAxisY"
                      color="teal darken-1"
                      always-dirty
                      min="-1000"
                      max="1000"
                    >
                      <template v-slot:prepend>
                        <v-icon color="teal darken-1" @click.prevent.stop="translateAxisY--">remove</v-icon>
                      </template>

                      <template v-slot:append>
                        <v-icon color="teal darken-1" @click.prevent.stop="translateAxisY++">add</v-icon>
                      </template>
                    </v-slider>
                  </v-layout>
                </v-container>
              </v-window-item>

              <v-window-item :value="1">
                <v-container fluid>
                  <v-layout justify-space-between mb-3>
                    <v-flex text-xs-left>
                      <span class="subheading font-weight-light mr-1">Rotação:</span>
                      <span class="display-1 font-weight-light" v-text="`${rotation}°`"></span>
                    </v-flex>
                  </v-layout>

                  <v-layout>
                    <v-slider
                      :disabled="!enableTransformations"
                      v-model="rotation"
                      color="teal darken-1"
                      always-dirty
                      min="-180"
                      max="180"
                    >
                      <template v-slot:prepend>
                        <v-icon color="teal darken-1" @click.prevent.stop="rotation--">remove</v-icon>
                      </template>

                      <template v-slot:append>
                        <v-icon color="teal darken-1" @click.prevent.stop="rotation++">add</v-icon>
                      </template>
                    </v-slider>
                  </v-layout>
                </v-container>
              </v-window-item>

              <v-window-item :value="2">
                <v-container fluid>
                  <v-layout justify-space-between mb-3>
                    <v-flex text-xs-left>
                      <span class="subheading font-weight-light mr-1">Escala Eixo X:</span>
                      <span class="display-1 font-weight-light" v-text="`${scaleAxisX/10}`"></span>
                    </v-flex>
                  </v-layout>

                  <v-layout>
                    <v-slider
                      :disabled="!enableTransformations"
                      v-model="scaleAxisX"
                      color="teal darken-1"
                      always-dirty
                      min="-10"
                      max="20"
                    >
                      <template v-slot:prepend>
                        <v-icon color="teal darken-1" @click.prevent.stop="scaleAxisX--">remove</v-icon>
                      </template>

                      <template v-slot:append>
                        <v-icon color="teal darken-1" @click.prevent.stop="scaleAxisX++">add</v-icon>
                      </template>
                    </v-slider>
                  </v-layout>

                  <v-layout justify-space-between mb-3>
                    <v-flex text-xs-left>
                      <span class="subheading font-weight-light mr-1">Escala Eixo Y:</span>
                      <span class="display-1 font-weight-light" v-text="scaleAxisY/10"></span>
                    </v-flex>
                  </v-layout>

                  <v-layout>
                    <v-slider
                      :disabled="!enableTransformations"
                      v-model="scaleAxisY"
                      color="teal darken-1"
                      always-dirty
                      min="-10"
                      max="20"
                    >
                      <template v-slot:prepend>
                        <v-icon color="teal darken-1" @click.prevent.stop="scaleAxisY--">remove</v-icon>
                      </template>

                      <template v-slot:append>
                        <v-icon color="teal darken-1" @click.prevent.stop="scaleAxisY++">add</v-icon>
                      </template>
                    </v-slider>
                  </v-layout>
                </v-container>
              </v-window-item>

              <v-window-item :value="3">
                <v-container fluid>
                  <v-layout justify-space-between mb-3>
                    <v-flex text-xs-left>
                      <!-- ARTIFÍCIO DE PROGRAMAÇÃO PARA USAR O HOOK UPDATED -->
                      <div v-show="false">{{ reflectionAxisX }}</div>
                      <div v-show="false">{{ reflectionAxisY }}</div>
                    </v-flex>
                  </v-layout>

                  <v-layout justify-space-between mb-3>
                    <v-flex text-xs-left>
                      <v-btn
                        block
                        color="teal darken-1"
                        :disabled="!enableTransformations"
                        large
                        outline
                        @click.prevent.stop="reflectionAxisX *= -1"
                      >Reflexão no Eixo X</v-btn>

                      <v-btn
                        block
                        color="teal darken-1"
                        :disabled="!enableTransformations"
                        large
                        outline
                        @click.prevent.stop="reflectionAxisY *= -1"
                      >Reflexão no Eixo Y</v-btn>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-window-item>

              <v-window-item :value="4">
                <v-container fluid>
                  <v-layout justify-space-between mb-3>
                    <v-flex text-xs-left>
                      <span class="subheading font-weight-light mr-1">Cisalhamento Eixo X:</span>
                      <span class="display-1 font-weight-light" v-text="`${skewAxisX/10}`"></span>
                    </v-flex>
                  </v-layout>

                  <v-layout>
                    <v-slider
                      :disabled="!enableTransformations"
                      v-model="skewAxisX"
                      color="teal darken-1"
                      always-dirty
                      min="-10"
                      max="10"
                    >
                      <template v-slot:prepend>
                        <v-icon color="teal darken-1" @click.prevent.stop="skewAxisX--">remove</v-icon>
                      </template>

                      <template v-slot:append>
                        <v-icon color="teal darken-1" @click.prevent.stop="skewAxisX++">add</v-icon>
                      </template>
                    </v-slider>
                  </v-layout>

                  <v-layout justify-space-between mb-3>
                    <v-flex text-xs-left>
                      <span class="subheading font-weight-light mr-1">Cisalhamento Eixo Y:</span>
                      <span class="display-1 font-weight-light" v-text="`${skewAxisY/10}`"></span>
                    </v-flex>
                  </v-layout>

                  <v-layout>
                    <v-slider
                      :disabled="!enableTransformations"
                      v-model="skewAxisY"
                      color="teal darken-1"
                      always-dirty
                      min="-10"
                      max="10"
                    >
                      <template v-slot:prepend>
                        <v-icon color="teal darken-1" @click.prevent.stop="skewAxisY--">remove</v-icon>
                      </template>

                      <template v-slot:append>
                        <v-icon color="teal darken-1" @click.prevent.stop="skewAxisY++">add</v-icon>
                      </template>
                    </v-slider>
                  </v-layout>
                </v-container>
              </v-window-item>
            </v-window>
          </v-card-text>
          <v-card-actions>
            <v-btn
              :disabled="step === 0"
              outline
              fab
              @click.prevent.stop="prev()"
              color="teal darken-1"
            >
              <v-icon>navigate_before</v-icon>
            </v-btn>
            <v-spacer></v-spacer>

            <v-item-group v-model="step" class="text-xs-center" mandatory>
              <v-item v-for="n in length" :key="`btn-${n}`">
                <v-btn slot-scope="{ active, toggle }" :input-value="active" icon @click="toggle">
                  <v-icon color="teal darken-1">fiber_manual_record</v-icon>
                </v-btn>
              </v-item>
            </v-item-group>

            <v-spacer></v-spacer>
            <v-btn
              :disabled="step === length - 1"
              outline
              fab
              @click.prevent.stop="next()"
              color="teal darken-1"
            >
              <v-icon>navigate_next</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  updated() {
    this.clearCanvas();

    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    var imageCanvas = new Image();

    imageCanvas.src = this.$store.state.primaryImage.url;

    // Habilitar as transformações apenas se tiver uma imagem no canvas
    if (this.$store.state.primaryImage.url !== undefined) {
      this.enableTransformations = true;
    } else {
      this.enableTransformations = false;
    }

    imageCanvas.crossOrigin = "Anonymous";
    imageCanvas.onload = () => {
      canvas.width = imageCanvas.naturalWidth;
      canvas.height = imageCanvas.naturalHeight;

      context.transform(1, 0.1 * this.skewAxisX, 0.1 * this.skewAxisY, 1, 0, 0);

      context.rotate((this.rotation * Math.PI) / 180);

      context.scale(
        this.reflectionAxisX * this.scaleAxisX * 0.1,
        this.reflectionAxisY * this.scaleAxisY * 0.1
      );

      context.drawImage(
        imageCanvas,
        this.translateAxisX +
          (this.reflectionAxisX == -1
            ? canvas.width * this.reflectionAxisX
            : 0),
        this.translateAxisY +
          (this.reflectionAxisY == -1
            ? canvas.height * this.reflectionAxisY
            : 0),
        canvas.width,
        canvas.height
      );

      imageCanvas.style.display = "none";
    };
  },

  computed: {
    primaryImage() {
      return this.$store.state.primaryImage;
    }
  },

  watch: {
    primaryImage() {
      this.translateAxisX = 0;
      this.translateAxisY = 0;
      this.rotation = 0;
      this.scaleAxisX = 10;
      this.scaleAxisY = 10;
      this.reflectionAxisX = 1;
      this.reflectionAxisY = 1;
      this.skewAxisX = 0;
      this.skewAxisY = 0;
    }
  },

  data() {
    return {
      length: 5,
      step: 0,
      enableTransformations: false,
      translateAxisX: 0,
      translateAxisY: 0,
      rotation: 0,
      scaleAxisX: 10,
      scaleAxisY: 10,
      reflectionAxisX: 1,
      reflectionAxisY: 1,
      skewAxisX: 0,
      skewAxisY: 0
    };
  },

  methods: {
    next() {
      this.step = this.step + 1 === this.length ? 0 : this.step + 1;
    },
    prev() {
      this.step = this.step - 1 < 0 ? this.length - 1 : this.step - 1;
    },
    clearCanvas() {
      var canvas = document.getElementById("canvas");
      var context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
};
</script>

<style>
#canvas {
  width: 100%;
}
</style>
