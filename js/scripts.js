gsap.registerPlugin(ScrollTrigger);


(function () {
  var bodyScroll = new LocomotiveScroll({
    el: document.querySelector("[data-scroll-container]"),
    smooth: true,
    lerp: 0.07
  });
})();

$(window).on("load", function (e) {
  setTimeout(function () {
    $(".loader").addClass("animate");
  }, 2000);
});


function initScrollLetters() {
  // Scrolling Letters Both Direction
  // https://codepen.io/GreenSock/pen/rNjvgjo
  // Fixed example with resizing
  // https://codepen.io/GreenSock/pen/QWqoKBv?editors=0010

  let direction = 1; // 1 = forward, -1 = backward scroll

  console.log(direction);
  const roll1 = roll(".rollingText", { duration: 15 }),
    roll2 = roll(".rollingText02", { duration: 20 }, true),
    scroll = ScrollTrigger.create({
      trigger: document.querySelector('[data-scroll-container]'),
      onUpdate(self) {
        if (self.direction !== direction) {
          direction *= -1;
          console.log(direction);
          gsap.to([roll1, roll2], { timeScale: direction, overwrite: true });
        }
      },
    });

  // helper function that clones the targets, places them next to the original, then animates the xPercent in a loop to make it appear to roll across the screen in a seamless loop.
  function roll(targets, vars, reverse) {
    vars = vars || {};
    vars.ease || (vars.ease = "none");
    const tl = gsap.timeline({
        repeat: -1,
        onReverseComplete() {
          this.totalTime(this.rawTime() + this.duration() * 10); // otherwise when the playhead gets back to the beginning, it'd stop. So push the playhead forward 10 iterations (it could be any number)
        },
      }),
      elements = gsap.utils.toArray(targets),
      clones = elements.map((el) => {
        let clone = el.cloneNode(true);
        el.parentNode.appendChild(clone);
        return clone;
      }),
      positionClones = () =>
        elements.forEach((el, i) =>
          gsap.set(clones[i], {
            position: "absolute",
            overwrite: false,
            top: el.offsetTop,
            left: el.offsetLeft + (reverse ? -el.offsetWidth : el.offsetWidth),
          })
        );
    positionClones();
    elements.forEach((el, i) =>
      tl.to([el, clones[i]], { xPercent: reverse ? 100 : -100, ...vars }, 0)
    );
    window.addEventListener("resize", () => {
      let time = tl.totalTime(); // record the current time
      tl.totalTime(0); // rewind and clear out the timeline
      positionClones(); // reposition
      tl.totalTime(time); // jump back to the proper time
    });
    return tl;
  }
}

initScrollLetters();


ScrollTrigger.create({
  trigger: '.image-mask',
  scroller: '.main',
  start: 'top+=30% 50%',
  end: 'bottom-=40% 50%',
  animation: gsap.to('.image-mask', {backgroundSize: '120%'}),
  scrub: 2,
  // markers: true
})