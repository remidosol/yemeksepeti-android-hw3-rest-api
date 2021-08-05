# REST(ful) API for Yemeksepeti Android Developer Bootcamp Homework 3(Teamwork)
 This is a REST(ful) API that developed by using AdonisJS framework for Patika.dev/Kodluyoruz Android Developer Bootcamp third homework (Teamwork).

---

### I've used "yarn" and there is only "yarn.lock" file, so I'll give you "yarn" and "node ace" commands.

---
## Setup

Use the adonis command to install dependencies

```bash
yarn
```

Make a copy of `.env.example` rename it to `.env` and replace this file content with your own settings.

---
### Migrations and DB Seeding

Run the following command to setup the related database. (in this project, it's MySQL)

```bash
node ace migration:run
```

For seed to database with dummy data, run command below:

```bash
yarn seed
```

---
## Run

After **Setup**, run the following command to run the application.

```bash
yarn start
```

---

To start in *development environment* and **watch the changed files**, run the command below:

```bash
yarn dev
```

The command above can start the project without build the project.

---

You can build the project for **production** if you want, run the command below:

```bash
yarn build
```

They're the same as *"node ace build --production --ignore-ts-errors"* command.

Also you can build the project for **development environment**:

```bash
node ace build
```

---

## Help

For showing help for *AdonisJS ace*, run the following command.

```bash
node ace --help
```
