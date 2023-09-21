import { JwtToken, Timestamp } from "@/modules/Auth/domain/Auth.interfaces";

export interface IDtoAuthTokensData {
  accessToken: JwtToken | null;
  accessTokenExp?: Timestamp;
  refreshToken: JwtToken | null;
  refreshTokenExp?: Timestamp;
}
