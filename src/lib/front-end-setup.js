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