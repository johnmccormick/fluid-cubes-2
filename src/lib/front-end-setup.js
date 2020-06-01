export default (reconstruct, blocks, controls, options) => {
  var toggleablePanels = document.getElementsByClassName("toggleable");

  if (toggleablePanels.length > 0) {
    var toggleablePanels = document.getElementsByClassName("toggleable");
    var cubeDepthSlider = document.getElementById("cube-depth-slider");
    var cubeDepthOutput = document.getElementById("cube-depth-output");
    cubeDepthOutput.innerHTML = cubeDepthSlider.value;
    blocks.width = parseInt(cubeDepthSlider.value);
    blocks.height = parseInt(cubeDepthSlider.value);
    reconstruct();

    cubeDepthSlider.oninput = function () {
      cubeDepthOutput.innerHTML = this.value;
      blocks.width = parseInt(this.value);
      blocks.height = parseInt(this.value);
      reconstruct()
    }

    var speedSlider = document.getElementById("speed-slider");
    var speedOutput = document.getElementById("speed-output");
    var speedSliderValue = speedSlider.value / 1000;
    speedOutput.innerHTML = speedSliderValue;
    options.speed = speedSliderValue;

    speedSlider.oninput = function () {
      var value = this.value / 1000;
      speedOutput.innerHTML = value;
      options.speed = value;
    }

    var stiffnessSlider = document.getElementById("stiffness-slider");
    var stiffnessOutput = document.getElementById("stiffness-output");
    var stiffnessSliderValue = stiffnessSlider.value / 1000;
    stiffnessOutput.innerHTML = stiffnessSliderValue;
    options.stiffness = 1 / stiffnessSliderValue;

    stiffnessSlider.oninput = function () {
      var value = this.value / 1000;
      stiffnessOutput.innerHTML = value;
      options.stiffness = 1 / value;
    }

    var ambientLightSlider = document.getElementById("ambient-light-slider");
    var ambientLightOutput = document.getElementById("ambient-light-output");
    var ambientLightSliderValue = ambientLightSlider.value / 100;
    ambientLightOutput.innerHTML = ambientLightSliderValue;
    options.changeAmbientLight({ intensity: ambientLightSliderValue });

    ambientLightSlider.oninput = function () {
      var value = this.value / 100;
      ambientLightOutput.innerHTML = value;
      options.changeAmbientLight({ intensity: value });
    }

    var minHeightSlider = document.getElementById("min-height-slider");
    var minHeightOutput = document.getElementById("min-height-output");
    var minHeightSliderValue = parseInt(minHeightSlider.value);
    minHeightOutput.innerHTML = minHeightSliderValue;
    options.minHeight = minHeightSliderValue;

    minHeightSlider.oninput = function () {
      var value = parseInt(this.value);
      minHeightOutput.innerHTML = value;
      options.minHeight = value;
    }

    var maxHeightSlider = document.getElementById("max-height-slider");
    var maxHeightOutput = document.getElementById("max-height-output");
    var maxHeightSliderValue = maxHeightSlider.value;
    maxHeightOutput.innerHTML = maxHeightSliderValue;
    options.maxHeight = maxHeightSliderValue;

    maxHeightSlider.oninput = function () {
      var value = parseInt(this.value);
      maxHeightOutput.innerHTML = value;
      options.maxHeight = value;
    }

    var cycleColorsCheckbox = document.getElementById("cycle-colors-checkbox");
    options.cycleColors = cycleColorsCheckbox.checked;

    cycleColorsCheckbox.onclick = function () {
      options.cycleColors = cycleColorsCheckbox.checked;
    }

    var autoRotateCheckbox = document.getElementById("auto-rotate-checkbox");
    controls.autoRotate = autoRotateCheckbox.checked;

    autoRotateCheckbox.onclick = function () {
      controls.autoRotate = autoRotateCheckbox.checked;
    }

    var modePicker = document.getElementById("mode-picker");
    options.mode = parseInt(modePicker.value);

    modePicker.onchange = function () {
      options.mode = parseInt(modePicker.value);
      options.resetSize(modePicker.value);
    }

    var slidersHideTimeout;
    var panelVisibleCheckbox = document.getElementById("panel-visible-checkbox");
    var panelAlwaysVisible = panelVisibleCheckbox.checked;
    if (panelAlwaysVisible) changeToggleablePanels(1);

    panelVisibleCheckbox.onclick = function () {
      panelAlwaysVisible = panelVisibleCheckbox.checked;
      if (panelAlwaysVisible) {
        changeToggleablePanels(1);
        clearTimeout(slidersHideTimeout);
      }
    }

    function changeToggleablePanels(opacity) {
      var length = toggleablePanels.length;
      for (var i = 0; i < length; i++) {

        toggleablePanels[i].style.opacity = opacity;
      };
    }

    document.addEventListener("mousemove", function () {
      if (panelAlwaysVisible) return;
      clearTimeout(slidersHideTimeout);
      changeToggleablePanels(1);
      slidersHideTimeout = setTimeout(function () { changeToggleablePanels(0) }, 3500)
    })
  }
}