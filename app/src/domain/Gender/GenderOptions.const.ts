import { EGender } from "@/domain/Gender/EGender.enum";
import { IRadio } from "@/infrastructure/Radio/IRadio.interface";

export const GENDER_OPTIONS: IRadio<EGender | null>[] = [
  { label: "Не выбрано", value: null },
  { label: "Мужской", value: EGender.MALE },
  { label: "Женский", value: EGender.FEMALE },
];
