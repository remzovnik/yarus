import { appConfig } from "@/appConfig";
import { useBreakpoints } from "@vueuse/core";
import { Ref } from "vue";

export default () => {
  const breakpoints = useBreakpoints({
    laptop: appConfig.widthLaptop,
    mobile: appConfig.widthMobile,
    tablet: appConfig.widthTablet,
  });
  const isBigLaptop = breakpoints.greater("laptop");
  const isLaptop = breakpoints.greater("tablet");
  const isSmallLaptop: Ref<boolean> = breakpoints.smaller("laptop");
  const isTablet: Ref<boolean> = breakpoints.smaller("tablet");
  const isMobile: Ref<boolean> = breakpoints.smaller("mobile");
  return {
    isBigLaptop,
    isLaptop,
    isSmallLaptop,
    isTablet,
    isMobile,
  };
};
