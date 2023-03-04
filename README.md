# Uni Profile

## Requirement
- Install yarn
- Install mariadb 10.6.8 or mysql

```bash
  cd docker-compose
  docker-compose -f mariadb.yaml up -d
```

## Installation

Install project with yarn

```bash
  cd $PROJECT_DIR
  yarn install
```

## Setup ENV

Copy file .env.example and rename it to .env

## Setup DB


- Run migration to setup tables (directory: database/migrations)

```bash
  yarn knex:migrate:latest
```

- Run migration to setup data (directory: database/seeds)

```bash
  yarn knex:seed:run
```

## Run project
- Run for development/local

```bash
  yarn dev
```

- Run for deployment

```bash
  yarn build && yarn start
```
    