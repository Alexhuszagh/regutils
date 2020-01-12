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
import dns from '../../src/dns'
import model from '../../src/model'
import util from '../../src/util'

const ipv4Parse = record => {
  return model.ipv4.parse(record.address)
}

const checkIpv4 = array => {
  expect(array.map(ipv4Parse)).to.be.an('array')
}

const ipv6Parse = record => {
  return model.ipv6.parse(record.address)
}

const checkIpv6 = array => {
  expect(array.map(ipv6Parse)).to.be.an('array')
}

const checkExpiration = (array, time) => {
  let isValid = array.every(record => record.expiration > time)
  expect(isValid).to.equal(true)
}

describe('lookup', () => {
  it('should lookup without any options', async () => {
    let time = util.time.current()
    let ipv4 = await dns.lookup('example.org')
    checkIpv4(ipv4)
    checkExpiration(ipv4, time)
  })

  it('should lookup with all options', async () => {
    let cache = new dns.cache()

    // IPv4
    let time = util.time.current()
    let ipv4 = await dns.lookup('example.org', {
      cache,
      servers: ['8.8.8.8'],
      rrtype: 'A'
    })
    checkIpv4(ipv4)
    checkExpiration(ipv4, time)

    // IPv6
    time = util.time.current()
    let ipv6 = await dns.lookup('example.org', {
      cache,
      servers: ['8.8.8.8'],
      rrtype: 'AAAA'
    })
    checkIpv6(ipv6)
    checkExpiration(ipv6, time)

    // Check the values are cached.
    expect(await cache.get({ hostname: 'example.org', rrtype: 'A'})).to.eql(ipv4)
    expect(await cache.get({ hostname: 'example.org', rrtype: 'AAAA'})).to.eql(ipv6)

    // Check the cached values are used when re-querying.
    expect(await dns.lookup('example.org', {
      cache,
      servers: ['8.8.8.8'],
      rrtype: 'A'
    })).to.eql(ipv4)
    expect(await dns.lookup('example.org', {
      cache,
      servers: ['8.8.8.8'],
      rrtype: 'AAAA'
    })).to.eql(ipv6)
  })

  it('should fail with an invalid domain name', async () => {
    await expect(() => dns.lookup('example.invalid')).to.throwAsyncException()
  })
})

describe('lookupList', () => {
  it('should lookup without an RR type', async () => {
    let time = util.time.current()
    let ipv4 = await dns.lookupList(['example.org'])
    expect(Object.keys(ipv4).length).to.equal(1)
    let org = ipv4['example.org']
    expect(org.length).to.be.above(0)
    checkIpv4(org)
    checkExpiration(org, time)
  })

  it('should lookup with all options', async () => {
    let cache = new dns.cache()
    let hostnames = ['example.org', 'example.com']

    // IPv4
    let time = util.time.current()
    let ipv4 = await dns.lookupList(hostnames, {
      cache,
      servers: ['8.8.8.8'],
      rrtype: 'A'
    })
    expect(Object.keys(ipv4).length).to.equal(2)

    // Check example.com
    let comIpv4 = ipv4['example.com']
    expect(comIpv4.length).to.be.above(0)
    checkIpv4(comIpv4)
    checkExpiration(comIpv4, time)

    // Check example.org
    let orgIpv4 = ipv4['example.org']
    expect(orgIpv4.length).to.be.above(0)
    checkIpv4(orgIpv4)
    checkExpiration(orgIpv4, time)

    // IPv6
    time = util.time.current()
    let ipv6 = await dns.lookupList(hostnames, {
      cache,
      servers: ['8.8.8.8'],
      rrtype: 'AAAA'
    })
    expect(Object.keys(ipv6).length).to.equal(2)

    // Check example.com
    let comIpv6 = ipv6['example.com']
    expect(comIpv6.length).to.be.above(0)
    checkIpv6(comIpv6)
    checkExpiration(comIpv6, time)

    // Check example.org
    let orgIpv6 = ipv6['example.org']
    expect(orgIpv6.length).to.be.above(0)
    checkIpv6(orgIpv6)
    checkExpiration(orgIpv6, time)

    // Check the values are cached.
    expect(await cache.get({ hostname: 'example.org', rrtype: 'A'})).to.eql(orgIpv4)
    expect(await cache.get({ hostname: 'example.org', rrtype: 'AAAA'})).to.eql(orgIpv6)

    // Check the cached values are used when re-querying.
    expect(await dns.lookupList(hostnames, {
      cache,
      servers: ['8.8.8.8'],
      rrtype: 'A'
    })).to.eql(ipv4)
    expect(await dns.lookupList(hostnames, {
      cache,
      servers: ['8.8.8.8'],
      rrtype: 'AAAA'
    })).to.eql(ipv6)

    // It should ignore duplicate hostnames.
    expect(await dns.lookupList(['example.com', 'example.com'], {
      cache,
      servers: ['8.8.8.8'],
      rrtype: 'A'
    })).to.eql({ 'example.com': comIpv4 })
  })

  it('should not fail with an invalid domain name', async () => {
    let hostnames = ['example.org', 'example.invalid']
    let time = util.time.current()
    let ipv4 = await dns.lookupList(hostnames)
    expect(Object.keys(ipv4).length).to.equal(2)

    let invalid = ipv4['example.invalid']
    expect(invalid.length).to.equal(0)

    let org = ipv4['example.org']
    expect(org.length).to.be.above(0)
    checkIpv4(org)
    checkExpiration(org, time)
  })
})