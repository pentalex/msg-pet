package storage

import (
	"context"
	"time"

	"github.com/go-redis/redis/v8"
)

type RedisStorage struct {
	client *redis.Client
}

func NewRedisStorage(url string) (*RedisStorage, error) {
	opt, err := redis.ParseURL(url)
	if err != nil {
		return nil, err
	}

	client := redis.NewClient(opt)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := client.Ping(ctx).Err(); err != nil {
		return nil, err
	}

	return &RedisStorage{client: client}, nil
}

func (s *RedisStorage) Store(ctx context.Context, id string, data []byte, ttl int) error {
	key := "msg:" + id

	// Use SetNX to ensure atomicity (only set if not exists)
	ok, err := s.client.SetNX(ctx, key, data, time.Duration(ttl)*time.Second).Result()
	if err != nil {
		return err
	}
	if !ok {
		return ErrAlreadyExists
	}

	return nil
}

func (s *RedisStorage) Get(ctx context.Context, id string) ([]byte, error) {
	key := "msg:" + id

	// Use pipeline for atomic get+delete
	pipe := s.client.Pipeline()
	getCmd := pipe.Get(ctx, key)
	pipe.Del(ctx, key)

	if _, err := pipe.Exec(ctx); err != nil {
		if err == redis.Nil {
			return nil, ErrNotFound
		}
		return nil, err
	}

	data, err := getCmd.Bytes()
	if err != nil {
		return nil, ErrNotFound
	}

	return data, nil
}

func (s *RedisStorage) Delete(ctx context.Context, id string) error {
	key := "msg:" + id
	return s.client.Del(ctx, key).Err()
}

func (s *RedisStorage) Close() error {
	return s.client.Close()
}
