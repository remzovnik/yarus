import { PaginationModel } from "@/_core/models/PaginationModel";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { IAudioTrack } from "@/domain/AudioTrack/AudioTrack.interface";
import {
  IAudioPlayerStoreActions,
  IAudioPlayerStoreGetters,
  IAudioPlayerStoreState,
} from "@/modules/AudioPlayer/store/IAudioPlayerStore.interfaces";
import { EMediaContentType } from "@/modules/MediaLogger/domain/MediaContentType/EMediaContentType.enum";
import { useMediaLogger } from "@/modules/MediaLogger/useMediaLogger";
import { EMusicEntityType } from "@/modules/Music/domain/MusicEntityType.enum";
import shuffle from "@/modules/Music/infrastructure/shuffle";
import ITrackList from "@/modules/Music/infrastructure/TrackList.inrterface";
import MusicApiService from "@/modules/Music/MusicApiService";
import { defineStore } from "pinia";

export const useAudioStore = defineStore<
  "audioPlayer",
  IAudioPlayerStoreState,
  IAudioPlayerStoreGetters,
  IAudioPlayerStoreActions
>("audioPlayer", {
  state: (): IAudioPlayerStoreState => ({
    isActive: false,
    playlist: {
      entityTitle: "",
      postId: null,
      items: [],
    },
    tempPlaylist: {
      entityTitle: "",
      postId: null,
      items: [],
    },
    shuffledPlaylist: {
      entityTitle: "",
      postId: null,
      items: [],
    },
    currentAudio: undefined,
    isPlaying: false,
    progress: 0,
    radioProgress: 0,
    volume: 50,
    isShown: false,
    selectedTrackList: null,
    areTracksLoading: false,
    areTracksLoaded: false,
    tracksPagination: new PaginationModel(),
    player: undefined,
    mediaLogger: useMediaLogger(),
    currentSegmentId: null,
    isLoop: false,
    isShuffled: false,
  }),
  getters: {
    isRemoteShuffle: (state: IAudioPlayerStoreState): boolean => {
      return state.selectedTrackList
        ? [EMusicEntityType.PLAYLIST, EMusicEntityType.PLAYLIST_SET, EMusicEntityType.ARTIST].includes(
            state.selectedTrackList?.entityType
          )
        : false;
    },
    isCommonCategorySelectedTrackList: (state: IAudioPlayerStoreState): boolean => {
      return state.selectedTrackList?.id === "";
    },
    isCategorySelectedTrackList: (state: IAudioPlayerStoreState): boolean => {
      return state.selectedTrackList?.entityType === EMusicEntityType.CATEGORY;
    },
    indexCurrentAudio: (state: IAudioPlayerStoreState): number => {
      if (state.currentAudio) {
        if (state.isShuffled) {
          return state.shuffledPlaylist.items.indexOf(state.currentAudio);
        }
        // Проверяем что текущий трек находится только в шаффленном списке, хотя шафл уже выключен
        if (
          state.shuffledPlaylist.items.length &&
          state.shuffledPlaylist.items.indexOf(state.currentAudio) !== -1 &&
          state.playlist.items.indexOf(state.currentAudio) === -1
        ) {
          return -1;
        }
        return state.playlist.items.indexOf(state.currentAudio);
      }
      return 0;
    },
    playlistItems: (state: IAudioPlayerStoreState): IAudioTrack[] => {
      if (state.isShuffled) {
        return state.shuffledPlaylist.items;
      }
      return state.playlist.items;
    },
    duration: (state: IAudioPlayerStoreState): number => {
      return state.currentAudio?.duration || 0;
    },
    hasSomeNotRestrictedItem: (state: IAudioPlayerStoreState): boolean => {
      return state.playlist.items.some((item) => !item.isRestricted);
    },
    hasSomeNotRestrictedItemBeforeCurrentItem: (state: IAudioPlayerStoreState): boolean => {
      const index = state.currentAudio ? state.playlist.items.indexOf(state.currentAudio) : 0;
      return state.playlist.items.slice(0, index).some((item) => !item.isRestricted);
    },
  },
  actions: {
    setPlayer(player: HTMLAudioElement): void {
      this.player = player;
    },

    getCurrentPosition(): number {
      if (this.player) {
        return Math.round(this.player.currentTime * 1000);
      }
      return 0;
    },
    setTempPlaylist(postId, title: string, items): void {
      this.tempPlaylist = { postId: postId, entityTitle: title, items: items };
    },

    setShuffledPlaylist(postId, title: string, items): void {
      this.shuffledPlaylist = { postId: postId, entityTitle: title, items: items };
    },

    setCurrentAudio(audioTrack?: IAudioTrack): void {
      if (this.currentAudio) {
        this.mediaLoggerEndSession();
      }
      this.currentAudio = audioTrack;
      this.load();
    },

    async play(trackId): Promise<void> {
      if (this.currentAudio?.isRestricted) {
        if (this.hasSomeNotRestrictedItem) {
          return await this.setNext();
        } else {
          this.pause();
          this.isShown = false;
          return;
        }
      }
      if (this.playlist?.postId !== this.tempPlaylist.postId) {
        this.isPlaying = false;
        this.playlist = this.tempPlaylist;
      }

      if (!this.currentAudio) {
        this.setCurrentAudio(this.playlist.items.find((item) => item.id === trackId));
      }

      if (trackId !== this.currentAudio?.id) {
        this.isPlaying = false;
        this.setCurrentAudio(this.playlist.items.find((item) => item.id === trackId));
      }

      if (!this.isShown) {
        this.isShown = true;
      }
      if (this.player?.paused) {
        this.player
          ?.play()
          .then(() => {
            this.mediaLoggerStartSegment();
          })
          .catch(() => {});
      }

      this.isPlaying = true;
    },

    pause(): void {
      this.player?.pause();
      if (this.currentSegmentId) {
        this.mediaLoggerStopSegment();
      }
      this.currentSegmentId = null;
      this.isPlaying = false;
    },

    toggle(): void {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play(this.currentAudio?.id);
      }
    },

    slideProgress(newValue: number): void {
      if (this.player) {
        this.mediaLoggerStopSegment();
        const value = Math.floor(((this.currentAudio?.duration || 0) * +newValue) / 100);
        this.player.currentTime = value;
        this.progress = value;
        this.mediaLoggerStartSegment();
      }
    },

    load(): void {
      if (this.player) {
        this.player.load();
        this.player.currentTime = 0;
      }
    },

    hide(): void {
      this.pause();
      this.mediaLoggerEndSession();
      this.isPlaying = false;
      this.isShown = false;
    },

    show(): void {
      this.isShown = true;
    },

    clear(): void {
      this.setCurrentAudio(undefined);
      this.selectedTrackList = null;
      this.areTracksLoading = false;
      this.areTracksLoaded = false;
      this.tracksPagination = new PaginationModel();
    },

    async selectTrackList(trackList: ITrackList | null): Promise<void> {
      this.pause();
      if (this.selectedTrackList?.id && this.selectedTrackList?.id !== trackList?.id) {
        this.areTracksLoaded = false;
        this.isShuffled = false;
        this.shuffledPlaylist.items = [];
      }
      this.selectedTrackList = trackList;

      if (this.selectedTrackList?.tracks.length) {
        this.playlist.entityTitle = this.selectedTrackList.entityLabel;
        this.playlist.items = this.selectedTrackList.tracks;
        this.setCurrentAudio(this.selectedTrackList.tracks[0]);
        this.load();
        this.isShown = true;
        await this.play(this.selectedTrackList.tracks[0].id);
      } else {
        this.playlist.items = [];
        this.isShown = false;
      }
    },

    async setPrev(): Promise<void> {
      this.pause();
      if (this.currentAudio) {
        if (this.isRemoteShuffle) {
          await this.addRandomTrackToShuffleList();
        }
        this.setCurrentAudio(this.playlistItems[this.indexCurrentAudio - 1]);

        if (this.currentAudio.isRestricted) {
          return this.setPrev();
        }
      }
      this.load();
      this.play(this.currentAudio?.id);
    },

    async setNext(): Promise<void> {
      this.pause();
      if (this.currentAudio) {
        if (this.isRemoteShuffle) {
          await this.addRandomTrackToShuffleList();
        }
        if (this.indexCurrentAudio === this.playlistItems.length - 1) {
          this.setCurrentAudio(this.playlistItems[0]);
        } else {
          this.setCurrentAudio(this.playlistItems[this.indexCurrentAudio + 1]);
        }
        if (this.currentAudio.isRestricted) {
          return this.setNext();
        }
      }
      this.load();
      this.play(this.currentAudio?.id);
    },

    mediaLoggerStartSegment(): void {
      if (this.currentAudio?.id) {
        this.currentSegmentId = this.mediaLogger.startSegment(
          EMediaContentType.TRACK,
          this.currentAudio.id,
          this.getCurrentPosition()
        );
      }
    },

    async mediaLoggerStopSegment(): Promise<void> {
      if (this.currentAudio?.id) {
        this.mediaLogger.stopSegment(
          EMediaContentType.TRACK,
          this.currentAudio.id,
          this.getCurrentPosition(),
          this.currentSegmentId
        );
      }
    },

    async mediaLoggerEndSession(): Promise<void> {
      if (this.currentAudio?.id) {
        this.mediaLogger.endSession(EMediaContentType.TRACK, this.currentAudio.id);
      }
    },

    toggleLoop(): void {
      this.isLoop = !this.isLoop;
    },

    toggleShuffle(): void {
      this.isShuffled = !this.isShuffled;
    },

    async initShufflePlayback(): Promise<void> {
      if (this.currentAudio) {
        if (this.isRemoteShuffle && !this.areTracksLoaded) {
          this.setShuffledPlaylist(this.playlist.postId, this.playlist.entityTitle, [this.currentAudio]);
          await this.addRandomTrackToShuffleList();
        } else {
          let shuffledTracks: IAudioTrack[] = [];
          shuffledTracks = shuffle<IAudioTrack>([...this.playlist.items]).filter(
            (item: IAudioTrack): boolean => this.currentAudio?.id !== item.id
          );
          shuffledTracks.unshift(this.currentAudio);
          this.setShuffledPlaylist(this.playlist.postId, this.playlist.entityTitle, shuffledTracks);
        }
      }
    },

    async addRandomTrackToShuffleList(): Promise<void> {
      if (!this.selectedTrackList || this.areTracksLoaded) {
        return;
      }
      let track: IAudioTrack | null = null;
      switch (this.selectedTrackList.entityType) {
        case EMusicEntityType.ARTIST:
          track = await ServiceLocator.instance.getService(MusicApiService).getRandomTrackByArtistId(this.selectedTrackList.id);
          break;
        case EMusicEntityType.PLAYLIST:
        case EMusicEntityType.PLAYLIST_SET:
          track = await ServiceLocator.instance.getService(MusicApiService).getRandomTrackByPlaylistId(this.selectedTrackList.id);
          break;
      }
      if (track) {
        this.shuffledPlaylist.items.push(track);
      }
    },
  },
});
