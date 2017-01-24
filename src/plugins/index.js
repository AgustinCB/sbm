import search from './search'
import categories from './categories'

const enabledPlugins = [ search, categories ]

export default function load (app, mongoose) {
  enabledPlugins.forEach((plugin) => plugin(app, mongoose))
}
