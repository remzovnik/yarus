import ClipModel from "@/modules/Clips/models/ClipModel";
import AudioUploadModel from "@/modules/Posting/models/AudioUploadModel";
import ContentItemModel from "@/modules/Posting/models/ContentItemModel";
import { EditClipModel } from "@/modules/Posting/models/EditClipModel";
import { EditVideoModel } from "@/modules/Posting/models/EditVideoModel";
import LinkModel from "@/modules/Posting/models/LinkModel";
import { PostingContentType } from "@/modules/Posting/models/PostingContentType";
import QuoteModel from "@/modules/Posting/models/QuoteModel";
import TextModel from "@/modules/Posting/models/TextModel";
import TitleModel from "@/modules/Posting/models/TitleModel";
import VideoUploadModel from "@/modules/Posting/models/VideoUploadModel";
import VideoModel from "@/modules/Video/models/VideoModel";

export class HashtagCountService {
  private readonly REG_EXP: RegExp = new RegExp(/#\S+/g);
  private readonly MAX_COUNT: number = 10;

  private get errorMessage(): string {
    return `У вас много хештегов, сократите до ${this.MAX_COUNT}`;
  }

  /** анализ постов */
  public checkPost(contentItemList: ContentItemModel[]): string {
    const count = contentItemList.reduce((acc, contentItem: ContentItemModel) => {
      switch (contentItem.type) {
        case PostingContentType.TITLE:
          return acc + (contentItem.data ? this.checkContentItemTitle(contentItem.data as TitleModel) : 0);
        case PostingContentType.TEXT:
          return acc + (contentItem.data ? this.checkContentItemText(contentItem.data as TextModel) : 0);
        case PostingContentType.IMAGE:
          return acc + (contentItem.data ? this.checkContentItemImage(contentItem.data as AudioUploadModel) : 0);
        case PostingContentType.VIDEO:
          return acc + (contentItem.data ? this.checkContentItemVideo(contentItem.data as VideoUploadModel) : 0);
        case PostingContentType.QUOTE:
          return acc + (contentItem.data ? this.checkContentItemQuote(contentItem.data as QuoteModel) : 0);
        case PostingContentType.LINK:
          return acc + (contentItem.data ? this.checkContentItemLink(contentItem.data as LinkModel) : 0);
        default:
          return acc;
      }
    }, 0);
    return count > this.MAX_COUNT ? this.errorMessage : "";
  }

  private checkContentItemTitle(titleItem: TitleModel): number {
    return this.getHashtagCount(titleItem.text);
  }

  private checkContentItemText(textItem: TextModel): number {
    return this.getHashtagCount(textItem.text);
  }

  private checkContentItemImage(imageItem: AudioUploadModel): number {
    return this.getHashtagCount(imageItem.name) + this.getHashtagCount(imageItem.artist);
  }

  private checkContentItemVideo(videoItem: VideoUploadModel): number {
    return (
      this.getHashtagCount(videoItem.name) +
      this.getHashtagCount(videoItem.description) +
      videoItem.tags.reduce((acc, tag: string) => {
        return acc + this.getHashtagCount(tag);
      }, 0)
    );
  }

  private checkContentItemQuote(quoteItem: QuoteModel): number {
    return this.getHashtagCount(quoteItem.text);
  }

  private checkContentItemLink(linkItem: LinkModel): number {
    return this.getHashtagCount(linkItem.text);
  }

  /** анализ строк */
  public checkString(checkedString: string): string {
    const count = this.getHashtagCount(checkedString);
    return count > this.MAX_COUNT ? this.errorMessage : "";
  }

  /** анализ видео */
  public checkVideo(video: VideoModel): string {
    let count = this.getHashtagCount(video.name);
    count = count + this.getHashtagCount(video.description);
    return count > this.MAX_COUNT ? this.errorMessage : "";
  }

  public checkEditVideo(editVideo: EditVideoModel): string {
    let countEditVideo = this.getHashtagCount(editVideo.title);
    countEditVideo = countEditVideo + this.getHashtagCount(editVideo.description);
    if (editVideo.video) {
      const videoMessage = this.checkVideo(editVideo.video);
      if (videoMessage) {
        return videoMessage;
      }
    }
    return countEditVideo > this.MAX_COUNT ? this.errorMessage : "";
  }

  public checkEditVideoList(editVideoList: EditVideoModel[]): boolean {
    return !editVideoList.every((editVideo: EditVideoModel): boolean => {
      return !!this.checkEditVideo(editVideo);
    });
  }

  /** анализ клипов */
  public checkClip(clip: ClipModel): string {
    const count = this.getHashtagCount(clip.description);
    return count > this.MAX_COUNT ? this.errorMessage : "";
  }

  public checkEditClip(editClip: EditClipModel): string {
    const count = this.getHashtagCount(editClip.description);
    if (editClip.clip) {
      const clipMessage = this.checkClip(editClip.clip);
      if (clipMessage) {
        return clipMessage;
      }
    }
    return count > this.MAX_COUNT ? this.errorMessage : "";
  }

  public checkEditClipList(editClipList: EditClipModel[]): boolean {
    return !editClipList.every((editClip: EditClipModel): boolean => {
      return !!this.checkEditClip(editClip);
    });
  }

  /** метод поиска количества хештегов */
  private getHashtagCount(value: string | null): number {
    if (typeof value !== "string") {
      return 0;
    }
    const result = value.match(this.REG_EXP);
    return result ? result.length : 0;
  }
}
