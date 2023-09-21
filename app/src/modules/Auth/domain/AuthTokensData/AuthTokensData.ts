import { JwtToken, Timestamp } from "@/modules/Auth/domain/Auth.interfaces";
import { IDtoAuthTokensData } from "@/modules/Auth/domain/AuthTokensData/IDtoAuthTokensData.interface";

export class AuthTokensData {
  /** access */
  public readonly accessToken: JwtToken | null;
  public readonly accessTokenExpiresTimestamp?: Timestamp;
  public readonly accessTokenExpires?: Date;
  /** refresh */
  public readonly refreshToken: JwtToken | null;
  public readonly refreshTokenExpiresTimestamp?: Timestamp;
  public readonly refreshTokenExpires?: Date;

  constructor(dto: IDtoAuthTokensData) {
    this.accessToken = dto.accessToken;
    this.refreshToken = dto.refreshToken;
    if (dto.accessTokenExp) {
      this.accessTokenExpiresTimestamp = dto.accessTokenExp * 1000;
      this.accessTokenExpires = new Date(this.accessTokenExpiresTimestamp);
    }
    if (dto.refreshTokenExp) {
      this.refreshTokenExpiresTimestamp = dto.refreshTokenExp * 1000;
      this.refreshTokenExpires = new Date(this.refreshTokenExpiresTimestamp);
    }
  }
}
