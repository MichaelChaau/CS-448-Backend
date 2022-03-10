# Manage Items Backend REST API Server

> IMPORTANT: This project is not intended for production environments.
> It was built as an educational exercise and is intended to serve as an educational
> example.

Provides a backend REST API server for managing items in a larger inventory system.

src/openapi.yaml contains the specification for the Manage Items API.

## 1. Use via Docker

```bash
mkdir -p data
```

Run a MongoDB as the backend-database.

```bash
docker run --name backend-database --detach -v "$PWD/data:/data/db" mongo:4
```

Run the backend-server.

```bash
docker run \
  --name backend-server \
  --detach \
  -p 10001:3000 \
  -e HOST_BASE_URL=http://localhost:10001/v0 \
  -e MONGO_URI=mongodb://backend-database \
  registry.gitlab.com/librefoodpantry/training/spikeathons/winter-2021/stoney-manage-items/backend:latest
```

The service is available at http://localhost:10001/v0/items outside Docker, and at http://backend-server:3000 inside Docker.

Stop.

```bash
docker stop backend-server
docker stop backend-database
```

## 2. Use via Docker Compose

Download and inspect/configure `docker-compose.yaml`.

Start Docker Compose

```bash
docker-compose -f docker-compose.build.yaml up
```

- Rebuild image if needed `docker-compose -f docker-compose.build.yaml build --no-cache`

Prepare local enviorment

```bash
cd src
yarn 
```

Start local enviorment
```bash
yarn start
```


Stopping local development

```bash
docker-compose down
```

## Use during development
  ```bash
  cd src
  yarn
  ```

  In one terminal tab, run
  ```bash
  npm run dev-docker
  ```
  
  In a second tab, run
  ```bash
  npm run dev-server
  ```

  The server will run on localhost:3000 and you will be able to see server output in the other console.
  Visit http://localhost:15672 to view the RabbitMQ gui. 

## 3. Use via Docker Compose with Persistence

Download and inspect/configure `docker-compose.yaml` and `docker-compose.persist.yaml`.

Create the directory listed as the source in `docker-compose.persist.yaml` .

```bash
mkdir -p backend-database
```

Start.

```bash
docker-compose -f docker-compose.yaml -f docker-compose.persist.yaml up --detach
```

The service is available at http://localhost:10001/v0/items outside Docker, and at http://backend-server:3000 inside Docker. Its data is stored in ./backend-database.


Stop.

```bash
docker-compose -f docker-compose.yaml -f docker-compose.persist.yaml down
```

Start it again with the same command line options as before and its state will pick up where it left off.


## 4. Environment Variables

* HOST_BASE_URL - The URL used to access the service from outside the Docker environment.
* MONGO_URI - The MongoDB connection string.

## 5. Development

Build the backend-server.

```bash
# ci/build
docker-compose -f docker-compose.yaml -f docker-compose.build.yaml build --pull backend-server
```

Build the test-runner.

```bash
# ci/build-test
docker-compose -f docker-compose.yaml -f docker-compose.build.yaml -f docker-compose.test.yaml build --pull test-runner
```

Run the backend-server and its database.

```bash
# ci/up
docker-compose -f docker-compose.yaml -f docker-compose.build.yaml -f docker-compose.test.yaml up --detach backend-server
```

Test the running backend-server.

```bash
# ci/test
docker-compose -f docker-compose.yaml -f docker-compose.build.yaml -f docker-compose.test.yaml run --rm test-runner
```

Stop the backend-server and its database.

```bash
# ci/down
docker-compose -f docker-compose.yaml -f docker-compose.build.yaml -f docker-compose.test.yaml down
```

### 5.1. Dependencies

Dependencies are managed in a few different files.

* Dockerfile - Base image for backend.
* src/package.json - 3rd party JavaScript libraries for backend.
* testing/test-runner/Dockerfile - Base image for test-runner.
* testing/test-runner/package.json - 3rd party JavaScript libraries for test-runner.

Use [yarn](https://yarnpkg.com/) to manage dependencies package.json. You can run yarn using the nodejs docker image.

```bash
docker run -it --rm -v "$PWD:/w" -w /w node:14-alpine yarn
```

For example, to check if there are any outdated packages in test-runner...

```bash
cd testing/test-runner
docker run -it --rm -v "$PWD:/w" -w /w node:14-alpine yarn outdated
```

### 5.2. Configuration

* `docker-compose.yaml` - Configures the test/development environment.
* `src/openapi.yaml` - Contains the OpenAPI specification of the REST API. It contains metadata related to the API including a version number.
* `src/config.js` - Contains configuration specific to the implementation of the backend.
