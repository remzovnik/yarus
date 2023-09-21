import { IPhotoDto } from "@/domain/Photo/IPhotoDto";
import { Photo } from "@/domain/Photo/Photo";
import { IPhotoCard } from "@/domain/Photo/IPhotoCard";
import { IPhotoCardDto } from "@/domain/Photo/IPhotoCardDto";
import { FullMetricsFactory } from "@/domain/Metrics/FullMetrics/FullMetrics.factory";
import { MetricsFactory } from "@/domain/Metrics/Metrics/Metrics.factory";
import { UserFactory } from "@/domain/User/User.factory";
import { FeedFactory } from "@/domain/Feed/Feed.factory";

export class PhotoFactory {
  public readonly _userFactory: UserFactory;
  public readonly _feedFactory: FeedFactory;

  public readonly _metricsFactory: MetricsFactory;
  public readonly _fullMetricsFactory: FullMetricsFactory;

  create(dto: IPhotoDto): Photo {
    return new Photo(dto, this._userFactory, this._feedFactory, this._metricsFactory, this._fullMetricsFactory);
  }

  createCard(cardDto: IPhotoCardDto): IPhotoCard {
    return {
      type: cardDto.type,
      model: this.create(cardDto.model),
    };
  }

  createCollection(collectionDto: IPhotoDto[]): Photo[] {
    return collectionDto.map((item) => {
      return this.create(item);
    });
  }

  createCardCollection(collectionCardDto: IPhotoCardDto[]): IPhotoCard[] {
    return collectionCardDto.map((item) => {
      return this.createCard(item);
    });
  }

  constructor(
    userFactory: UserFactory,
    feedFactory: FeedFactory,
    metricsFactory: MetricsFactory,
    fullMetricsFactory: FullMetricsFactory
  ) {
    this._userFactory = userFactory;
    this._feedFactory = feedFactory;
    this._fullMetricsFactory = fullMetricsFactory;
    this._metricsFactory = metricsFactory;
  }
}
