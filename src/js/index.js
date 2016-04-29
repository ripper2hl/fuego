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
    let maximumAxisX = 0;
    let minimumAxisX = 1000;
    let maximumAxisY = 0;
    let minimumAxisY = 1000;
    $fire.passImageToCanvas();
    $fire.fetchPixelsWhitFire(function (pixelFire){
      maximumAxisX = Math.max( maximumAxisX, pixelFire.x );
      minimumAxisX = Math.min( minimumAxisX, pixelFire.x );
      maximumAxisY = Math.max( maximumAxisY, pixelFire.y );
      minimumAxisY = Math.min( minimumAxisY, pixelFire.y );
    })
    .done(function(){
      console.debug('drawRectangle');
      console.log(maximumAxisX, maximumAxisY, minimumAxisX, minimumAxisY);
      $fire.drawRectangle(maximumAxisX, maximumAxisY, minimumAxisX, minimumAxisY);
    });
  }
})();
