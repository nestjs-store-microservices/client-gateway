# Client Gateway

The gateway is the communication point between our customers and our services.
It is in charge of receiving the requests, sending them to the corresponding services and returning the response to the client.

## Dev

1. Clone repository
2. Install dependencies
3. Create a new file `.env` base on `.env.template`
4. Nats server up

```
docker run -d --name nats-main -p 4222:4222 -p 6222:6222 -p 8222:8222 nats
```

5. Have all microservices up
6. Execute `npm run start:dev`

# Nats

```
docker run -d --name nats-main -p 4222:4222 -p 6222:6222 -p 8222:8222 nats
```
