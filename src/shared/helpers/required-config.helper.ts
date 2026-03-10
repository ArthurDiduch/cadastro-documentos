import { ConfigService } from '@nestjs/config';

export function requireConfigValues<const T extends readonly string[]>(
  configService: ConfigService,
  keys: T,
): Record<T[number], string> {
  const values = {} as Record<T[number], string>;

  for (const key of keys as readonly T[number][]) {
    const value = configService.get<string>(key);

    if (!value || value.trim() === '') {
      throw new Error(`Missing required config value: ${key}`);
    }

    values[key] = value;
  }

  return values;
}
