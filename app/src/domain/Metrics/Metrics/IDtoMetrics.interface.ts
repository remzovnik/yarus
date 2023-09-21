import { IDtoEmotion } from "@/domain/Emotion/IDtoEmotion.interface";

export interface IDtoMetrics {
  comments: number;
  emotion: IDtoEmotion;
  shows: number;
  views: number;
}
