export default (reconstruct, blocks, controls, options) => {
  window.wallpaperPropertyListener = {
    applyUserProperties: function (properties) {
      if (properties.cube_depth) {
        if (properties.cube_depth.value !== "") {
          blocks.width = properties.cube_depth.value;
          blocks.height = properties.cube_depth.value;
          reconstruct()
        }
      }
      if (properties.speed) {
        if (properties.speed.value !== "") {
          options.speed = 0.1 * Math.pow(10, properties.speed.value / 5)
        }
      }
      if (properties.stiffness) {
        if (properties.stiffness.value !== "") {
          options.stiffness = 1 / properties.stiffness.value
        }
      }
      if (properties.cycle_colours) {
        if (properties.cycle_colours.value !== "") {
          options.cycleColors = properties.cycle_colours.value
        }
      }
      if (properties.auto_rotate) {
        if (properties.auto_rotate.value !== "") {
          controls.autoRotate = properties.auto_rotate.value
        }
      }
      if (properties.zoom) {
        if (properties.zoom.value !== "") {
          options.changeZoom(properties.schemecolor.value);
        }
      }
      if (properties.base_color) {
        if (properties.base_color.value !== "") {
          options.setBaseColor(properties.base_color.value);
        }
      }
      if (properties.target_color) {
        if (properties.target_color.value !== "") {
          options.setTargetColor(properties.target_color.value);
        }
      }
      if (properties.schemecolor) {
        if (properties.schemecolor.value !== "") {
          options.changeBackgroundColor(properties.schemecolor.value);
        }
      }
    }
  }
}