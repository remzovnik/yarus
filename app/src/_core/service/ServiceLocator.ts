import { EntityFactory } from "@/_core/factory/EntityFactory";
import { ServicesFactory } from "@/_core/factory/ServicesFactory";
import { BaseService } from "./BaseService";
import type { App } from "vue";
import { EmptyService } from "./EmptyService";

export type ConstructorOf<T extends BaseService> = new (...args: any[]) => T;

export class ServiceRegistry {
  private servicesMap = new Map<ConstructorOf<BaseService>, any>();
  private app: App;

  public setVueApp(app: App) {
    this.app = app;
    for (const iterServ of this.servicesMap.values()) {
      iterServ.vueApp = app;
    }
  }

  public getService<T extends BaseService>(Ctor: ConstructorOf<T>): T {
    if (!this.servicesMap.has(Ctor)) {
      const service = new Ctor();
      service.vueApp = this.app;
      this.servicesMap.set(Ctor, service);
    }
    return this.servicesMap.get(Ctor) || new EmptyService();
  }

  public get vueApp() {
    return this.app;
  }
}

export class ServiceLocator {
  static _instance: ServiceRegistry = new ServiceRegistry();
  static _entityFactory: EntityFactory = new EntityFactory();
  static _servicesFactory: ServicesFactory = new ServicesFactory();

  public static get instance(): ServiceRegistry {
    return this._instance;
  }

  public static get factory(): EntityFactory {
    return this._entityFactory;
  }

  public static get service(): ServicesFactory {
    return this._servicesFactory;
  }
}
