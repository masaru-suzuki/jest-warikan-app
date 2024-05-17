import { createApp } from './app';

let app;

if (process.env.DATA_PATH) {
  const data_path = process.env.DATA_PATH;
  app = createApp(`${data_path}/groups.json`, `${data_path}/expenses.json`);
} else {
  throw new Error();
}

// appをexportすることで、他のテストファイルでappを使えるようにする
// E2Eテスト中にapp.listenを呼び出すとテストが終了しないので、appをexportして他のテストファイルで使う
app.listen(3000, () => {
  console.log('Start on port 3000');
});
