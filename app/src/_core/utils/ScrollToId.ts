import { appConfig } from "@/appConfig";

export default (id: string): void => {
  const commentsEl = document.getElementById(id);

  if (commentsEl) {
    window.scrollTo({
      top: commentsEl.getBoundingClientRect().top + window.scrollY - appConfig.headerHeight,
      left: 0,
      behavior: "smooth",
    });
  }
};
