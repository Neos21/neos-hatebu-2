# Neo's Hatebu Server

- `$ npm run nest -- --version` : `9.1.1`
- Development
    - `$ npm run dev` : Port 2323 (Default)
    - `$ npm run lint`
- Production Build
    - `$ npm run build`
    - Check `./.env`, `./src/main.ts` and `./src/common/configs/configuration.ts` file
- Start Server
    - `$ npm start` : Port 2323 (Default)
- Make sure WSL IP is public
- Database File
    - `./db/neos-hatebu.sqlite3.db` (Default)
- Initial Data
    - `./src/categories/categories.service.ts` : `CategoriesService#onModuleInit()`
- Cron Job
    - `./src/app.service.ts` : `AppService#handleCron()`
