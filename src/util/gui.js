import GUI from "lil-gui";

window.gui = new GUI();

gui.params = {
  progress: 0,
  lightColor1: "#f7fafc",
  lightColor2: "#c4dce5",
};

let visible = false;
gui.hide();

if (visible) {
  gui.show();
}

document.addEventListener("keydown", (e) => {
  // check shift g
  if (e.key === "G" && e.shiftKey) {
    if (visible) {
      gui.hide();
      visible = false;
    } else {
      gui.show();
      visible = true;
    }
  }
});

gui.add(gui.params, "progress", 0, 1, 0.01);
gui.add(gui.params, "lightColor1");
gui.add(gui.params, "lightColor2");

export { visible };
