( () => {
  'use strict';
  $(function(){
    let options = {};
    options.canvasId = 'c';
    options.videoId = 'v';
    options.frequency = 100;
    options.urlSearchWorker = 'js/searchWorker.js';
    $fire.initDetectionFire(options);
  });
})();
