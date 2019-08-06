export default {
    'PUSH_IMAGE_IN_PANEL' (state, payload) {
        state.listPanelImages.push(payload)
        state.listPanelImages.map(function(e) { return e.border = 'image-noborder'; });
        state.primaryImage = {}
    },

    'REMOVE_IMAGE_IN_PANEL' (state, payload) {
        let index = state.listPanelImages.map(function(e) { return e.id; }).indexOf(payload);
        state.listPanelImages.splice(index, 1)
        state.primaryImage = {}
    },

    'CLEAR_IMAGES_IN_PANEL' (state) {
        state.listPanelImages = []
        state.primaryImage = {}
    },

    'SELECT_IMAGE_TO_CANVAS' (state, payload) {
        let index = state.listPanelImages.map(function(e) { return e.border; }).indexOf('image-border');
        
        if (index !== -1) {
            state.listPanelImages[index].border = 'image-noborder'
        }

        index = state.listPanelImages.map(function(e) { return e.id; }).indexOf(payload.id);

        if (index !== -1) {
            state.listPanelImages[index].border = 'image-border'
        }

        state.primaryImage = payload
    },

    'OPERATION_MODE' (state, payload) {
        state.configurations.normalize = !payload
    }
}