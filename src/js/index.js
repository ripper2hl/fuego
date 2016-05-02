( () => {
  'use strict';

  $(function(){
      captureVideo();
  });

  function captureVideo(){
     navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
     navigator.getUserMedia({video: true}, videoHandle, videoError);
  }

  function videoHandle(stream) {
      document.getElementById('video').src = window.URL.createObjectURL(stream);
      $fire.initDetectionFire();
  }

  function videoError(){
    console.error('Error video camera');
  }

})();
