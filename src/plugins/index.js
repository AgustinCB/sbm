import search from './search'
import categories from './categories'

const enabledPlugins = [ categories, search ]

export default function load (app, mongoose) {
  enabledPlugins.forEach((plugin) => plugin(app, mongoose))
}
