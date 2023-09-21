import { IDtoTranslation } from "@/domain/Translation/IDtoTranslation.interface";
import { Translation } from "@/domain/Translation/Translation";
import { TRANSLATION_DTO_DEFAULT } from "@/domain/Translation/TranslationDtoDefault.const";

export class TranslationFactory {
  create(dto: IDtoTranslation): Translation {
    return new Translation(dto);
  }
  createDefault(): Translation {
    return new Translation(TRANSLATION_DTO_DEFAULT);
  }
}
