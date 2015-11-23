(function(){
  'use strict';

  var targetChannel = null;
  var userChannel = null;

  var euclideanDistance = function(a,b){
    if(a.length != b.length){
      throw new Error('vectors differently sized');
    }
    var x = 0;
    for(var i = 0; i < a.length; i++){
      x+=Math.pow(a[i]-b[i],2);
    }
    return Math.sqrt(x);
  };

  var randomNormalisedVec3 = function(){
    return [Math.random(),Math.random(),Math.random()];
  };

  var normalisationVector = [1/360,1/360,1/180];
  var normalisationOffsetVector = [0,0.5,0.5];

  var normaliseOrientation = function(o){
    return [
      o[0]*normalisationVector[0]+normalisationOffsetVector[0],
      o[1]*normalisationVector[1]+normalisationOffsetVector[1],
      o[2]*normalisationVector[2]+normalisationOffsetVector[2],
    ];
  };

  var ac = new AudioContext();

  var ChannelSynth = function(pan){
    this.osc = ac.createOscillator();
    this.lfo = ac.createOscillator();
    this.fil = ac.createBiquadFilter();
    this.pan = ac.createStereoPanner();
    this.lfo.connect(this.osc.frequency);
    this.osc.connect(this.fil);
    this.fil.connect(this.pan);
    this.pan.connect(ac.destination);

    this.osc.type = 'square';
    this.lfo.type = 'sine';
    this.fil.Q.value = 30;

    this.lfo.start(0);
    this.osc.start(0);

    this.applyNormalisedParameterVector = function(vec){
      // DEBUGGING
      var log = false;
      for(var i = 0; i < vec.length; i++){
        if(!isFinite(vec[i])){
          log = true;
        }
      }
      if(log){
        console.log(vec);
      }
      // /DEBUGGING
      this.osc.frequency.value = 100+vec[0]*900;
      this.lfo.frequency.value = 10*vec[1];
      this.fil.frequency.value = 50+vec[2]*2000;
    };

    this.stop = function(){
      this.osc.stop();
    };

    this.pan.pan.value = pan==="left"?-0.999:0.999;
  };

  document.addEventListener('DOMContentLoaded',function(){
    console.log('documentReady');
    var resetTargetChannelParametersButton = document.createElement('button');
    resetTargetChannelParametersButton.appendChild(document.createTextNode('Reset'));
    var startSoundButton = document.createElement('button');
    startSoundButton.appendChild(document.createTextNode('Start'));
    resetTargetChannelParametersButton.addEventListener("click",function(){
      targetChannel.applyNormalisedParameterVector(randomNormalisedVec3());
    });
    startSoundButton.addEventListener("click",function(){
      if(targetChannel){
        targetChannel.stop();
        targetChannel = null;
      }
      if(userChannel){
        userChannel.stop();
        userChannel = null;
      }
      targetChannel = new ChannelSynth("right");
      userChannel = new ChannelSynth("left");

      targetChannel.applyNormalisedParameterVector(randomNormalisedVec3());

      var displayRanges = {
        alpha:document.getElementById('alpha'),
        beta:document.getElementById('beta'),
        gamma:document.getElementById('gamma')
      };

      if (window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", function () {
          var npv = normaliseOrientation([event.alpha,event.beta, event.gamma]);
          console.log(npv);
          userChannel.applyNormalisedParameterVector(npv);
          displayRanges.alpha.value = event.alpha;
          displayRanges.beta.value = event.beta;
          displayRanges.gamma.value = event.gamma;
        }, true);
      }
    });
    document.body.appendChild(resetTargetChannelParametersButton);
    document.body.appendChild(startSoundButton);
  });
})();
