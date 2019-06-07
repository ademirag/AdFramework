/*

UI independent ticker.

*/

const animations = [];

let tickerInterval = null;

let easingFunctions = {
  // no easing, no acceleration
  linear: function(t) {
    return t;
  },
  // accelerating from zero velocity
  easeInQuad: function(t) {
    return t * t;
  },
  // decelerating to zero velocity
  easeOutQuad: function(t) {
    return t * (2 - t);
  },
  // acceleration until halfway, then deceleration
  easeInOutQuad: function(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },
  // accelerating from zero velocity
  easeInCubic: function(t) {
    return t * t * t;
  },
  // decelerating to zero velocity
  easeOutCubic: function(t) {
    return --t * t * t + 1;
  },
  // acceleration until halfway, then deceleration
  easeInOutCubic: function(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  },
  // accelerating from zero velocity
  easeInQuart: function(t) {
    return t * t * t * t;
  },
  // decelerating to zero velocity
  easeOutQuart: function(t) {
    return 1 - --t * t * t * t;
  },
  // acceleration until halfway, then deceleration
  easeInOutQuart: function(t) {
    return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
  },
  // accelerating from zero velocity
  easeInQuint: function(t) {
    return t * t * t * t * t;
  },
  // decelerating to zero velocity
  easeOutQuint: function(t) {
    return 1 + --t * t * t * t * t;
  },
  // acceleration until halfway, then deceleration
  easeInOutQuint: function(t) {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
  }
};

export class AdTicker {
  static start(dur, easing, onTick, onComplete = null) {
    animations.push({
      start: 0,
      end: 1,
      easing: easing,
      dur: dur,
      onTick: onTick,
      onComplete: onComplete,
      startOn: Date.now()
    });

    if (tickerInterval === null) {
      tickerInterval = setInterval(AdTicker._onTick, 1000 / 60);
    }
  }

  static _onTick() {
    for (let i = 0; i < animations.length; i++) {
      let a = animations[i];
      let n = Date.now();
      let p1 = (n - a.startOn) / (a.dur * 1000);
      let p, fp;

      if (p1 < 1.0) {
        p = easingFunctions[a.easing](p1);
        fp = (a.end - a.start) * p + a.start;
      } else {
        fp = 1;
      }

      if (fp <= 1) a.onTick(fp);

      if (fp >= 1) {
        if (a.onComplete !== null) {
          a.onComplete();
        }
        animations.splice(i, 1);

        if (animations.length === 0) {
          clearInterval(tickerInterval);
          tickerInterval = null;
        }
      }
    }
  }
}
