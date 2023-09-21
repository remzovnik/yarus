const loadClassesName = ["loading-image"];
const loadedClassesName = ["loaded-image"];

const options = {
  root: null,
  rootMargin: "200px",
  threshold: 0.0,
};

let observer = {
  observe(_target: HTMLElement) {},
};

observer = new IntersectionObserver((images, observer) => {
  images.forEach((iter) => {
    if (iter.isIntersecting) {
      const lazyImg = iter.target;
      if (!!lazyImg) {
        const datasrc = lazyImg.getAttribute("data-src");
        if (!!datasrc && datasrc !== "null" && datasrc !== "undefined") {
          lazyImg.setAttribute("src", datasrc || "");
        }

        const onLoaded = () => {
          lazyImg.setAttribute("data-loaded", "true");
          lazyImg.removeAttribute("data-src");
          lazyImg.removeAttribute("data-src-default");
          lazyImg.classList.remove(...loadClassesName);
          lazyImg.classList.add(...loadedClassesName);
        };

        lazyImg.addEventListener("load", onLoaded);
        lazyImg.addEventListener("loadeddata", onLoaded);
      }

      observer.unobserve(lazyImg);
    }
  });
}, options);

export const observe = (target: HTMLElement) => {
  const lazyImg = target;
  const datasrcdefault = target.getAttribute("data-src-default");
  if (!!datasrcdefault && datasrcdefault !== "null" && datasrcdefault !== "undefined") {
    lazyImg.setAttribute("src", datasrcdefault || "");
  } else {
    target.classList.add(...loadClassesName);
  }

  observer.observe(target);
};

export const lazySrcDirective = {
  beforeMount(el, binding) {
    if (el.setAttribute) {
      if (!el.getAttribute("alt")) {
        el.setAttribute("alt", " ");
      }
      if (!el.getAttribute("data-src")) {
        el.setAttribute("data-src", binding.value);
      }
    }
    observe(el);
  },
  updated(el, binding) {
    if (binding.oldValue !== binding.value) {
      el.setAttribute("data-src", binding.value);
      el.setAttribute("src", binding.value);
    }
  },
};
