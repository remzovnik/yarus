import { Feed } from "@/domain/Feed/Feed";
import { Ref } from "vue";

export default interface PeekFeedModalPropsModel {
  id: number;
  feedList: Ref<Feed[]>;
  feedLoaded: Ref<boolean>;
  intersectHandler: () => Promise<void>;
}
