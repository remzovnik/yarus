import { onActivated, ref, Ref, watch } from "vue";

export default (isDisabled: Ref<boolean>, animationTime = 0) => {
  const scrollPosition = ref(0);

  const handleScrollBehavior = (newVal: boolean): void => {
    const htmlTag = document.querySelector("html");
    const banner: Element | null = document.querySelector(".base-layout__banners");
    if (isDisabled.value && htmlTag) {
      scrollPosition.value = window.pageYOffset;
      setTimeout(() => {
        htmlTag.classList.add("disable-scroll");
      }, animationTime);

      if (banner) {
        (banner as HTMLElement).style.display = "none";
      }
    } else if (!isDisabled.value && htmlTag) {
      htmlTag.classList.remove("disable-scroll");
      window.scrollTo(0, scrollPosition.value);

      if (banner) {
        (banner as HTMLElement).style.display = "block";
      }
    }
  };

  onActivated(() => {
    handleScrollBehavior(isDisabled.value);
  });

  watch(
    () => isDisabled.value,
    (newVal) => {
      handleScrollBehavior(newVal);
    },
    { immediate: true }
  );
};
