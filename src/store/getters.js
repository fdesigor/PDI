export default {
    secondaryImageList: state => {
        if (state.primaryImage.id) {
            return state.listPanelImages.filter((image) => {return (state.primaryImage.id !== image.id)})
        } else {
            return []
        }
    },

    normalize: state => {
        return state.configurations.normalize
    }
}