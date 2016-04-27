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
    $fire.fetchAllImagePixelColor();
  }
})();
