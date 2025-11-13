package config

import "os"

type Config struct {
	RedisURL       string
	MaxMessageSize int
	DefaultTTL     int // seconds
}

func Load() *Config {
	return &Config{
		RedisURL:       getEnv("REDIS_URL", "redis://localhost:6379"),
		MaxMessageSize: 1024 * 1024, // 1MB
		DefaultTTL:     86400 * 7,   // 7 days
	}
}

func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
