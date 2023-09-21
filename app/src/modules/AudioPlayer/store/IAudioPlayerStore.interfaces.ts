import { PaginationModel } from "@/_core/models/PaginationModel";
import { IAudioPlaylist } from "@/domain/Audio/AudioPlaylist.interface";
import { IAudioTrack } from "@/domain/AudioTrack/AudioTrack.interface";
import { Uuid } from "@/modules/MediaLogger/domain/MediaLogger.types";
import { IMediaLoggerService } from "@/modules/MediaLogger/MediaLoggerService/IMediaLoggerService.interface";
import ITrackList from "@/modules/Music/infrastructure/TrackList.inrterface";
import { _GettersTree, StateTree } from "pinia";

export interface IAudioPlayerStoreState extends StateTree {
  isActive: boolean;
  playlist: IAudioPlaylist;
  tempPlaylist: IAudioPlaylist;
  shuffledPlaylist: IAudioPlaylist;
  currentAudio?: IAudioTrack;
  isPlaying: boolean;
  progress: number;
  radioProgress: number;
  volume: number;
  isShown: boolean;
  selectedTrackList: ITrackList | null;
  areTracksLoading: boolean;
  areTracksLoaded: boolean;
  tracksPagination: PaginationModel;
  mediaLogger: IMediaLoggerService;
  player?: HTMLAudioElement;
  currentSegmentId: null | Uuid;
  isLoop: boolean;
  isShuffled: boolean;
}

export interface IAudioPlayerStoreGetters extends _GettersTree<IAudioPlayerStoreState> {
  isCommonCategorySelectedTrackList: (state: IAudioPlayerStoreState) => boolean;
  isCategorySelectedTrackList: (state: IAudioPlayerStoreState) => boolean;
  indexCurrentAudio: (state: IAudioPlayerStoreState) => number;
  playlistItems: (state: IAudioPlayerStoreState) => IAudioTrack[];
  duration: (state: IAudioPlayerStoreState) => number;
  hasSomeNotRestrictedItem: (state: IAudioPlayerStoreState) => boolean;
  hasSomeNotRestrictedItemBeforeCurrentItem: (state: IAudioPlayerStoreState) => boolean;
  isRemoteShuffle: (state: IAudioPlayerStoreState) => boolean;
}

export interface IAudioPlayerStoreActions {
  addRandomTrackToShuffleList(): Promise<void>;

  clear(): void;

  getCurrentPosition(): number;

  hide(): void;

  initShufflePlayback(): Promise<void>;

  load(): void;

  mediaLoggerEndSession(): void;

  mediaLoggerStartSegment(): void;

  mediaLoggerStopSegment(): void;

  pause(): void;

  play(trackId): Promise<void>;

  selectTrackList(value: ITrackList | null, resetCurrentAudio?: boolean): Promise<void>;

  setCurrentAudio(audioTrack?: IAudioTrack): void;

  setNext(): Promise<void>;

  setPlayer(player: HTMLAudioElement): void;

  setPrev(): Promise<void>;

  setShuffledPlaylist(postId, title, items): void;

  setTempPlaylist(postId, title, items): void;

  show(): void;

  slideProgress(newValue: number): void;

  toggle(): void;

  toggleLoop(): void;

  toggleShuffle(): void;
}
