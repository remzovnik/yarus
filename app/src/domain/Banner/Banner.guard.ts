import { Banner } from "@/domain/Banner/Banner";

export const isBannerGuard = (model: unknown): model is Banner => {
  return model instanceof Banner;
};
