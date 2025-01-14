<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest


## Description

Global Think Technology technical test.

## Project setup with Docker
```bash
$ docker-compose build
$ docker-compose up -d
```

### Regarding Docker Build
By building the docker, it uses the Dockerfile with node:22.13.0-alpine3.21 and then it will create the image
of the project and expose the container in port 3000 (make sure that port is available).
This build will take a few minutes (only if you dont have the image of node already, it has to pull the image from the node server).

### Usefull information
If you wish to stop the container:
```bash
$ docker-compose stop
```
To watch current application logs:
```bash
$ docker-compose logs -f
```

## Project setup locally

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


