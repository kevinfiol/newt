(() => {
  // src/index.jsx
  var boxes = document.getElementsByClassName("box");
  var CELL_SIZE = 25;
  for (let box of boxes) {
    box.style.position = "absolute";
    box.addEventListener("mousedown", (ev) => {
      ev.preventDefault();
      if (ev.button != 0)
        return;
      const widthOffset = ev.clientX - box.offsetLeft;
      const heightOffset = ev.clientY - box.offsetTop;
      function mousemove(ev2) {
        let x = ev2.clientX - widthOffset;
        let y = ev2.clientY - heightOffset;
        x = Math.round(x / CELL_SIZE) * CELL_SIZE;
        y = Math.round(y / CELL_SIZE) * CELL_SIZE;
        box.style.left = x + "px";
        box.style.top = y + "px";
      }
      function mouseup(ev2) {
        document.removeEventListener("mousemove", mousemove);
        document.removeEventListener("mouseup", mouseup);
      }
      document.addEventListener("mousemove", mousemove);
      document.addEventListener("mouseup", mouseup);
    });
  }
})();
