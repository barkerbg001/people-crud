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
API URLs live in `app/src/HttpClient.ts`. Android emulator uses `http://localhost:5044` via `adb reverse tcp:5044 tcp:5044` (`npm run dev:android` does this for you; the classic `10.0.2.2` alias is kept as a fallback). iOS simulator and web use `http://localhost:5044`. On a real phone, set `DEVICE_URL` to your machine's LAN IP.

## Run both at once
```bash
npm run install:all   # first time only
npm run dev           # API + Expo (QR code for Expo Go)
npm run dev:web       # API + Expo in the browser
```
