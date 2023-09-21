import { IPostDto } from "@/domain/Post/IPostDto";
import { Post } from "@/domain/Post/Post";
import { IPostCard } from "@/domain/Post/IPostCard";
import { IPostCardDto } from "@/domain/Post/IPostCardDto";
import { FullMetricsFactory } from "@/domain/Metrics/FullMetrics/FullMetrics.factory";
import { MetricsFactory } from "@/domain/Metrics/Metrics/Metrics.factory";
import { UserFactory } from "@/domain/User/User.factory";
import { FeedFactory } from "@/domain/Feed/Feed.factory";

export class PostFactory {
  public readonly _userFactory: UserFactory;
  public readonly _feedFactory: FeedFactory;
  public readonly _metricsFactory: MetricsFactory;
  public readonly _fullMetricsFactory: FullMetricsFactory;

  create(cardDto: IPostDto): Post {
    return new Post(cardDto, this._userFactory, this._feedFactory, this._metricsFactory, this._fullMetricsFactory);
  }

  createCard(cardDto: IPostCardDto): IPostCard {
    return {
      type: cardDto.type,
      model: this.create(cardDto.model),
    };
  }

  createCollection(collectionDto: IPostDto[]): Post[] {
    return collectionDto.map((item) => {
      return this.create(item);
    });
  }

  createCardCollection(collectionCardDto: IPostCardDto[]): IPostCard[] {
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
