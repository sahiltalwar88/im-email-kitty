import Bromise from 'bluebird'
import config from '../../config'
import named from 'node-postgres-named'
const pgConnect = require('pg-connect')(config.postgres)

pgConnect.on('client', client => {
  named.patch(client)
})

export default pgConnect

export function easyquery (querystring, params, res) {
  return Bromise.using(
    pgConnect(),
    query => query(querystring, params)
  )
  .get('rows')
  .then(rows => res.json(rows))
  // .then(function (results) {
  //   return res.json(results.rows)
  // })
}
