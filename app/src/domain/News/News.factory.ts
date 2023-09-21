import { NewsPreview } from "@/domain/News/NewsPreview";
import { INewsCard } from "@/domain/News/INewsCard";
import { INewsCardDto } from "@/domain/News/INewsCardDto";
import { INewsPreviewDto } from "@/domain/News/INewsPreviewDto";
import { EContentType } from "@/domain/Content/EContentType.enum";
import { FullMetricsFactory } from "@/domain/Metrics/FullMetrics/FullMetrics.factory";
import { MetricsFactory } from "@/domain/Metrics/Metrics/Metrics.factory";
import { FeedFactory } from "@/domain/Feed/Feed.factory";

export class NewsFactory {
  public readonly _metricsFactory: MetricsFactory;
  public readonly _fullMetricsFactory: FullMetricsFactory;
  public readonly _feedFactory: FeedFactory;

  create(dto: INewsPreviewDto): NewsPreview {
    return new NewsPreview(dto, this._feedFactory, this._metricsFactory, this._fullMetricsFactory);
  }

  createCard(cardDto: INewsCardDto): INewsCard {
    return {
      type: EContentType.NEWS,
      model: this.create(cardDto.model),
    };
  }

  createPreviewCollection(collectionCardDto: INewsPreviewDto[]): NewsPreview[] {
    return collectionCardDto.map((item) => {
      return this.create(item);
    });
  }

  createCardCollection(collectionCardDto: INewsCardDto[] | INewsPreviewDto[]): INewsCard[] {
    return collectionCardDto.map((item) => {
      return this.createCard(item);
    });
  }

  constructor(feedFactory: FeedFactory, metricsFactory: MetricsFactory, fullMetricsFactory: FullMetricsFactory) {
    this._fullMetricsFactory = fullMetricsFactory;
    this._metricsFactory = metricsFactory;
    this._feedFactory = feedFactory;
  }
}
