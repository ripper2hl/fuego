var $fire = ( () => {
  'use strict';

  var $fire = {};
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
  'rgb(247,103,1)'
  ];
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
        var r = imgPixels[i];
        var g = imgPixels[i + 1];
        var b = imgPixels[i + 2];
        var rgb = 'rgb(' + r + ',' + g + ',' + b  +')';
        if(isFireColor(rgb)){
          var pixelFire = { color : { } };
          pixelFire.x = x;
          pixelFire.y = y;
          pixelFire.color.rgb = rgb;
          notifyNotWork(pixelFire);
          deferred.notify(pixelFire);
        }
        if( x  === canvas.width && y === canvas.height){
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
   * Detects fire on video and mark the position inside
   * @author Jesus Perales.
   */
  function detectFire(){
    let maximumAxisX;
    let maximumAxisY;
    let minimumAxisX;
    let minimumAxisY;
    let flagFirstTime = true;
    $fire.fetchPixelsWhitFire(function (pixelFire){
      if(flagFirstTime){
        maximumAxisX = pixelFire.x;
        minimumAxisX = pixelFire.x;
        maximumAxisY = pixelFire.y;
        minimumAxisY = pixelFire.y;
        flagFirstTime = false;
      }else{
        maximumAxisX = Math.max( maximumAxisX, pixelFire.x );
        minimumAxisX = Math.min( minimumAxisX, pixelFire.x );
        maximumAxisY = Math.max( maximumAxisY, pixelFire.y );
        minimumAxisY = Math.min( minimumAxisY, pixelFire.y );
      }
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
      canvas.width = video.videoWidth > 0 ?  video.videoWidth:640;
      canvas.height = video.videoHeight > 0 ? video.videoHeigth:480;
      setInterval(function() {
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
