# people-crud

Small full-stack practice app: a .NET 8 minimal API and an Expo React Native client.

## Structure
- `api/` - .NET 8 minimal API (in-memory people list: GET, GET by id, POST, DELETE)
- `app/` - Expo React Native app (form to add people, list with delete)

## Run
```bash
cd api && dotnet run --urls http://0.0.0.0:5044   # Swagger at http://localhost:5044/swagger
cd app && npm install && npm run web
```
On a real phone, set `API` in `app/src/HttpClient.ts` to your machine's IP.
