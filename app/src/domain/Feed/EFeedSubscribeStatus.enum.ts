/** Информация по наличию приглашения/запроса на подписку на приватную ленту
 * requested - запрос на подписку был уже отправлен
 * rejected - запрос на подписку был отклонён
 * invited - есть инвайт на подписку
 * */
export enum EFeedSubscribeStatus {
  REQUESTED = "requested",
  REJECTED = "rejected",
  INVITED = "invited",
}
