import { HeadObject } from "@vueuse/head";

export default (): { metaTagNoindex: HeadObject } => {
  const metaTagNoindex: HeadObject = {
    meta: [
      {
        name: "robots",
        content: "noindex",
      },
    ],
  };
  return {
    metaTagNoindex,
  };
};
