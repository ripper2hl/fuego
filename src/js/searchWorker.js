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
    let imgInformation = e.data;
    let imgPixels = imgInformation.imgPixels;
    let canvas = imgInformation.canvas;
    let pixelsFire = [];

    for(let y = 0; y < canvas.height; y++){
      for(let x = 0; x < canvas.width; x++){
        let i = (x + y * canvas.width) * 4;
        let r = imgPixels[i];
        let g = imgPixels[i + 1];
        let b = imgPixels[i + 2];
        let rgb = 'rgb(' + r + ',' + g + ',' + b  +')';
        if(isFireColor(rgb)){
          let pixelFire = { color : { } };
          pixelFire.x = x;
          pixelFire.y = y;
          pixelFire.color.rgb = rgb;
          pixelsFire.push(pixelFire);
        }
      }
    }
    self.postMessage( determineRectangleCoords(pixelsFire) );
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

  /**
   * Determine maximum and minimum coords
   * for axis Y and X for draw rectangle.
   * @param pixelsFire list of fire pixels.
   * @return rectangle maximum and minimum points for draw rectagnle
   * @author Jesus Perales.
   */
  function determineRectangleCoords(pixelsFire){
    let rectangle = {
      maximumX : 0,
      maximumY : 0,
      minimumX : 0,
      minimumY : 0
    };
    pixelsFire.forEach( (pixelFire , index) => {
      if(index > 0){
        rectangle.maximumX = Math.max( rectangle.maximumX, pixelFire.x );
        rectangle.minimumX = Math.min( rectangle.minimumX, pixelFire.x );
        rectangle.maximumY = Math.max( rectangle.maximumY, pixelFire.y );
        rectangle.minimumY = Math.min( rectangle.minimumY, pixelFire.y );
      }else{
        rectangle.maximumX = pixelFire.x;
        rectangle.minimumX = pixelFire.x;
        rectangle.maximumY = pixelFire.y;
        rectangle.minimumY = pixelFire.y;
      }
    });
    return rectangle;
  }

})();
