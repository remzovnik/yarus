import { ref } from "vue";

export default () => {
  const imageWidth = ref<number>();
  const imageHeight = ref<number>();

  const getImageSize = (url: string | undefined): void => {
    if (!url) return;

    const img = new Image();
    img.addEventListener("load", () => {
      imageWidth.value = img.naturalWidth;
      imageHeight.value = img.naturalHeight;
    });
    img.src = url;
  };

  return { imageWidth, imageHeight, getImageSize };
};
