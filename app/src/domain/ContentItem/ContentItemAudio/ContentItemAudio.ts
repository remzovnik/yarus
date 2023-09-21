import { Id } from "@/_core/Base.type";
import { Audio } from "@/domain/Audio/Audio";
import { AudioFactory } from "@/domain/Audio/Audio.factory";
import { IDtoContentItemAudio } from "@/domain/ContentItem/ContentItemAudio/IDtoContentItemAudio.interface";
import { EContentItemType } from "@/domain/ContentItem/EContentItemType.enum";

export class ContentItemAudio {
  public readonly id: Id;
  public readonly audio: Audio;
  public readonly type: EContentItemType.AUDIO;

  public readonly _audioFactory: AudioFactory;

  constructor(dto: IDtoContentItemAudio, audioFactory: AudioFactory) {
    /** set factory */
    this._audioFactory = audioFactory;

    this.id = dto.id;
    this.type = dto.type;
    this.audio = this._audioFactory.create(dto.audio);
  }
}
