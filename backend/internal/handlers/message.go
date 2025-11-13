package handlers

import (
	"encoding/json"
	"io"
	"net/http"

	"opage/internal/config"
	"opage/internal/storage"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type MessageHandler struct {
	storage storage.Storage
	config  *config.Config
}

func NewMessageHandler(storage storage.Storage, config *config.Config) *MessageHandler {
	return &MessageHandler{
		storage: storage,
		config:  config,
	}
}

type CreateRequest struct {
	EncryptedData string `json:"encrypted_data"`
	TTL           int    `json:"ttl,omitempty"`
}

type CreateResponse struct {
	ID  string `json:"id"`
	URL string `json:"url"`
}

type GetResponse struct {
	EncryptedData string `json:"encrypted_data"`
}

func (h *MessageHandler) CreateMessage(w http.ResponseWriter, r *http.Request) {
	var req CreateRequest

	body, err := io.ReadAll(io.LimitReader(r.Body, int64(h.config.MaxMessageSize)))
	if err != nil {
		http.Error(w, "Request too large", http.StatusRequestEntityTooLarge)
		return
	}

	if err := json.Unmarshal(body, &req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if req.EncryptedData == "" {
		http.Error(w, "encrypted_data is required", http.StatusBadRequest)
		return
	}

	ttl := req.TTL
	if ttl <= 0 || ttl > h.config.DefaultTTL {
		ttl = h.config.DefaultTTL
	}

	id := uuid.New().String()

	if err := h.storage.Store(r.Context(), id, []byte(req.EncryptedData), ttl); err != nil {
		http.Error(w, "Failed to store message", http.StatusInternalServerError)
		return
	}

	resp := CreateResponse{
		ID:  id,
		URL: "https://o.page/" + id, // Update with your actual domain
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func (h *MessageHandler) GetMessage(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	data, err := h.storage.Get(r.Context(), id)
	if err != nil {
		if err == storage.ErrNotFound {
			http.Error(w, "Message not found or already viewed", http.StatusNotFound)
			return
		}
		http.Error(w, "Failed to retrieve message", http.StatusInternalServerError)
		return
	}

	resp := GetResponse{
		EncryptedData: string(data),
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
