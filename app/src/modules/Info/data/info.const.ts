import { appConfig } from "@/appConfig";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { IDocumentInfo } from "@/modules/Info/types/Info.types";

export const INFO_PAGE_TITLE: string = "Информация о правилах работы социальной сети ЯRUS";
export const INFO_PAGE_DESCRIPTION: string =
  "Пользовательское соглашение. Политика конфиденциальности. Обработка персональных данных. Руководство по эксплуатации. Функциональные характеристики. Брендбук. Оферта об условиях предоставления (начисления) Монеток для публикаций блогеров. Лицензионное соглашение. Правила размещения рекламных объявлений.";

export const INFO_PAGE_LIST: IDocumentInfo[] = [
  {
    id: "agreement",
    title: "Пользовательское соглашение",
    href: appConfig.docUrl.agreement,
    iconName: "news",
  },
  {
    id: "confidency",
    title: "Политика конфиденциальности",
    href: appConfig.docUrl.confidency,
    iconName: "news",
    route: { name: ERouteName.CONFIDENCY },
  },
  {
    id: "policy",
    title: "Политика в отношении обработки персональных данных",
    href: appConfig.docUrl.policy,
    iconName: "news",
  },
  {
    id: "personal",
    title: "Согласие на обработку персональных данных",
    href: appConfig.docUrl.personal,
    iconName: "news",
  },
  {
    id: "verification",
    title: "Правила верификации аккаунта в «ЯRUS»",
    href: appConfig.docUrl.verification,
    iconName: "news",
  },
  {
    id: "manual",
    title: "Руководство по эксплуатации мобильного приложения «ЯRUS»",
    href: appConfig.docUrl.manual,
    iconName: "news",
  },
  {
    id: "functional",
    title: "Функциональные характеристики приложения «ЯRUS»",
    href: appConfig.docUrl.functional,
    iconName: "news",
  },
  {
    id: "brandbook",
    title: "Брендбук и фирменные ресурсы бренда «ЯRUS»",
    href: appConfig.docUrl.brandbook,
    iconName: "news",
  },
  {
    id: "coinsOffer",
    title: "Оферта об условиях предоставления (начисления) Монеток для публикаций блогеров в ЯRUS",
    href: appConfig.docUrl.coinsOffer,
    iconName: "news",
  },
  {
    id: "agreementToUse",
    title: "Лицензионное соглашение на использование программного обеспечения «ЯRUS»",
    href: appConfig.docUrl.agreementToUse,
    iconName: "news",
  },
  {
    id: "advertising",
    title: "Правила размещения рекламных объявлений в социальной платформе «ЯRUS»",
    href: appConfig.docUrl.advertising,
    iconName: "news",
  },
];
