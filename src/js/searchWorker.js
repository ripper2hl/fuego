(() =>{
  'use strict';
  const fireColors = [
  'rgb(255,0,0)',
  'rgb(255,156,81)',
  'rgb(255,156,0)',
  'rgb(255,141,115)',
  'rgb(225,119,93)',
  'rgb(198,53,36)',
  'rgb(235,71,0)',
  'rgb(255,90,4)',
  'rgb(248,255,243)',
  'rgb(254,254,254)',
  'rgb(140,149,156)',
  'rgb(183,172,166)',
  'rgb(255,252,20)',
  'rgb(251,254,201)',
  'rgb(255,254,185)',
  'rgb(255,254,218)',
  'rgb(247,103,1)',
  'rgb(174, 95, 60)'
  ];

  // Execute web worker
  self.addEventListener('message', searchFire, false);

  /**
   * Search pixels with fire and notify the
   * worker listener when is found an pixel
   * or is finished the scanning
   * @param e e.data contains the information for the job
   * @author Jesus Perales.
   */
  function searchFire(e){
    var imgInformation = e.data;
    var imgPixels = imgInformation.imgPixels;
    var canvas = imgInformation.canvas;
    for(var y = 0; y < canvas.height; y++){
      for(var x = 0; x < canvas.width; x++){
        var i = (x + y * canvas.width) * 4;
        var r = imgPixels[i];
        var g = imgPixels[i + 1];
        var b = imgPixels[i + 2];
        var rgb = 'rgb(' + r + ',' + g + ',' + b  +')';
        if(isFireColor(rgb)){
          var pixelFire = { color : { } };
          pixelFire.x = x;
          pixelFire.y = y;
          pixelFire.color.rgb = rgb;
          self.postMessage( pixelFire );
        }
      }
    }
    self.postMessage('Finish');
  }

  /**
   * Compare is a fire color
   * @return true is a fire color, false is not a fire color.
   * @author Jesus Perales.
   */
  function isFireColor(color){
    let isFound = fireColors.filter( (fireColor) => {
      return fireColor === color;
    });
    return isFound.length > 0;
  }

})();
