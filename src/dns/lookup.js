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

import asyncPool from 'tiny-async-pool'
import nodeDns from 'dns'
import nodeUtil from 'util'
import util from '../util'

// Promisify the internal Node.JS DNS routines.
const resolve4 = nodeUtil.promisify(nodeDns.Resolver.prototype.resolve4)
const resolve6 = nodeUtil.promisify(nodeDns.Resolver.prototype.resolve6)

// Map RR type to query callback.
const callback = {
  'A': resolve4,
  'AAAA': resolve6
}

/**
 *  Create DNS resolve for the request.
 */
const createResolver = options => {
  const resolver = new nodeDns.Resolver()
  if (options.servers !== undefined) {
    resolver.setServers(options.servers)
  }
  return resolver
}

/**
 *  Attempt to query local cache for DNS data.
 *  If the data has expired, return nothing.
 */
const queryCache = async (hostname, rrtype, cache, time) => {
  let records
  if (cache !== undefined) {
    try {
      // Request records, and keep if the records is still valid.
      // Don't cache empty records, those might be an error from
      // a previous request. `every` returns true for an empty array.
      records = await cache.get({ hostname, rrtype })
      if (records.every(record => time >= record.expiration)) {
        records = undefined
      }
    } catch (_) {}
  }

  return records
}

/**
 *  Store records in the cache for future DNS queries.
 */
const storeCache = async (hostname, rrtype, cache, records) => {
  if (cache !== undefined) {
    await cache.put({ hostname, rrtype }, records)
  }
}

/**
 *  Stabilize record using TTL and time to calculate expiration time.
 */
const stabilize = (records, time) => records.map(record => ({
  address: record.address,
  expiration: time + (record.ttl * 1000)
}))

/**
 *  Lookup DNS records from hostname.
 *
 *  @param {String} hostname - Hostname to lookup DNS record for.
 *  @param {Object} options - Options to control DNS behavior.
 *    @field {Object} cache - (Optional) Cache DNS results.
 *    @field {String} rrtype - (Optional) Record type (default 'A').
 *    @field {Array} servers - (Optional) List of DNS servers to query.
 */
export const lookup = async (hostname, options) => {
  // Get basic options.
  let opts = options || {}
  let rrtype = opts.rrtype || 'A'
  let time = util.time.current()

  // Query cache for valid records.
  let records = await queryCache(hostname, rrtype, opts.cache, time)
  if (records !== undefined) {
    return records
  }

  // Request records from server, and cache them.
  let resolver = createResolver(opts)
  records = stabilize(await callback[rrtype].call(resolver, hostname, {
    ttl: true
  }), time)
  await storeCache(hostname, rrtype, opts.cache, records)

  return records
}

/**
 *  Maximum number of simultaneous DNS requests.
 *
 *  Setting too low may cause performance issues.
 *  Setting too high may lead to dropped requests.
 */
const DNS_POOL_SIZE = 8

/**
 *  Non-throwing lookup function that queries the cache
 *  if applicable, returns if the item is found, otherwise
 *  queries the DNS servers for the data.
 */
const lookupNoThrow = async (hostname, rrtype, cache, resolver) => {
  // Get basic options.
  let time = util.time.current()

  // Query cache for valid records.
  let records = await queryCache(hostname, rrtype, cache, time)
  if (records !== undefined) {
    return records
  }

  // Request records from server, and cache them.
  try {
    records = stabilize(await callback[rrtype].call(resolver, hostname, {
      ttl: true
    }), time)
    await storeCache(hostname, rrtype, cache, records)
  } catch (_) {
    records = []
  }

  return records
}

/**
 *  Lookup DNS records from list of hostnames.
 *
 *  Returns a map mapping each hostname to the records
 *  returned for that hostname.
 *
 *  @param {Array} hostnames - Array of hostnames to lookup DNS records for.
 *  @param {Object} options - Options to control DNS behavior.
 *    @field {Object} cache - (Optional) Cache DNS results.
 *    @field {String} rrtype - (Optional) Record type (default 'A').
 *    @field {Array} servers - (Optional) List of DNS servers to query.
 */
export const lookupList = async (hostnames, options) => {
  let opts = options || {}
  let rrtype = opts.rrtype || 'A'
  let resolver = createResolver(opts)

  // Pool callback:
  //  Create a list of {hostname: record} objects.
  const callback = async hostname => ({
    [hostname]: await lookupNoThrow(hostname, rrtype, opts.cache, resolver)
  })

  // Get only unique hostnames to avoid redunantly
  // querying data. This also means we avoid
  // requesting data from a server for the same
  // key multiple times in all conditions.
  let uniqueHostnames = util.array.unique(hostnames)
  let results = await asyncPool(DNS_POOL_SIZE, uniqueHostnames, callback)

  // Map to a single object.
  return Object.assign({}, ...results)
}
