var $fire = ( () => {
  'use strict';

  var $fire = {};
  const fireColors = ['#FF0000','#FF5A04', '#FF9C00',
  '#FF8D73','#F8FFF3', '#fefefe','#FFFC14',
  '#8c959c', '#E1775D','#FF9C51', '#C63524','#B7ACA6',
  '#FBFEC9', '#EB4700', '#FFFEB9', '#FFFEDA', '#F76701'];
  let video = document.getElementById('video');
  let canvas = document.getElementById('fireCanvasImage');

  $fire.passVideoToCanvas = passVideoToCanvas;
  $fire.fetchPixelsImage = fetchPixelsImage;
  $fire.fetchPixelsWhitFire = fetchPixelsWhitFire;
  $fire.drawRectangle = drawRectangle;
  $fire.detectFire = detectFire;
  $fire.initDetectionFire = initDetectionFire;
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
   * get all pixeles from canvas
   */
  function fetchPixelsImage(){
    let data = canvas.getContext('2d').getImageData( 0, 0 , canvas.width, canvas.height);
    var ctx = canvas.getContext('2d');
    return data.data;
  }

  /**
   * Find pixels with fire in image pixels
   * @author Jesus Perales.
   */
  function fetchPixelsWhitFire(notifyNotWork){
    let deferred = jQuery.Deferred();
    let imgPixels = $fire.fetchPixelsImage();
    for(var y = 0; y < canvas.height; y++){
      for(var x = 0; x < canvas.width; x++){
        var i = (x + y * canvas.width) * 4;
        var rgba = [imgPixels[i], imgPixels[i + 1], imgPixels[i + 2], imgPixels[i + 3] ];
        var hex = rgbToHexadecimal(rgba);
        if(isFireColor(hex)){
          var pixelFire = { color : { } };
          pixelFire.x = x;
          pixelFire.y = y;
          pixelFire.color.hexadecimal = hex;
          pixelFire.color.rgba = rgba;
          notifyNotWork(pixelFire);
          deferred.notify(pixelFire);
        }
        if( (x + 1)  <= canvas.width && (y + 1) <= canvas.height){
          deferred.resolve();
        }
      }
    }
    return deferred.promise();
  }

  function drawRectangle(maximumAxisX, maximumAxisY, minimumAxisX, minimumAxisY){
    let context = canvas.getContext('2d');
    context.lineWidth=10;
    context.strokeStyle="green";
    context.beginPath();
    context.moveTo(minimumAxisX, minimumAxisY);
    context.lineTo(maximumAxisX, minimumAxisY);
    context.lineTo(maximumAxisX, maximumAxisY);
    context.lineTo(minimumAxisX, maximumAxisY);
    context.lineTo(minimumAxisX, minimumAxisY);
    context.stroke();
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

  /**
   * Detects fire on video and mark the position inside
   * @author Jesus Perales.
   */
  function detectFire(){
    let colors = [];
    let maximumAxisX = 0;
    let minimumAxisX = 1000;
    let maximumAxisY = 0;
    let minimumAxisY = 1000;
    $fire.fetchPixelsWhitFire(function (pixelFire){
      maximumAxisX = Math.max( maximumAxisX, pixelFire.x );
      minimumAxisX = Math.min( minimumAxisX, pixelFire.x );
      maximumAxisY = Math.max( maximumAxisY, pixelFire.y );
      minimumAxisY = Math.min( minimumAxisY, pixelFire.y );
    })
    .done(function(){
      $fire.drawRectangle(maximumAxisX, maximumAxisY, minimumAxisX, minimumAxisY);
    });
  }

  /**
   * Convert image (img with fireImage id) to canvas
   * @param callback function for after video is played //FIXME remove this function.
   * @author Jesus Perales.
   */
  function passVideoToCanvas(callback){
    video.addEventListener('play', () => {
      setInterval(function() {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        callback();
      }, 500);
    }, false);
  }

  /**
   * Begin process for fire detection.
   * @author Jesus Perales.
   */
  function initDetectionFire(){
    $fire.passVideoToCanvas($fire.detectFire);
  }

})();
