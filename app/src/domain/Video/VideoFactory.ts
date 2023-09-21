import { IVideoDto } from "@/domain/Video/IVideoDto";
import { Video } from "@/domain/Video/Video";
import { IVideoCardDto } from "@/domain/Video/IVideoCardDto";
import { IVideoCard } from "@/domain/Video/IVideoCard";
import { FullMetricsFactory } from "@/domain/Metrics/FullMetrics/FullMetrics.factory";
import { MetricsFactory } from "@/domain/Metrics/Metrics/Metrics.factory";
import { UserFactory } from "@/domain/User/User.factory";

export class VideoFactory {
  public readonly _userFactory: UserFactory;
  public readonly _metricsFactory: MetricsFactory;
  public readonly _fullMetricsFactory: FullMetricsFactory;

  create(dto: IVideoDto): Video {
    return new Video(dto, this._userFactory, this._metricsFactory, this._fullMetricsFactory);
  }

  createCard(cardDto: IVideoCardDto): IVideoCard {
    return {
      type: cardDto.type,
      model: this.create(cardDto.model),
    };
  }

  createCollection(collectionDto: IVideoDto[]): Video[] {
    return collectionDto.map((item) => {
      return this.create(item);
    });
  }

  createCardCollection(collectionCardDto: IVideoCardDto[]): IVideoCard[] {
    return collectionCardDto.map((item) => {
      return this.createCard(item);
    });
  }

  constructor(userFactory: UserFactory, metricsFactory: MetricsFactory, fullMetricsFactory: FullMetricsFactory) {
    this._userFactory = userFactory;
    this._fullMetricsFactory = fullMetricsFactory;
    this._metricsFactory = metricsFactory;
  }
}
