import { ObjectDirective } from "vue";
import IMask from "imask";

const initMask = (el, opts) => {
  el.maskRef = IMask(el, opts)
    .on("accept", () => fireEvent(el, "accept", el.maskRef))
    .on("complete", () => fireEvent(el, "complete", el.maskRef));
};

const fireEvent = (el, eventName, data) => {
  const e = document.createEvent("CustomEvent");
  e.initCustomEvent(eventName, true, true, data);
  el.dispatchEvent(e);
};

const destroyMask = (el) => {
  if (el.maskRef) {
    el.maskRef.destroy();
    delete el.maskRef;
  }
};

const MaskDirective = (): ObjectDirective => ({
  beforeMount(el, binding) {
    if (!!binding?.value?.mask) {
      initMask(el, binding.value);
    }
  },

  updated(el, binding) {
    if (!!binding?.value?.mask) {
      if (!!el.maskRef) {
        el.maskRef.updateOptions(binding.value);
        if (el.value !== el.maskRef.value) el.maskRef._onChange();
      } else initMask(el, binding.value);
    } else {
      destroyMask(el);
    }
  },

  unmounted(el) {
    destroyMask(el);
  },
});

export default MaskDirective;
