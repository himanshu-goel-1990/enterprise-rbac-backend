const redis =
  require("../../config/redis");

class CacheService {
  static async get(key) {
    const value =
      await redis.get(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value);
  }

  static async set(
    key,
    value,
    ttl = 3600
  ) {
    await redis.set(
      key,
      JSON.stringify(value),
      {
        EX: ttl,
      }
    );
  }

  static async del(key) {
    await redis.del(key);
  }

  static async delPattern(pattern) {
    const keys =
      await redis.keys(pattern);

    if (keys.length) {
      await redis.del(keys);
    }
  }
}

module.exports =
  CacheService;