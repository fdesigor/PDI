<template>
  <div class="text-xs">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on }">
        <div v-on="on">Operações Aritméticas/Lógicas</div>
      </template>

      <!-- CONTEÚDO DO DIALOG -->
      <v-card>
        <v-card-title class="title font-weight-regular justify-space-between">
          <span>Operações Aritméticas/Lógicas</span>
          <v-avatar color="teal darken-1" class="subheading white--text" size="24" v-text="step"></v-avatar>
        </v-card-title>

        <v-divider></v-divider>

        <v-window v-model="step">
          <v-window-item :value="1">
            <v-card-text>
              <v-container grid-list-sm fluid>
                <v-layout row wrap>
                  <v-flex v-for="item in secondaryImageList" :key="item.id" xs4 d-flex>
                    <v-card flat tile class="d-flex">
                      <v-img
                        :src="item.url"
                        :lazy-src="item.url"
                        aspect-ratio="1"
                        :class="item.border"
                        @mouseenter="item.border = 'image-border'"
                        @mouseout="item.border = 'image-noborder'"
                        @click="selectSecondaryImage(item.data)"
                      ></v-img>
                    </v-card>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
          </v-window-item>

          <v-window-item :value="2">
            <v-card-text>
              <v-btn block large outline @click="operation('+')">Adição</v-btn>
              <v-btn block large outline @click="operation('-')">Subtração</v-btn>
              <v-btn block large outline @click="operation('*')">Multiplicação</v-btn>
              <v-btn block large outline @click="operation('/')">Divisão</v-btn>
              <v-btn block large outline @click="operation('&')">AND</v-btn>
              <v-btn block large outline @click="operation('|')">OR</v-btn>
              <v-btn block large outline @click="operation('^')">XOR</v-btn>
            </v-card-text>
          </v-window-item>
        </v-window>

        <v-card-actions>
          <v-btn :disabled="step === 1" flat @click="step--">Voltar</v-btn>

          <v-switch
            color="teal darken-1"
            v-model="normalize"
            :label=" normalize ? 'Normalizando' : 'Truncando'"
            @click.prevent.stop="operationMode()"
          ></v-switch>
          <v-spacer></v-spacer>
          <v-btn color="teal darken-1" flat @click="dialog = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "dialog-operations",

  computed: {
    normalize() {
      return this.$store.getters.normalize;
    },

    secondaryImageList() {
      return this.$store.getters.secondaryImageList;
    }
  },

  data() {
    return {
      dialog: false,
      step: 1,
      secondaryImage: {}
    };
  },

  methods: {
    operationMode() {
      this.$store.commit("OPERATION_MODE", this.$store.getters.normalize);
    },

    selectSecondaryImage(image) {
      this.secondaryImage = image;
      this.step++;
    },

    operation(type) {
      let primaryImage = this.$store.state.primaryImage.data;
      let secondaryImage = this.secondaryImage;

      let height = 0;
      let width = 0;

      if (primaryImage.height > secondaryImage.height) {
        height = primaryImage.height;
      } else {
        height = secondaryImage.height;
      }

      if (primaryImage.width > secondaryImage.width) {
        width = primaryImage.width;
      } else {
        width = secondaryImage.width;
      }

      let matrix = [];

      for (let i = 0; i < height; i++) {
        let arr = [];
        for (let j = 0; j < width * 4; j++) {
          arr.push(255);
        }
        matrix.push(arr);
      }

      for (let i = 0; i < primaryImage.height; i++) {
        for (let j = 0; j < primaryImage.width * 4; j++) {
          if ((i * secondaryImage.width * 4 + j + 1) % 4 != 0) {
            matrix[i][j] = primaryImage.data[i * primaryImage.width * 4 + j];
          }
        }
      }

      switch (type) {
        case "+":
          matrix = this.additionOperation(matrix, secondaryImage);
          break;

        case "-":
          matrix = this.subtractionOperation(matrix, secondaryImage);
          break;

        case "*":
          matrix = this.multiplicationOperation(matrix, secondaryImage);
          break;

        case "/":
          matrix = this.divisionOperation(matrix, secondaryImage);
          break;

        case "&":
          matrix = this.andOperation(matrix, secondaryImage);
          break;

        case "|":
          matrix = this.orOperation(matrix, secondaryImage);
          break;

        case "^":
          matrix = this.xorOperation(matrix, secondaryImage);
          break;

        default:
          break;
      }

      let newData = [];
      matrix.map(arr => {
        arr.map(num => {
          newData.push(num);
        });
      });

      let newImageData = new ImageData(
        new Uint8ClampedArray(newData),
        width,
        height
      );

      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");

      canvas.width = newImageData.width;
      canvas.height = newImageData.height;
      ctx.putImageData(newImageData, 0, 0);

      this.$store.commit("PUSH_IMAGE_IN_PANEL", {
        id: String(this.$store.state.listPanelImages.length),
        name: `${type}operation_${this.$store.state.primaryImage.name}`,
        url: canvas.toDataURL(),
        data: newImageData,
        border: String("image-noborder")
      });

      this.dialog = false;
      this.step = 1;
    },

    additionOperation(matrix, secondaryImage) {
      let value = 0;
      for (let i = 0; i < secondaryImage.height; i++) {
        for (let j = 0; j < secondaryImage.width * 4; j++) {
          if ((i * secondaryImage.width * 4 + j + 1) % 4 != 0) {
            value = secondaryImage.data[i * secondaryImage.width * 4 + j];

            matrix[i][j] += value;
          }
        }
      }

      let matrixMinimumValue = matrix[0][0];
      let matrixMaximumValue = matrix[0][0];
      for (let i = 0; i < secondaryImage.height; i++) {
        for (let j = 0; j < secondaryImage.width * 4; j++) {
          if ((i * secondaryImage.width * 4 + j + 1) % 4 != 0) {
            if (matrix[i][j] < matrixMinimumValue) {
              matrixMinimumValue = matrix[i][j];
            }

            if (matrix[i][j] > matrixMaximumValue) {
              matrixMaximumValue = matrix[i][j];
            }
          }
        }
      }

      for (let i = 0; i < secondaryImage.height; i++) {
        for (let j = 0; j < secondaryImage.width * 4; j++) {
          if ((i * secondaryImage.width * 4 + j + 1) % 4 != 0) {
            if (this.$store.getters.normalize) {
              matrix[i][j] =
                (255 / (matrixMaximumValue - matrixMinimumValue)) *
                (matrix[i][j] - matrixMinimumValue);
            } else {
              if (matrix[i][j] > 255) {
                matrix[i][j] = 255;
              }
            }
          }
        }
      }

      return matrix;
    },

    subtractionOperation(matrix, secondaryImage) {
      let value = 0;
      for (let i = 0; i < secondaryImage.height; i++) {
        for (let j = 0; j < secondaryImage.width * 4; j++) {
          if ((i * secondaryImage.width * 4 + j + 1) % 4 != 0) {
            value = secondaryImage.data[i * secondaryImage.width * 4 + j];

            matrix[i][j] -= value;
          }
        }
      }

      let matrixMinimumValue = matrix[0][0];
      let matrixMaximumValue = matrix[0][0];
      for (let i = 0; i < secondaryImage.height; i++) {
        for (let j = 0; j < secondaryImage.width * 4; j++) {
          if ((i * secondaryImage.width * 4 + j + 1) % 4 != 0) {
            if (matrix[i][j] < matrixMinimumValue) {
              matrixMinimumValue = matrix[i][j];
            }

            if (matrix[i][j] > matrixMaximumValue) {
              matrixMaximumValue = matrix[i][j];
            }
          }
        }
      }

      for (let i = 0; i < secondaryImage.height; i++) {
        for (let j = 0; j < secondaryImage.width * 4; j++) {
          if ((i * secondaryImage.width * 4 + j + 1) % 4 != 0) {
            if (this.$store.getters.normalize) {
              matrix[i][j] =
                (255 / (matrixMaximumValue - matrixMinimumValue)) *
                (matrix[i][j] - matrixMinimumValue);
            } else {
              if (matrix[i][j] < 0) {
                matrix[i][j] = 0;
              }
            }
          }
        }
      }

      return matrix;
    },

    multiplicationOperation(matrix, secondaryImage) {
      let value = 0;
      for (let i = 0; i < secondaryImage.height; i++) {
        for (let j = 0; j < secondaryImage.width * 4; j++) {
          if ((i * secondaryImage.width * 4 + j + 1) % 4 != 0) {
            value = secondaryImage.data[i * secondaryImage.width * 4 + j];

            matrix[i][j] *= value;
          }
        }
      }

      let matrixMinimumValue = matrix[0][0];
      let matrixMaximumValue = matrix[0][0];
      for (let i = 0; i < secondaryImage.height; i++) {
        for (let j = 0; j < secondaryImage.width * 4; j++) {
          if ((i * secondaryImage.width * 4 + j + 1) % 4 != 0) {
            if (matrix[i][j] < matrixMinimumValue) {
              matrixMinimumValue = matrix[i][j];
            }

            if (matrix[i][j] > matrixMaximumValue) {
              matrixMaximumValue = matrix[i][j];
            }
          }
        }
      }

      for (let i = 0; i < secondaryImage.height; i++) {
        for (let j = 0; j < secondaryImage.width * 4; j++) {
          if ((i * secondaryImage.width * 4 + j + 1) % 4 != 0) {
            if (this.$store.getters.normalize) {
              matrix[i][j] =
                (255 / (matrixMaximumValue - matrixMinimumValue)) *
                (matrix[i][j] - matrixMinimumValue);
            } else {
              if (matrix[i][j] > 255) {
                matrix[i][j] = 255;
              }
            }
          }
        }
      }

      return matrix;
    },

    divisionOperation(matrix, secondaryImage) {
      let value = 0;
      for (let i = 0; i < secondaryImage.height; i++) {
        for (let j = 0; j < secondaryImage.width * 4; j++) {
          if ((i * secondaryImage.width * 4 + j + 1) % 4 != 0) {
            value = secondaryImage.data[i * secondaryImage.width * 4 + j];

            matrix[i][j] /= value;
          }
        }
      }

      let matrixMinimumValue = matrix[0][0];
      let matrixMaximumValue = matrix[0][0];
      for (let i = 0; i < secondaryImage.height; i++) {
        for (let j = 0; j < secondaryImage.width * 4; j++) {
          if ((i * secondaryImage.width * 4 + j + 1) % 4 != 0) {
            if (matrix[i][j] < matrixMinimumValue) {
              matrixMinimumValue = matrix[i][j];
            }

            if (matrix[i][j] > matrixMaximumValue) {
              matrixMaximumValue = matrix[i][j];
            }
          }
        }
      }

      for (let i = 0; i < secondaryImage.height; i++) {
        for (let j = 0; j < secondaryImage.width * 4; j++) {
          if ((i * secondaryImage.width * 4 + j + 1) % 4 != 0) {
            if (this.$store.getters.normalize) {
              matrix[i][j] =
                (255 / (matrixMaximumValue - matrixMinimumValue)) *
                (matrix[i][j] - matrixMinimumValue);
            }
          }
        }
      }

      return matrix;
    },

    andOperation(matrix, secondaryImage) {
      let value = 0;
      for (let i = 0; i < secondaryImage.height; i++) {
        for (let j = 0; j < secondaryImage.width * 4; j++) {
          if ((i * secondaryImage.width * 4 + j + 1) % 4 != 0) {
            value = secondaryImage.data[i * secondaryImage.width * 4 + j];

            matrix[i][j] &= value;
          }
        }
      }

      let matrixMinimumValue = matrix[0][0];
      let matrixMaximumValue = matrix[0][0];
      for (let i = 0; i < secondaryImage.height; i++) {
        for (let j = 0; j < secondaryImage.width * 4; j++) {
          if ((i * secondaryImage.width * 4 + j + 1) % 4 != 0) {
            if (matrix[i][j] < matrixMinimumValue) {
              matrixMinimumValue = matrix[i][j];
            }

            if (matrix[i][j] > matrixMaximumValue) {
              matrixMaximumValue = matrix[i][j];
            }
          }
        }
      }

      for (let i = 0; i < secondaryImage.height; i++) {
        for (let j = 0; j < secondaryImage.width * 4; j++) {
          if ((i * secondaryImage.width * 4 + j + 1) % 4 != 0) {
            if (this.$store.getters.normalize) {
              matrix[i][j] =
                (255 / (matrixMaximumValue - matrixMinimumValue)) *
                (matrix[i][j] - matrixMinimumValue);
            }
          }
        }
      }

      return matrix;
    },

    orOperation(matrix, secondaryImage) {
      let value = 0;
      for (let i = 0; i < secondaryImage.height; i++) {
        for (let j = 0; j < secondaryImage.width * 4; j++) {
          if ((i * secondaryImage.width * 4 + j + 1) % 4 != 0) {
            value = secondaryImage.data[i * secondaryImage.width * 4 + j];

            matrix[i][j] |= value;
          }
        }
      }

      let matrixMinimumValue = matrix[0][0];
      let matrixMaximumValue = matrix[0][0];
      for (let i = 0; i < secondaryImage.height; i++) {
        for (let j = 0; j < secondaryImage.width * 4; j++) {
          if ((i * secondaryImage.width * 4 + j + 1) % 4 != 0) {
            if (matrix[i][j] < matrixMinimumValue) {
              matrixMinimumValue = matrix[i][j];
            }

            if (matrix[i][j] > matrixMaximumValue) {
              matrixMaximumValue = matrix[i][j];
            }
          }
        }
      }

      for (let i = 0; i < secondaryImage.height; i++) {
        for (let j = 0; j < secondaryImage.width * 4; j++) {
          if ((i * secondaryImage.width * 4 + j + 1) % 4 != 0) {
            if (this.$store.getters.normalize) {
              matrix[i][j] =
                (255 / (matrixMaximumValue - matrixMinimumValue)) *
                (matrix[i][j] - matrixMinimumValue);
            }
          }
        }
      }

      return matrix;
    },

    xorOperation(matrix, secondaryImage) {
      let value = 0;
      for (let i = 0; i < secondaryImage.height; i++) {
        for (let j = 0; j < secondaryImage.width * 4; j++) {
          if ((i * secondaryImage.width * 4 + j + 1) % 4 != 0) {
            value = secondaryImage.data[i * secondaryImage.width * 4 + j];

            matrix[i][j] ^= value;
          }
        }
      }

      let matrixMinimumValue = matrix[0][0];
      let matrixMaximumValue = matrix[0][0];
      for (let i = 0; i < secondaryImage.height; i++) {
        for (let j = 0; j < secondaryImage.width * 4; j++) {
          if ((i * secondaryImage.width * 4 + j + 1) % 4 != 0) {
            if (matrix[i][j] < matrixMinimumValue) {
              matrixMinimumValue = matrix[i][j];
            }

            if (matrix[i][j] > matrixMaximumValue) {
              matrixMaximumValue = matrix[i][j];
            }
          }
        }
      }

      for (let i = 0; i < secondaryImage.height; i++) {
        for (let j = 0; j < secondaryImage.width * 4; j++) {
          if ((i * secondaryImage.width * 4 + j + 1) % 4 != 0) {
            if (this.$store.getters.normalize) {
              matrix[i][j] =
                (255 / (matrixMaximumValue - matrixMinimumValue)) *
                (matrix[i][j] - matrixMinimumValue);
            }
          }
        }
      }

      return matrix;
    }
  }
};
</script>
