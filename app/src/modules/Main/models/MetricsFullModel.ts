interface Metric {
  id: number;
  count: number;
}

interface Emotions {
  userEmotion?: any;
  metrics: Metric[];
}

export default interface MetricsFull {
  emotions: Emotions;
  comments: number;
  views: number;
}
