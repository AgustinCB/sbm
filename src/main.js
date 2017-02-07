'use strict'

import {start, login, read, create, edit, del} from './commands'

const show = (result) => console.log(result)

export default function (args) {
  switch (args._[0]) {
    case 'start':
      return start(args)
    case 'login':
      return login(args)
        .then(show)
    case 'read':
      return read(args)
        .then(show)
    case 'create':
      return create(args)
        .then(show)
    case 'edit':
      return edit(args)
        .then(show)
    case 'delete':
      return del(args)
        .then(show)
  }

  throw new Error('Wrong command')
}
