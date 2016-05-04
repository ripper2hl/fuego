( () => {
  'use strict';

  $(function(){
      captureVideo();
  });

  /**
   * Capture video with web camera
   * @author Jesus Perales.
   */
  function captureVideo(){
     navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
     navigator.getUserMedia({video: true}, videoHandle, videoError);
  }

  /**
   * Catch the stream video by the web camera and
   * and begin the fire detection.
   * @author Jesus Perales.
   */
  function videoHandle(stream) {
      document.getElementById('video').src = window.URL.createObjectURL(stream);
      $fire.initDetectionFire();
  }

  function videoError(){
    console.error('Error video camera');
  }

})();
