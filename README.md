# msg.pet (◕‿◕)

a minimalist, end-to-end encrypted messaging service where messages automatically delete after being viewed once.

**[live demo →](https://msg.pet)**

## features

- **end-to-end encryption** - messages encrypted client-side with AES-256-GCM
- **self-destructing** - messages delete immediately after first view
- **server-blind** - encryption key never sent to server
- **lightweight** - minimal dependencies, fast and simple



**key security feature:** the encryption key lives in the URL fragment (`#key`), which is **never sent to the server**. this means:
- server only stores encrypted blobs it cannot decrypt
- even if the server is compromised, messages remain secure
- true end-to-end encryption

## quick start

### prerequisites
- go 1.21+
- node 18+
- redis 7+ (or docker)

### local development

**1. clone the repo**
```bash
git clone https://github.com/yourusername/msg-pet.git
cd msg-pet
```

**2. start backend**
```bash
cd backend

# option a: use docker compose (includes redis)
docker-compose up -d

# option b: manual setup
# install redis, then:
redis-server
go run cmd/server/main.go
```

backend runs on `http://localhost:8080`

**3. start frontend**
```bash
cd frontend
npm install
npm run dev
```

frontend runs on `http://localhost:5173`


**environment variables:**
- backend: `REDIS_URL` - redis connection string
- frontend: `VITE_API_URL` - backend API URL (for production)


## contributing

contributions welcome! please:
1. fork the repo
2. create a feature branch (`git checkout -b feature/cool-thing`)
3. commit your changes (`git commit -am 'add cool thing'`)
4. push to the branch (`git push origin feature/cool-thing`)
5. open a pull request

## license

MIT license - see [LICENSE](LICENSE) for details

## acknowledgments

- inspired by [privnote](https://privnote.com/), [unsee.cc](https://unsee.cc/), and [cobalt.tools](https://cobalt.tools/)
- encryption powered by [web crypto api](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- kaomoji from [kaomoji.ru](https://kaomoji.ru/) (◕‿◕)

---

**made with ♥ and (｡•̀ᴗ-)✧**

*burn after reading*
