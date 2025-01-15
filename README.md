<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest


## Description

Global Think Technology technical test. This is a simple NestJS project, that features a User CRUD with a Cache Manager.

## Project setup with Docker
```bash
$ docker-compose build
$ docker-compose up -d
```

### Regarding Docker Build
By building the docker, it uses the Dockerfile with node:22.13.0-alpine3.21 and then it will create the image
of the project and expose the container in port 3000 (make sure that port is available).
This build will take a few minutes (only if you dont have the image of node already, it has to pull the image from the node server). Once the build is up, the project will be running without problems.

### Useful information
If you wish to stop the container:
```bash
$ docker-compose stop
```
To watch current application logs:
```bash
$ docker-compose logs -f
```

## Examples

There is a postman collection that uses all endpoints with examples, with the precise urls and bodies the endpoints have.

## Additional Information

This code could be better, specially the way it stores the information (it would be better with a MongoDB database, or even a SQL one). The DTO for the User, contains the profile for the same user, it could have more attributes, and even if this profile should have more attributes, then it could be separated into a new DTO and maybe then, if required could also have its own CRUD.

## Tests

All tests can be run by using:
```bash
$ npm test
```
