( () => {
  'use strict';

  $(function(){
      init();
  });

  /**
   * init the process.
   * @author Jesus Perales.
   */
  function init(){
    let colors = [];
    $fire.passImageToCanvas();
    $fire.fetchPixelsWhitFire(function (pixelFire) {
      console.log('Pixel agregado: ', pixelFire);
    });

  }
})();
