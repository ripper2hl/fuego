var $fire = ( () => {
  'use strict';

  var $fire = {};
  let video = document.getElementById('video');
  let canvas = document.getElementById('fireCanvasImage');
  $fire.initDetectionFire = initDetectionFire;
  return $fire;

  /**
   * Get all pixeles from canvas
   * @return all pixels information for canvas image
   * @author Jesus Perales.
   */
  function fetchPixelsImage(){
    let data = canvas.getContext('2d').getImageData( 0, 0 , canvas.width, canvas.height);
    var ctx = canvas.getContext('2d');
    return data.data;
  }

  /**
   * Drawn an rectangle on canvas image
   * with four points for the corners.
   * @param maximumAxisX point maximum on axis x
   * @param maximumAxisY point maximum on axis y
   * @param minimumAxisX point minimum on axis x
   * @param minimumAxisY point minimum on axis y
   * @author Jesus Perales.
   */
  function drawRectangle(maximumAxisX, maximumAxisY, minimumAxisX, minimumAxisY){
    let context = canvas.getContext('2d');
    context.lineWidth= 5 ;
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
    let flagFirstTime = true;
    fetchPixelsWhitFire( pixelFire => {}).then( result => {
      drawRectangle(result.maximumX, result.maximumY, result.minimumX, result.minimumY);
    });
  }

  /**
   * Find pixels with fire in image pixels
   * @param progress callback for notify the progress
   * @author Jesus Perales.
   */
  function fetchPixelsWhitFire(progress){
    return new Promise( (resolve, reject) => {
      let worker = new Worker('js/searchWorker.js');
      let imgInformation = {};
      imgInformation.imgPixels = fetchPixelsImage();
      imgInformation.canvas = {};
      imgInformation.canvas.height = canvas.height;
      imgInformation.canvas.width = canvas.width;
      worker.postMessage(imgInformation);
      worker.addEventListener('message', e => {
          worker.terminate();
          resolve(e.data);
      }, false);
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
      setInterval( () => {
        canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        callback();
      }, 100);
    }, false);
  }

  /**
   * Begin process for fire detection.
   * @author Jesus Perales.
   */
  function initDetectionFire(){
    passVideoToCanvas( detectFire );
  }

})();
