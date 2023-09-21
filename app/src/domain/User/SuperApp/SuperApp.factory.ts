import { IDtoSuperApp } from "@/domain/User/SuperApp/IDtoSuperApp.interface";
import { SuperApp } from "@/domain/User/SuperApp/SuperApp";
import { SUPER_APP_DEFAULT_DTO } from "@/domain/User/SuperApp/SuperAppDefaultDto.const";

export class SuperAppFactory {
  create(dto: IDtoSuperApp): SuperApp {
    return new SuperApp(dto);
  }

  createDefault(): SuperApp {
    return new SuperApp(SUPER_APP_DEFAULT_DTO);
  }
}
