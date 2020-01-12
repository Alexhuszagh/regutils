/*
 *
 * Copyright (c) 2019-present for NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License ");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import expect from '../expect'
import tmp from '../tmp'
import Cache from '../../src/whois/cache'
import util from '../../src/util'

const IPV4_RECORD = {"meta":{"expiration":1578796548065,"handle":"93.184.216.0 - 93.184.216.255","parentHandle":"93.184.208.0 - 93.184.223.255","name":"EDGECAST-NETBLK-03","type":"ASSIGNED PA","country":"EU","notices":[{"title":"Filtered","description":"This output has been filtered."},{"title":"Source","description":"Objects returned came from source\nRIPE"},{"title":"Terms and Conditions","description":"This is the RIPE Database query service. The objects are in RDAP format.","links":[{"value":"https://rdap.db.ripe.net/ip/93.184.216.0","rel":"terms-of-service","href":"http://www.ripe.net/db/support/db-terms-conditions.pdf","type":"application/pdf"}]}],"remarks":[{"description":"NETBLK-03-EU-93-184-216-0-24"}],"links":[{"value":"https://rdap.db.ripe.net/ip/93.184.216.0","rel":"self","href":"https://rdap.db.ripe.net/ip/93.184.216.0"},{"value":"http://www.ripe.net/data-tools/support/documentation/terms","rel":"copyright","href":"http://www.ripe.net/data-tools/support/documentation/terms"}],"events":[{"eventAction":"last changed","eventDate":"2012-06-22T23:48:41Z"}],"entities":[{"handle":"DS7892-RIPE","roles":["administrative","technical"]},{"handle":"MNT-EDGECAST","roles":["registrant"]},{"handle":"AR13582-RIPE","roles":["abuse"],"vcards":[{"version":"4.0","fn":"Abuse-C Role","kind":"group","adr":{"label":"EdgeCast Networks, Inc.\n13031 W Jefferson Blvd\n90094\nPlaya Vista CA\nUNITED STATES"},"email":{"email":"inet@verizondigitalmedia.com","abuse":"abuse@verizondigitalmedia.com"}}],"entities":[{"handle":"MNT-EDGECAST","roles":["registrant"]}]}]},"range":{"start":"93.184.216.0","end":"93.184.216.255","version":"v4"}}
const IPV6_RECORD = {"meta":{"expiration":1578796548570,"handle":"2a02:c0::/48","parentHandle":"2a02:c0::/32","name":"REDPILL-LINPRO-ANYCAST","type":"ASSIGNED","country":"NO","notices":[{"title":"Multiple country attributes found","description":"There are multiple country attributes NO, SE in 2a02:c0::/48, but only the first country NO was returned."},{"title":"Filtered","description":"This output has been filtered."},{"title":"Source","description":"Objects returned came from source\nRIPE"},{"title":"Terms and Conditions","description":"This is the RIPE Database query service. The objects are in RDAP format.","links":[{"value":"https://rdap.db.ripe.net/ip/2a02:c0::","rel":"terms-of-service","href":"http://www.ripe.net/db/support/db-terms-conditions.pdf","type":"application/pdf"}]}],"remarks":[{"description":"Redpill Linpro AS/AB"}],"links":[{"value":"https://rdap.db.ripe.net/ip/2a02:c0::","rel":"self","href":"https://rdap.db.ripe.net/ip/2a02:c0::"},{"value":"http://www.ripe.net/data-tools/support/documentation/terms","rel":"copyright","href":"http://www.ripe.net/data-tools/support/documentation/terms"}],"events":[{"eventAction":"last changed","eventDate":"2014-08-19T12:15:43Z"}],"entities":[{"handle":"NO-LINPRO-MNT","roles":["registrant"]},{"handle":"ORG-LA61-RIPE","roles":["registrant"]},{"handle":"RLHM-RIPE","roles":["technical","administrative"]},{"handle":"RLHM-RIPE","roles":["abuse"],"vcards":[{"version":"4.0","fn":"Redpill Linpro RIPE hostmaster","kind":"group","adr":{"label":"Managed Services team 0\nPostbox 4 Nydalen\n0409 Oslo\nNorway"},"tel":{"voice":"+47 08192"},"email":{"email":"noc@redpill-linpro.com","abuse":"abuse@redpill-linpro.com"},"org":"ORG-LA61-RIPE"}],"entities":[{"handle":"NO-LINPRO-MNT","roles":["registrant"]},{"handle":"ORG-LA61-RIPE","roles":["registrant"]},{"handle":"TA1353-RIPE","roles":["technical","administrative"]}]}]},"range":{"start":"2a02:c0::","end":"2a02:c0:0:ffff:ffff:ffff:ffff:ffff","version":"v6"}}

const checkCache = async cache => {
  await cache.put('93.184.216.0', IPV4_RECORD)
  await cache.put('2a02:c0::', IPV6_RECORD)
  expect(await cache.get('93.184.216.0')).to.eql(IPV4_RECORD)
  expect(await cache.get('2a02:c0::')).to.eql(IPV6_RECORD)

  // Close database and check deletion of backing store.
  let path = cache.path
  if (path !== undefined) {
    expect(cache.isOpen).to.equal(true)
    expect(await util.fs.exists(path)).to.equal(true)
    await cache.closeAndRemove()
    expect(cache.isClosed).to.equal(true)
    expect(await util.fs.exists(path)).to.equal(false)
  } else {
    expect(cache.isOpen).to.equal(true)
    await cache.close()
    expect(cache.isClosed).to.equal(true)
  }
}

describe('cache', () => {
  it('should get and put values in-memory', async () => {
    checkCache(new Cache())
  })

  it('should get and put values on-disk', async () => {
    let path = await tmp.tmpName()
    checkCache(new Cache(path))
  })
})