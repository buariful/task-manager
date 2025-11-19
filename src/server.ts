import mongoose from 'mongoose';
import config from './app/config';
import app from './app';

let isConnected = false; // prevent multiple connections in serverless

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  if (!isConnected) {
    await mongoose.connect(config.database_url as string);
    isConnected = true;
  }

  return app(req, res);
}

// import mongoose from 'mongoose';
// import config from './app/config';
// import app from './app';

// async function main() {
//   try {
//     await mongoose.connect(config.database_url as string);
//     app.listen(config.port, () => {
//       // eslint-disable-next-line no-console
//       console.log(`Example app listening on port ${config.port}`);
//     });
//   } catch (error) {
//     // eslint-disable-next-line no-console
//     console.log(error);
//   }
// }

// main();
