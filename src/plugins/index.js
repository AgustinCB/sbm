import search from './search'
import categories from './categories'
import globals from './globals'

const enabledPlugins = [ categories, search, globals ]

export default function load (app, mongoose, authenticate, login) {
  enabledPlugins.forEach((plugin) => plugin(app, mongoose, authenticate, login))
}
