import { Uuid } from "@/_core/Base.type";
import { PaginationModel } from "@/_core/models/PaginationModel";
import { BaseService } from "@/_core/service/BaseService";
import { appConfig } from "@/appConfig";
import { DeviceIdService } from "@/modules/DeviceId/DeviceIdService/DeviceId.service";
import useNotify from "@/modules/Main/components/toast/useNotify";
import { Album } from "@/modules/Music/domain/Album/Album";
import AlbumFactory from "@/modules/Music/domain/Album/Album.factory";
import { IDtoAlbum } from "@/modules/Music/domain/Album/DtoAlbum.interface";
import { Artist } from "@/modules/Music/domain/Artist/Artist";
import { ArtistFactory } from "@/modules/Music/domain/Artist/Artist.factory";
import { IDtoArtist } from "@/modules/Music/domain/Artist/DtoArtist.interface";
import { Category } from "@/modules/Music/domain/Category/Category";
import { CategoryFactory } from "@/modules/Music/domain/Category/Category.factory";
import { IDtoCategory } from "@/modules/Music/domain/Category/DtoCategory.interface";
import IDtoPlaylist from "@/modules/Music/domain/Playlist/DtoPlaylist.interface";
import { Playlist } from "@/modules/Music/domain/Playlist/Playlist";
import { PlaylistFactory } from "@/modules/Music/domain/Playlist/Playlist.factory";
import PlaylistSet from "@/modules/Music/domain/PlaylistSet/PlaylistSet";
import { PlaylistSetFactory } from "@/modules/Music/domain/PlaylistSet/PlaylistSetFactory";
import { IDtoTrack } from "@/modules/Music/domain/Track/DtoTrack.interface";
import { Track } from "@/modules/Music/domain/Track/Track";
import { TrackFactory } from "@/modules/Music/domain/Track/Track.factory";
import { ESortOrder } from "@/modules/Music/infrastructure/api/ESortOrder.enum";
import { ESortType } from "@/modules/Music/infrastructure/api/ESortType.enum";
import { IMusicApiResponse } from "@/modules/Music/infrastructure/api/IMusicApiResponse.interface";
import { IMusicSearchResponseData } from "@/modules/Music/infrastructure/api/IMusicSearchResponseData.interface";
import { IMusicSearchResponseResult } from "@/modules/Music/infrastructure/api/IMusicSearchResponseResult.interface";

