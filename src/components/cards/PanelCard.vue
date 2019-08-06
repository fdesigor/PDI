<template>
  <v-card>
    <v-card-text>
      <v-layout row wrap>
        <v-flex xs2 v-for="item in listPanelImages" :key="item.id">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-img
                :id="item.id"
                :src="item.url"
                max-width="128"
                height="128"
                :class="item.border"
                v-on="on"
                @click="selectPrimaryImage(item)"
              />
            </template>
            <span>{{item.name}}</span>
          </v-tooltip>
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-card-actions>
      <v-btn outline color="white darken-1" @click="clearPanel()">
        <v-icon>delete_sweep</v-icon>Limpar
      </v-btn>

      <v-btn outline color="red darken-1" @click="removeSelected(primaryImage.id)">
        <v-icon>delete</v-icon>Remover
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn outline color="teal darken-1" @click="$refs.imgPicker.click()">
        <v-icon>add_to_photos</v-icon>Adicionar
      </v-btn>
      <input
        type="file"
        style="display: none"
        ref="imgPicker"
        accept="image/*, .pgm"
        @change="addImage"
      />
    </v-card-actions>
  </v-card>
</template>

<script>
import ImageConverter from "../../utils/pbmImageConverter.js";

export default {
  data: () => ({
    imageID: 0,
    imageName: "",
    imageUrl: "",
    imageFile: ""
  }),

  computed: {
    primaryImage() {
      return this.$store.state.primaryImage;
    },
    listPanelImages() {
      return this.$store.state.listPanelImages;
    }
  },

  methods: {
    addImage(e) {
      let canvas = null
      const files = e.target.files;
      if (files[0] !== undefined) {
        this.imageName = files[0].name;

        if (this.imageName.lastIndexOf(".") <= 0) {
          return;
        }

        const fr = new FileReader();

        fr.readAsDataURL(files[0]);

        fr.addEventListener("load", e => {
          let pbmImgFamily = new ImageConverter(
            window.atob(e.target.result.split(",")[1])
          );

          let image = new Image();

          if (pbmImgFamily.isPbmFamily) {
            this.imageUrl = pbmImgFamily._formatter
              .getCanvas(pbmImgFamily._parser)
              .toDataURL();

            image.src = this.imageUrl;

            canvas = pbmImgFamily._formatter.getCanvas(
              pbmImgFamily._parser
            );
          } else {
            this.imageUrl = fr.result;
          
            image.src = this.imageUrl;

            canvas = document.createElement("canvas")
            
          }

          let context = canvas.getContext("2d");

          image.onload = () => {
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;

            context.drawImage(image, 0, 0, canvas.width, canvas.height);

            this.imageFile = context.getImageData(
              0,
              0,
              canvas.width,
              canvas.height
            );
            
            this.imageId = this.listPanelImages.length;

            this.$store.commit("PUSH_IMAGE_IN_PANEL", {
              id: String(this.imageId),
              name: this.imageName,
              url: this.imageUrl,
              data: this.imageFile,
              border: String("image-noborder")
            });
          };
        });
      }
    },

    removeSelected(id) {
      this.$store.commit("REMOVE_IMAGE_IN_PANEL", id);
    },

    clearPanel() {
      this.$store.commit("CLEAR_IMAGES_IN_PANEL");
    },

    selectPrimaryImage(image) {
      this.$store.commit("SELECT_IMAGE_TO_CANVAS", image);
    }
  }
};
</script>

<style>
.image-border {
  box-shadow: 0 -2px 8px #00897b, 0 2px 8px #00897b, -2px 0 8px #00897b,
    2px 0 8px #00897b;
}
</style>
