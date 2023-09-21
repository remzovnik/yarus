import { LOGO_SERVICE_CONFIG_PROMO } from "@/modules/Logo/logoService.config";
import { ILogoConfigItem } from "@/modules/Logo/logoService.types";

export class LogoService {
  private readonly isWhite: boolean = false;
  private readonly BASE_LOGO_URL: string = "/logo.svg";
  private readonly BASE_WHITE_LOGO_URL: string = "/images/app/logo.svg";
  private readonly BASE_LOGO_ALT: string = "Yarus";
  private readonly promoConfig = LOGO_SERVICE_CONFIG_PROMO;

  constructor(isWhite?: boolean) {
    this.isWhite = !!isWhite;
  }
  get currentDate(): number {
    return new Date().getTime();
  }

  get isPromo(): boolean {
    return !!this.currentPromo;
  }

  get currentPromo(): ILogoConfigItem | undefined {
    return this.promoConfig.find((promo: ILogoConfigItem) => {
      return new Date(...promo.startTime).getTime() < this.currentDate && this.currentDate < new Date(...promo.endTime).getTime();
    });
  }

  get logoUrl(): string {
    if (this.currentPromo) {
      return this.isWhite ? this.currentPromo.urlLogoWhite : this.currentPromo.urlLogo;
    }
    return this.isWhite ? this.BASE_WHITE_LOGO_URL : this.BASE_LOGO_URL;
  }

  get logoAlt(): string {
    if (this.currentPromo) {
      return this.currentPromo.alt;
    }
    return this.BASE_LOGO_ALT;
  }
}
