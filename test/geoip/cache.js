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
import cache from '../../src/geoip/cache'
import model from '../../src/model'
import util from '../../src/util'

const ASN_RANGE = [
  {
    key: 1228,
    value: {
      stop: 1228,
      country: 'ZA',
      date: '19910301',
      identifier: 'f36b9f4b'
    }
  },
  {
    key: 1229,
    value: {
      stop: 1229,
      country: 'ZA',
      date: '19910301',
      identifier: 'f36b9f4b'
    }
  },
  {
    key: 1230,
    value: {
      stop: 1230,
      country: 'ZA',
      date: '19910301',
      identifier: 'f36b9f4b'
    }
  }
]

const IPV4_RANGE = [
  {
    key: model.ipv4.parse('41.252.0.0'),
    value: {
      stop: model.ipv4.parse('41.255.255.255'),
      country: 'LY',
      date: '20070612',
      identifier: 'f36f8f4f'
    }
  },
  {
    key: model.ipv4.parse('45.96.0.0'),
    value: {
      stop: model.ipv4.parse('45.103.255.255'),
      country: 'EG',
      date: '20141211',
      identifier: 'f367cc68'
    }
  },
  {
    key: model.ipv4.parse('45.104.0.0'),
    value: {
      stop: model.ipv4.parse('45.111.255.255'),
      country: 'EG',
      date: '20151124',
      identifier: 'f367cc68'
    }
  }
]

const IPV6_RANGE = [
  {
    key: model.ipv6.parse('2001:4200::'),
    value: {
      stop: model.ipv6.parse('2001:4200:ffff:ffff:ffff:ffff:ffff:ffff'),
      country: 'ZA',
      date: '20051021',
      identifier: 'f36b9f4b'
    }
  },
  {
    key: model.ipv6.parse('2001:4210::'),
    value: {
      stop: model.ipv6.parse('2001:4210:ffff:ffff:ffff:ffff:ffff:ffff'),
      country: 'ZA',
      date: '20100210',
      identifier: 'f3696e5f'
    }
  },
  {
    key: model.ipv6.parse('2001:4218::'),
    value: {
      stop: model.ipv6.parse('2001:4218:ffff:ffff:ffff:ffff:ffff:ffff'),
      country: 'ZA',
      date: '20060111',
      identifier: 'f367678f'
    }
  }
]

const checkCache = async (cache, range, increment, decrement) => {
  // Add items to cache.
  for (let item of range) {
    await cache.put(item.key, item.value)
  }

  // Use first as a reference for reference checks.
  let first = range[0]

  // Check get success and fail.
  for (let item of range) {
    expect(await cache.get(item.key)).to.eql(item.value)
  }
  expect(() => cache.get(first.key)).to.throwAsyncException()

  // Check find success.
  let { key, value } = await cache.find(first.key)
  expect(key).to.eql(first.key)
  expect(value).to.eql(first.value)

  // Check find contains success.
  let found = await cache.find(increment(first.key))
  expect(found).to.only.have.keys('key', 'value')

  // Check find failure.
  let notFound = await cache.find(decrement(first.key))
  expect(notFound).to.equal(null)

  // Check del success and fail.
  for (let item of range) {
    await cache.del(item.key)
    expect(() => cache.get(item.key)).to.throwAsyncException()
  }
  expect(() => cache.del(first.key)).to.throwAsyncException()

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
  describe('asn', () => {
    const increment = x => x + 1
    const decrement = x => x - 1

    it('should get and put values in-memory', async () => {
      await checkCache(new cache.Asn(), ASN_RANGE, increment, decrement)
    })

    it('should get and put values on-disk', async () => {
      let path = await tmp.tmpName()
      await checkCache(new cache.Asn(path), ASN_RANGE, increment, decrement)
    })
  })

  describe('ipv4', () => {
    const increment = x => x + 1
    const decrement = x => x - 1

    it('should get and put values in-memory', async () => {
      await checkCache(new cache.Ipv4(), IPV4_RANGE, increment, decrement)
    })

    it('should get and put values on-disk', async () => {
      let path = await tmp.tmpName()
      await checkCache(new cache.Ipv4(path), IPV4_RANGE, increment, decrement)
    })
  })

  describe('ipv6', () => {
    const increment = x => x.add(1)
    const decrement = x => x.subtract(1)

    it('should get and put values in-memory', async () => {
      await checkCache(new cache.Ipv6(), IPV6_RANGE, increment, decrement)
    })

    it('should get and put values on-disk', async () => {
      let path = await tmp.tmpName()
      await checkCache(new cache.Ipv6(path), IPV6_RANGE, increment, decrement)
    })
  })
})