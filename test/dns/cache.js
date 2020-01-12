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
import Cache from '../../src/dns/cache'
import util from '../../src/util'

const IPV4_RECORDS = [
  { address: '192.168.0.1', expiration: 1578631364122 },
  { address: '192.168.0.255', expiration: 1578631364182 }
]

const IPV6_RECORDS = [
  { address: '2001:db8:0:1:1:1:1:1', expiration: 1578631364122 },
  { address: '2001:db8::2:1', expiration: 1578631364182 }
]

const checkCache = async cache => {
  await cache.put({ hostname: 'example.org', rrtype: 'A'}, IPV4_RECORDS)
  await cache.put({ hostname: 'example.org', rrtype: 'AAAA'}, IPV6_RECORDS)
  expect(await cache.get({ hostname: 'example.org', rrtype: 'A'})).to.eql(IPV4_RECORDS)
  expect(await cache.get({ hostname: 'example.org', rrtype: 'AAAA'})).to.eql(IPV6_RECORDS)

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