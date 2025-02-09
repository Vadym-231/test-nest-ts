## Description
- The service written on Nest/Prisma/Postgresql
- The DB information (tables/relations) is described in ./prisma/schema.prisma;

## Summary
Here presented mock-api (payments).
- Before using please set up the quota init values (`POST`: `localhost:{port}/quotas/`);
- Use routes group in `localhost:{port}/clients/` in to create the clients;
- use routes group in `localhost:{port}/payments/` to control the payment flow;

## Project setup

```bash
$ npm install
```

```bash
# migrate db;
$ npx prisma migrate dev
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



