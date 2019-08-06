<template>
  <div class="text-xs">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on }">
        <div v-on="on">Filtros</div>
      </template>

      <v-card>
        <v-card-title class="headline" primary-title>Filtros</v-card-title>

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
  name: "dialog-filters",
  data() {
    return {
      dialog: false
    };
  }
};
</script>
