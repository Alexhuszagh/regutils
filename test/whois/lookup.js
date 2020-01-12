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

import BigInteger from 'big-integer'
import expect from '../expect'
import model from '../../src/model'
import whois from '../../src/whois'

const checkIpv4 = range => {
  let start = model.ipv4.parse(range.start)
  let end = model.ipv4.parse(range.end)
  expect(start).to.be.a('number')
  expect(end).to.be.a('number')
  expect(range.version).to.equal('v4')
}

const checkIpv6 = range => {
  let start = model.ipv6.parse(range.start)
  let end = model.ipv6.parse(range.end)
  expect(BigInteger.isInstance(start)).to.equal(true)
  expect(BigInteger.isInstance(end)).to.equal(true)
  expect(range.version).to.equal('v6')
}

describe('lookup', () => {
  it('should lookup a valid IPv4 address', async () => {
    let data = await whois.lookup('93.184.216.0')
    checkIpv4(data.range)
  })

  it('should lookup a valid IPv6 address', async () => {
    let data = await whois.lookup('2a02:c0::')
    checkIpv6(data.range)
  })

  it('should lookup with all options', async () => {
    let cache = new whois.cache()

    // IPv4
    let ipv4 = await whois.lookup('93.184.216.0', {
      cache,
      rir: 'arin',
      useHttps: false,
      timeout: 3000
    })
    checkIpv4(ipv4.range)

    // IPv6
    let ipv6 = await whois.lookup('2a02:c0::', {
      cache,
      rir: 'arin',
      useHttps: false,
      timeout: 3000
    })
    checkIpv6(ipv6.range)

    // Check the values are cached.
    expect(await cache.get('93.184.216.0')).to.eql(ipv4)
    expect(await cache.get('2a02:c0::')).to.eql(ipv6)

    // Check the cached values are used when re-querying.
    expect(await whois.lookup('93.184.216.0', {
      cache,
      rir: 'arin',
      useHttps: false,
      timeout: 3000
    })).to.eql(ipv4)
    expect(await whois.lookup('2a02:c0::', {
      cache,
      rir: 'arin',
      useHttps: false,
      timeout: 3000
    })).to.eql(ipv6)
  }).timeout(5000)

  it('should throw with invalid addresses', async () => {
    expect(() => whois.lookup('93.184.216')).to.throwAsyncException()
    expect(() => whois.lookup('2a02:c0::0::')).to.throwAsyncException()
  })
})

describe('lookupList', () => {
  it('should lookup a valid addresses', async () => {
    let addresses = ['93.184.216.0', '2a02:c0::']
    let data = await whois.lookupList(addresses)

    // Check 2 values are returned.
    expect(Object.keys(data).length).to.equal(2)
    checkIpv4(data['93.184.216.0'].range)
    checkIpv6(data['2a02:c0::'].range)
  })

  it('should lookup with all options', async () => {
    let cache = new whois.cache()
    let addresses = ['93.184.216.0', '2a02:c0::']

    // IPv4
    let data = await whois.lookupList(addresses, {
      cache,
      rir: 'arin',
      useHttps: false,
      timeout: 3000
    })
    expect(Object.keys(data).length).to.equal(2)
    checkIpv4(data['93.184.216.0'].range)
    checkIpv6(data['2a02:c0::'].range)

    // Check the values are cached.
    expect(await cache.get('93.184.216.0')).to.eql(data['93.184.216.0'])
    expect(await cache.get('2a02:c0::')).to.eql(data['2a02:c0::'])

    // Check the cached values are used when re-querying.
    expect(await whois.lookupList(addresses, {
      cache,
      rir: 'arin',
      useHttps: false,
      timeout: 3000
    })).to.eql(data)
  }).timeout(5000)

  it('should ignore invalid addresses', async () => {
    let addresses = ['93.184.216.0', '93.184.216']
    let data = await whois.lookupList(addresses)

    // Check 2 values are returned.
    expect(Object.keys(data).length).to.equal(1)
    checkIpv4(data['93.184.216.0'].range)
  })
})