<template>
  <div class="text-xs">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on }">
        <v-btn flat icon v-on="on">
          <v-icon>settings</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="headline" primary-title>Configurações</v-card-title>

        <!-- CONTEÚDO DO DIALOG -->
        <v-card-text></v-card-text>

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
export default {
  name: "dialog-configurations",

  data() {
    return {
      dialog: false
    };
  }
};
</script>
