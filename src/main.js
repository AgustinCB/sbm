'use strict'

import minimist from 'minimist'

import server from './server'

const DEFAULT_PORT = 3000

const main = (args) => {
  if (args._[0] === 'start') {
    if (!args.password) throw new Error("Set an admin password!")

    return server({ username: 'admin', password: args.password }, args.mongo)
      .then((app) => app.listen(args.port || args.p || DEFAULT_PORT))
      .catch((app) => app.listen(args.port || args.p || DEFAULT_PORT))
  }

  return Promise.reject(new Error('Wrong command'))
}

if (require.main === module) {
  const args = minimist(process.argv.slice(2))
  main(args)
    .catch((err) => console.log('An error happened!', err))
}
