import { EmotionFactory } from "@/domain/Emotion/Emotion.factory";
import { IDtoEmotion } from "@/domain/Emotion/IDtoEmotion.interface";
import { IDtoMetrics } from "@/domain/Metrics/Metrics/IDtoMetrics.interface";

export class Metrics {
  public readonly comments: number;
  public readonly emotion: IDtoEmotion;
  public readonly shows: number;
  public readonly views: number;

  /** factory */
  public readonly _emotionFactory: EmotionFactory;

  constructor(dto: IDtoMetrics, emotionFactory: EmotionFactory) {
    /** set factory */
    this._emotionFactory = emotionFactory;

    this.comments = dto.comments;
    this.emotion = this._emotionFactory.create(dto.emotion);
    this.shows = dto.shows;
    this.views = dto.views;
  }
}
