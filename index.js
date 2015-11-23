(function(){
  'use strict';

  if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', function () {
        accelEvent([event.acceleration.x * 2, event.acceleration.y * 2]);
    }, true);
  }

  var accelEvent = function(motion){
    if(euclideanDistance(motion,[0,0])>5){
      console.log(motion);
    }
  };

  var euclideanDistance = function(a,b){
    return Math.sqrt(Math.pow(a[0]-b[0],2)+Math.pow(a[1]-b[1],2));
  };
})();
