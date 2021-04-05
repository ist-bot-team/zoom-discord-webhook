# Zoom Discord Webhook

Send Zoom meeting information to Discord via Webhooks

## Usage

### Docker

This repository has a Docker image available on DockerHub.
Use the following `docker-compose.yml`:

```yml
version: '3.8'

services:
  zoom-discord-webhook:
    image: diogotcorreia/zoom-discord-webhook:v1.0.0
    volumes:
      - type: bind
        source: ./data
        target: /app/data
    restart: unless-stopped
```

You must create a directory `data` with the file `content.json`.
An example configuration file is in `data/content.example.json`.
