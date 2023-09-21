import { Emotion, Emotions } from "./EmotionModel";

export interface Metrics {
  emotion: Emotion;
  comments: number;
  views: number;
}

export interface Metric {
  id: number;
  count: number;
}

export class MetricsFull {
  emotions: Emotions;
  comments: number;
  views: number;
}
