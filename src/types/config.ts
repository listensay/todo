// Config types for application settings

export interface Config {
  id: number;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}

// Config keys enum for type safety
export enum ConfigKey {
  PLAYER_INITIALIZED = 'player_initialized',
  THEME_MODE = 'theme_mode',
  LANGUAGE = 'language',
  NOTIFICATION_ENABLED = 'notification_enabled',
  SOUND_ENABLED = 'sound_enabled',
  DAILY_GOAL = 'daily_goal',
  TUTORIAL_COMPLETED = 'tutorial_completed',
}

// Config value types for different settings
export type BooleanConfigValue = '0' | '1';
export type ThemeModeValue = 'light' | 'dark';
export type LanguageValue = 'zh-CN' | 'en-US';

// Type mapping for each config key
export type ConfigValueType<K extends ConfigKey> =
  K extends ConfigKey.PLAYER_INITIALIZED ? BooleanConfigValue :
  K extends ConfigKey.THEME_MODE ? ThemeModeValue :
  K extends ConfigKey.LANGUAGE ? LanguageValue :
  K extends ConfigKey.NOTIFICATION_ENABLED ? BooleanConfigValue :
  K extends ConfigKey.SOUND_ENABLED ? BooleanConfigValue :
  K extends ConfigKey.DAILY_GOAL ? string :
  K extends ConfigKey.TUTORIAL_COMPLETED ? BooleanConfigValue :
  string;

// Helper functions for type conversion
export const configHelpers = {
  // Convert string to boolean
  toBoolean: (value: string): boolean => value === '1',

  // Convert boolean to string
  fromBoolean: (value: boolean): BooleanConfigValue => value ? '1' : '0',

  // Convert string to number
  toNumber: (value: string): number => parseInt(value, 10) || 0,

  // Convert number to string
  fromNumber: (value: number): string => value.toString(),
};
