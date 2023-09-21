/** JWT токен */
export type Jwt = string;

/** Tаймстамп в милисекундах применяемый в JS/TS */
export type Timestamp = number;

/** Tаймстамп в секундах применяемый на серверной стороне (приходит в dto из api) */
export type TimestampByServer = number;

/** id в формате UUID применемый на фронтендной стороне при необходимости сгенерировать id */
export type Uuid = string;

/** цифровой инкрементальный id применемый на серверной стороне для идентификации сущнсотей */
export type Id = number;

/** Алиас для типа url */
export type Url = string;

/** Алиас для типа 8 Digit Hex Colors */
export type Hex8 = string;

/** Алиас для целых положительных чисел */
export type UnsignedInt = number;

/** bigint id применемый на серверной стороне для идентификации сущнсотей */
export type IdBigInt = bigint;
