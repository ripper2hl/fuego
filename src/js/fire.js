var $fire = ( () => {
  'use strict';

  var $fire = {};
  const fireColors = ['#FF0000','#FF5A04', '#FF9C00',
  '#FF8D73','#F8FFF3', '#fefefe',
  '#8c959c', '#E1775D','#FF9C51', '#C63524','#B7ACA6', '#FBFEC9'];
  const img = document.getElementById('fireImage');
  let canvas = document.getElementById('fireCanvasImage');

  $fire.passImageToCanvas = passImageToCanvas;
  $fire.findColorImage = findColorImage;
  $fire.fetchAllImagePixelColor = fetchAllImagePixelColor;
  return $fire;

  /**
   * Compare is a fire color
   * @return true is a fire color, false is not a fire color.
   * @author Jesus Perales.
   */
  function isFireColor(color){
    let isFound = fireColors.filter(
      (fireColor) => {return fireColor.toLowerCase() === color.toLowerCase();});
    return isFound.length > 0;
  }

  /**
   * Convert image (img with fireImage id) to canvas.
   * @author Jesus Perales.
   */
  function passImageToCanvas(){
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
  }

  function findColorImage(x, y){
    let data = canvas.getContext('2d').getImageData( x, y , 1, 1).data;
    let colorHexadecimal = rgbToHexadecimal(data);
    return colorHexadecimal;
  }

  /**
   * Get all colors pixels from canvas image
   * @return pixel to pixel color
   * @author Jesus Perales.
   * //TODO Change this implementation for use native RGBA or RGB colors and remove
   * // canvas manipulation.
   */
  function fetchAllImagePixelColor(){
    let data = canvas.getContext('2d').getImageData( 0, 0 , canvas.width, canvas.height);
    var ctx = canvas.getContext('2d');
    var pixels  = data.data;
    var imgPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for(var y = 0; y < imgPixels.height; y++){
      for(var x = 0; x < imgPixels.width; x++){
        var i = (y * 4) * imgPixels.width + x * 4;
        var rgb = [imgPixels.data[i], imgPixels.data[i + 1], imgPixels.data[i + 2], imgPixels.data[i + 3] ];
        var hex = rgbToHexadecimal(rgb);
        if(isFireColor(hex)){
          console.log('Encontrado');
          imgPixels.data[i] = 255;
          imgPixels.data[i + 1] = 255;
          imgPixels.data[i + 2] = 255;
        }else{
          imgPixels.data[i] = 0;
          imgPixels.data[i + 1] = 0;
          imgPixels.data[i + 2] = 0;
        }
      }
    }
    ctx.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
  }

  /**
   * Convert rgb color to hexadecimal colors
   * @param rgb array color rgb to convert.
   * @return hexadecimal color
   * @author Jesus Perales.
   */
  function rgbToHexadecimal(rgb){
   return (rgb && rgb.length === 4) ? "#" +
    ("0" + parseInt(rgb[0],10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) : '';
  }

})();
