import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText);

const ANIMATION = {
  page: {
    duration: 1.2,
    ease: "expo.out",
  },
  load: {
    duration: 0.6,
    ease: "linear",
    delay: 0.5,
  },
};

const def = {
  duration: 1,
  ease: "expo.out",
};

gsap.defaults(def);

const utils = {};

export default gsap;
export { def, utils, ScrollTrigger, SplitText };

export { ANIMATION };
