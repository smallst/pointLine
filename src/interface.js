function init() {
  ctx.clearRect(0, 0, width, height);
  ctxshow.clearRect(0, 0, widthShow, heightShow);
  pointerArr = [];
  for (var i =0; i < arr.length; i++) {
    arr[i].state = 0;
    arr[i].stateShow = 0;
    drawPointer(i);
  }
}