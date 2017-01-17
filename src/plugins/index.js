import search from './search'

const enabledPlugins = [ search ]

export default function load (app, mongoose) {
  enabledPlugins.forEach((plugin) => plugin(app, mongoose))
}
