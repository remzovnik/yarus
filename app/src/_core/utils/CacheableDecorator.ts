import MemoryCache from "./MemoryCache";

const Cacheable =
  (maxAge = 10000) =>
  (_target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any) {
      const key = `${propertyKey}-${!!args ? JSON.stringify(args) : ""}`;
      const val = MemoryCache.get(key);
      if (!val) {
        const originVal = await originalMethod.apply(this, args);
        MemoryCache.set(key, originVal, maxAge);
        return originVal;
      } else {
        return val;
      }
    };

    return descriptor;
  };

export default Cacheable;
