FROM alpine:3.12 as builder

ARG VERSION
ARG CLIENT_ID

RUN apk add --no-cache git nodejs nodejs-npm

RUN git clone --branch "$VERSION" --single-branch --depth 1 \
    https://github.com/korylprince/youtube-check-ui.git /client

WORKDIR /client

RUN npm install

RUN CLIENT_ID="$CLIENT_ID" npm run build-prod

FROM caddy:2.1.1

COPY --from=builder /client/dist /site

COPY ./Caddyfile /etc/caddy/Caddyfile
