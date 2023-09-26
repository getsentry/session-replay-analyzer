import { app } from './app.js'
import yargs from 'yargs'

yargs(process.argv.slice(2))
  .command('server', 'start the server', subYargs => {}, async argv => {
    app.listen(9000, () => { console.log('Running forever at http://localhost:9000') })
  })
  .demandCommand(1, '')
