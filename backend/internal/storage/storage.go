package storage

import (
	"context"
	"errors"
)

var (
	ErrNotFound      = errors.New("message not found")
	ErrAlreadyExists = errors.New("message already exists")
)

type Storage interface {
	Store(ctx context.Context, id string, data []byte, ttl int) error
	Get(ctx context.Context, id string) ([]byte, error)
	Delete(ctx context.Context, id string) error
	Close() error
}
