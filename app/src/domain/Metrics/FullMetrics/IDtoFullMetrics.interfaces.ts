import { EEmotionId } from "@/domain/Emotion/EEmotionId.enum";
import { IDtoEmotion } from "@/domain/Emotion/IDtoEmotion.interface";

export interface IDtoFullMetrics {
  comments: number;
  emotions: {
    metrics: [IDtoEmotion, IDtoEmotion, IDtoEmotion, IDtoEmotion, IDtoEmotion];
    userEmotion: null | EEmotionId;
  };
  views: number;
}
