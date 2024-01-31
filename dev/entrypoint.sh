yarn install
cd dev
yarn install
yarn generate:types

yarn global add pm2
pm2 start yarn --interpreter sh -- dev
pm2 logs --raw
