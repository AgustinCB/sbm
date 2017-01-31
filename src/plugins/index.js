import search from './search'
import categories from './categories'
import gravatar from './gravatar'
import globals from './globals'

const enabledPlugins = [ categories, search, globals, gravatar ]

export default function load (app, mongoose, authenticate, login) {
  enabledPlugins.forEach((plugin) => plugin(app, mongoose, authenticate, login))
}