import axios, { AxiosError, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from "axios";

export default class MusicApiService extends BaseService {
  private readonly artistFactory: ArtistFactory = new ArtistFactory();
  private readonly albumFactory: AlbumFactory = new AlbumFactory();
  private readonly playlistSetFactory: PlaylistSetFactory = new PlaylistSetFactory();
  private readonly playlistFactory: PlaylistFactory = new PlaylistFactory();
  private readonly categoryFactory: CategoryFactory = new CategoryFactory();
  private readonly trackFactory: TrackFactory = new TrackFactory();
  private readonly deviceIdService = new DeviceIdService();
  private readonly notify = useNotify();
  private readonly musicApiHeaders: AxiosRequestHeaders = {
    "X-APP": appConfig.musicApi.xApp,
    "X-API-KEY": appConfig.musicApi.xApiKey,
    "X-DEVICE-ID": this.deviceIdService.getDeviceId(),
  };

  private readonly musicApiInstance = axios.create({ baseURL: appConfig.musicApi.url });

  async getMusicSearchResult(pagination: PaginationModel, query = ""): Promise<IMusicSearchResponseResult | null> {
    const config: AxiosRequestConfig = {
      params: {
        limit: pagination.perPage,
        offset: pagination.currentPage * pagination.perPage,
        query,
      },
    };
    const response = await this.musicRequest<IMusicSearchResponseData>("/search", config);
    const hasSomeEntries = Object.values(response).some(
      (entriesArray: Array<IDtoAlbum | IDtoTrack | IDtoArtist | IDtoPlaylist>) => entriesArray.length
    );
    if (hasSomeEntries) {
      return {
        playlist: this.playlistFactory.createCollection(response.playlist),
        artist: this.artistFactory.createCollection(response.artist),
        album: this.albumFactory.createCollection(response.release),
        track: this.trackFactory.createCollection(response.track),
      };
    }
    return null;
  }
  async getSetList(pagination: PaginationModel): Promise<PlaylistSet[]> {
    const config: AxiosRequestConfig = {
      params: {
        limit: pagination.perPage,
        offset: pagination.currentPage * pagination.perPage,
        set: 1,
      },
    };
    const dtoList: IDtoPlaylist[] = await this.musicRequest<IDtoPlaylist[]>("/playlist", config, false);
    return this.playlistSetFactory.createCollection(dtoList);
  }

  async getSetById(setId: Uuid): Promise<PlaylistSet | null> {
    const dto: IDtoPlaylist | null = await this.musicRequest<IDtoPlaylist>(`/playlist/${setId}`);
    return dto ? this.playlistSetFactory.create(dto) : null;
  }

  async getPlaylistList(pagination: PaginationModel): Promise<Playlist[]> {
    const config: AxiosRequestConfig = {
      params: {
        limit: pagination.perPage,
        offset: pagination.currentPage * pagination.perPage,
        set: 0,
      },
    };
    const dtoList: IDtoPlaylist[] = await this.musicRequest<IDtoPlaylist[]>("/playlist", config, false);
    return this.playlistFactory.createCollection(dtoList);
  }

  async getPlaylistListByCategoryId(categoryId: Uuid, pagination: PaginationModel): Promise<Playlist[]> {
    const config: AxiosRequestConfig = {
      params: {
        limit: pagination.perPage,
        offset: pagination.currentPage * pagination.perPage,
      },
    };
    const dtoList: IDtoPlaylist[] = await this.musicRequest<IDtoPlaylist[]>(`/playlist/selection/${categoryId}`, config, false);
    return this.playlistFactory.createCollection(dtoList);
  }

  async getPlaylistById(playlistId: Uuid): Promise<Playlist | null> {
    const dto: IDtoPlaylist | null = await this.musicRequest<IDtoPlaylist>(`/playlist/${playlistId}`);
    return dto ? this.playlistFactory.create(dto) : null;
  }

  async getCategoryList(pagination: PaginationModel): Promise<Category[]> {
    const config: AxiosRequestConfig = {
      params: {
        limit: pagination.perPage,
        offset: pagination.currentPage * pagination.perPage,
      },
    };
    const dtoList: IDtoCategory[] = await this.musicRequest<IDtoCategory[]>("/selection", config, false);
    return this.categoryFactory.createCollection(dtoList);
  }

  async getCategoryById(categoryId: Uuid): Promise<Category | null> {
    const dto: IDtoCategory | null = await this.musicRequest<IDtoCategory>(`/selection/${categoryId}`);
    return dto ? this.categoryFactory.create(dto) : null;
  }

  async getArtistList(pagination: PaginationModel): Promise<Artist[]> {
    const config: AxiosRequestConfig = {
      params: {
        limit: pagination.perPage,
        offset: pagination.currentPage * pagination.perPage,
      },
    };
    const dtoList: IDtoArtist[] = await this.musicRequest<IDtoArtist[]>("/artist/top", config, false);
    return this.artistFactory.createCollection(dtoList);
  }

  async getArtistById(artistId: Uuid): Promise<Artist | null> {
    const dto: IDtoArtist | null = await this.musicRequest<IDtoArtist>(`/artist/${artistId}`);
    return dto ? this.artistFactory.create(dto) : null;
  }

  async getNewAlbumList(pagination: PaginationModel): Promise<Album[]> {
    const config: AxiosRequestConfig = {
      params: {
        limit: pagination.perPage,
        offset: pagination.currentPage * pagination.perPage,
      },
    };
    const dtoList: IDtoAlbum[] = await this.musicRequest<IDtoAlbum[]>("/release", config, false);
    return await this.prepareAlbumListData(this.albumFactory.createCollection(dtoList));
  }

  async getTopAlbumList(pagination: PaginationModel): Promise<Album[]> {
    const config: AxiosRequestConfig = {
      params: {
        limit: pagination.perPage,
        offset: pagination.currentPage * pagination.perPage,
      },
    };
    const dtoList: IDtoAlbum[] = await this.musicRequest<IDtoAlbum[]>("/release/top", config, false);
    return await this.prepareAlbumListData(this.albumFactory.createCollection(dtoList));
  }

  async getAlbumsByArtistId(artistId: Uuid, pagination: PaginationModel, sortType = ESortType.RECORD_DATE): Promise<Album[]> {
    const config: AxiosRequestConfig = {
      params: {
        limit: pagination.perPage,
        offset: pagination.currentPage * pagination.perPage,
        sortOrder: ESortOrder.DESC,
        sortType: sortType,
      },
    };
    const dtoList: IDtoAlbum[] = await this.musicRequest<IDtoAlbum[]>(`/release/artist/${artistId}`, config, false);
    return await this.prepareAlbumListData(this.albumFactory.createCollection(dtoList));
  }
  async getAlbumById(albumId: Uuid): Promise<Album | null> {
    const dto: IDtoAlbum | null = await this.musicRequest<IDtoAlbum>(`/release/${albumId}`);
    return dto ? this.albumFactory.create(dto) : null;
  }

  async getTracksByArtistId(artistId: Uuid, pagination: PaginationModel): Promise<Track[]> {
    const config: AxiosRequestConfig = {
      params: {
        limit: pagination.perPage,
        offset: pagination.currentPage * pagination.perPage,
      },
    };

    const dtoList: IDtoTrack[] = await this.musicRequest<IDtoTrack[]>(`/track/artist/${artistId}`, config, false);
    return this.trackFactory.createCollection(dtoList);
  }

  async getAllTracksByAllCategories(pagination: PaginationModel): Promise<Track[]> {
    const config: AxiosRequestConfig = {
      params: {
        limit: pagination.perPage,
        offset: pagination.currentPage * pagination.perPage,
      },
    };
    const dtoList: IDtoTrack[] = await this.musicRequest<IDtoTrack[]>(`/track/selection`, config, false);
    return this.trackFactory.createCollection(dtoList);
  }

  async getTracksByCategory(categoryId: Uuid, pagination: PaginationModel): Promise<Track[]> {
    const config: AxiosRequestConfig = {
      params: {
        limit: pagination.perPage,
        offset: pagination.currentPage * pagination.perPage,
      },
    };
    const dtoList: IDtoTrack[] = await this.musicRequest<IDtoTrack[]>(`/track/selection/${categoryId}`, config, false);
    return this.trackFactory.createCollection(dtoList);
  }

  async getTracksByAlbumId(albumId: Uuid, pagination: PaginationModel): Promise<Track[]> {
    const config: AxiosRequestConfig = {
      params: {
        limit: pagination.perPage,
        offset: pagination.currentPage * pagination.perPage,
      },
    };
    const dtoList: IDtoTrack[] = await this.musicRequest<IDtoTrack[]>(`/track/release/${albumId}`, config, false);
    return this.trackFactory.createCollection(dtoList);
  }

  async getTracksByPlaylistId(playlistId: Uuid, pagination: PaginationModel): Promise<Track[]> {
    const config: AxiosRequestConfig = {
      params: {
        limit: pagination.perPage,
        offset: pagination.currentPage * pagination.perPage,
      },
    };
    const dtoList: IDtoTrack[] = await this.musicRequest<IDtoTrack[]>(`/track/playlist/${playlistId}`, config, false);
    return this.trackFactory.createCollection(dtoList);
  }
  async getRandomTrackByPlaylistId(playlistId: Uuid): Promise<Track | null> {
    const dto: IDtoTrack[] = await this.musicRequest<IDtoTrack[]>(`/track/playlist/${playlistId}/random`, undefined, false);
    return dto.length ? this.trackFactory.create(dto[0]) : null;
  }
  async getRandomTrackByArtistId(artistId: Uuid): Promise<Track | null> {
    const dto: IDtoTrack[] = await this.musicRequest<IDtoTrack[]>(`/track/artist/${artistId}/random`, undefined, false);
    return dto.length ? this.trackFactory.create(dto[0]) : null;
  }
  async prepareAlbumListData(data: Album[]): Promise<Album[]> {
    if (!data.length) {
      return data;
    }
    const config: AxiosRequestConfig = {
      params: {
        limit: data.length,
        offset: 0,
        artistUuidList: data.map((item) => item.artistUuid),
      },
    };
    const dtoArtistList: IDtoArtist[] = await this.musicRequest<IDtoArtist[]>("/artist", config, false);
    const artistList = this.artistFactory.createCollection(dtoArtistList);
    return data.map((album) => {
      const artist = artistList.find((iter) => album.artistUuid === iter.id);
      album.setArtistName(artist?.title);
      return album;
    });
  }

  private async musicRequest<T>(url: string, config?: AxiosRequestConfig, returnFalseIfFail = true): Promise<T> {
    try {
      const axiosConfig: AxiosRequestConfig = {
        headers: this.musicApiHeaders,
      };

      const response: AxiosResponse<IMusicApiResponse<T>> = await this.musicApiInstance.get<IMusicApiResponse<T>>(url, {
        ...axiosConfig,
        ...config,
      });
      return response.data?.data;
    } catch (error: any) {
      this.showErrorAlert(error);
      return returnFalseIfFail ? null : error.request.data;
    }
  }

  private showErrorAlert(error: AxiosError) {
    this.notify.message(true, "false", "Произошла ошибка");
    console.log(error.message);
  }
}
