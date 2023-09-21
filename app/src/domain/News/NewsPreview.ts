import { Metrics, MetricsFull } from "@/modules/Main/models/MetricsModel";
import { INewsPreviewDto } from "@/domain/News/INewsPreviewDto";
import RouteModel from "@/modules/Main/models/RouteModel";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { kFormatter } from "@/_core/utils/Formaters";
import { dateDiff } from "@/_core/utils/DateUtils";
import { FullMetricsFactory } from "@/domain/Metrics/FullMetrics/FullMetrics.factory";
import { MetricsFactory } from "@/domain/Metrics/Metrics/Metrics.factory";
import { EContentType } from "@/domain/Content/EContentType.enum";
import { FeedFactory } from "@/domain/Feed/Feed.factory";
import { Feed } from "@/domain/Feed/Feed";

export class NewsPreview {
  public readonly id: number;
  public readonly feed: Feed;
  public readonly metrics: Metrics;
  public readonly metricsFull: MetricsFull;
  public readonly createDate: number;
  public readonly name: string;
  public readonly description: string;
  public readonly image?: string;

  public readonly _metricsFactory: MetricsFactory;
  public readonly _fullMetricsFactory: FullMetricsFactory;
  public readonly _feedFactory: FeedFactory;

  constructor(
    dto: INewsPreviewDto,
    feedFactory: FeedFactory,
    metricsFactory: MetricsFactory,
    fullMetricsFactory: FullMetricsFactory
  ) {
    this._fullMetricsFactory = fullMetricsFactory;
    this._metricsFactory = metricsFactory;
    this._feedFactory = feedFactory;

    this.id = dto.id;
    this.feed = this._feedFactory.create(dto.feed);
    this.metrics = this._metricsFactory.create(dto.metrics);
    this.metricsFull = this._fullMetricsFactory.create(dto.metricsFull);
    this.createDate = dto.createDate;
    this.name = dto.name;
    this.description = dto.description;
    this.image = dto.image;
  }

  get route(): RouteModel {
    return {
      name: ERouteName.NEWS_DETAIL,
      params: { id: this.id },
    };
  }

  get commentsRoute(): RouteModel {
    return { name: ERouteName.NEWS_DETAIL, params: { id: this.id }, hash: "#comments-section" };
  }

  get views(): string {
    return kFormatter(this.metricsFull?.views || 0);
  }

  get formattedCreateDate(): string {
    return dateDiff(this.createDate);
  }

  get contentType(): EContentType {
    return EContentType.NEWS;
  }
}
