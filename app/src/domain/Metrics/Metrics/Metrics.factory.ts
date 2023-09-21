import { EmotionFactory } from "@/domain/Emotion/Emotion.factory";
import { IDtoMetrics } from "@/domain/Metrics/Metrics/IDtoMetrics.interface";
import { Metrics } from "@/domain/Metrics/Metrics/Metrics";

export class MetricsFactory {
  /** factories */
  public readonly _emotionFactory: EmotionFactory;

  constructor(emotionFactory: EmotionFactory) {
    /** set factories */
    this._emotionFactory = emotionFactory;
  }

  create(dto: IDtoMetrics): Metrics {
    return new Metrics(dto, this._emotionFactory);
  }

  createCollection(dtoList: IDtoMetrics[]): Metrics[] {
    return dtoList.map((dto: IDtoMetrics) => {
      return this.create(dto);
    });
  }
}
