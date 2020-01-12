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
import axios from 'axios'
import errors from '../errors'
import jcard from '../jcard'
import util from '../util'

/**
 *  Map regional internet registries to their RDAP URL.
 */
const RIRS = {
  afrinic: 'rdap.afrinic.net/rdap',
  apnic: 'rdap.apnic.net',
  arin: 'rdap.arin.net/registry',
  lacnic: 'rdap.lacnic.net/rdap',
  ripe: 'rdap.db.ripe.net'
}

/**
 *  Default TTL (time-to-live) for the data in seconds.
 */
const DEFAULT_TTL = 86400

/**
 *  Default RIR to use.
 */
const DEFAULT_RIR = 'ripe'

/**
 *  Determine the network protocol string.
 */
const protocol = useHttps => {
  return useHttps ? 'https' : 'http'
}

/**
 *  Verify RDAP status.
 *
 *  Returns 200 on success, 400 when multiple
 *  databases return valid data.
 */
const verifyStatus = status => {
  return status === 200 || status === 400
}

/**
 *  Parse remark structur
 */
const parseRemark = remark => ({
  ...remark,
  description: remark.description.join('\n')
})

/**
 *  Parse hierarchical entities structure.
 */
const parseEntity = entity => {
  let result = {}

  // Parse the simple metadata.
  if (entity.handle !== undefined) {
    result.handle = entity.handle
  }
  if (entity.roles !== undefined) {
    result.roles = entity.roles
  }
  if (entity.status !== undefined) {
    result.status = entity.status
  }
  if (entity.publicIds !== undefined) {
    result.publicIds = entity.publicIds
  }

  // Add notices and remarks.
  if (entity.notices !== undefined) {
    result.notices = entity.notices.map(parseRemark)
  }
  if (entity.remarks !== undefined) {
    result.remarks = entity.remarks.map(parseRemark)
  }

  // Add more complicated metadata.
  if (entity.links !== undefined) {
    result.links = entity.links
  }
  if (entity.events !== undefined) {
    result.events = entity.events
  }

  // Parse vcardArray.
  if (entity.vcardArray !== undefined) {
    result.vcards = jcard(entity.vcardArray)
  }

  // Parse nested entities.
  if (entity.entities !== undefined) {
    result.entities = entity.entities.map(parseEntity)
  }

  return result
}

/**
 *  Parse and format response data from RIR.
 */
const parse = (status, data, time, ttl) => {
  // Convert the data to a common subset.
  // This simplifies a lot later, since a lot
  // of redundant data is stored by RDAP
  // or it's not very efficiently encoded.
  let result = {
    meta: {},
    range: {}
  }

  // Parse the address range designators.
  result.range.start = data.startAddress
  result.range.end = data.endAddress
  result.range.version = data.ipVersion
  if (status === 400 && result.range.start === undefined) {
    let match = data.title.match(/^Multiple country: found in (.*) - (.*)$/)
    if (match !== null) {
      result.range.start = match[1]
      result.range.end = match[2]
      result.range.version = /^[0-9.]+$/.test(match[1]) ? 'v4' : 'v6'
    } else {
      // Have an invalid record.
      throw new errors.Rdap(data.title)
    }
  }

  // Get the address prefix and length.
  if (data.cidr0_cidrs !== undefined) {
    result.range.cidrs = data.cidr0_cidrs.map(cidr => ({
      prefix: cidr.v4prefix || cidr.v6prefix,
      length: cidr.length
    }))
  }

  // Get the range handle and parent handle.
  result.meta.expiration = time + ttl
  if (data.handle !== undefined) {
    result.meta.handle = data.handle
  }
  if (data.parentHandle !== undefined) {
    result.meta.parentHandle = data.parentHandle
  }

  // Add status, name, type, country.
  if (data.status !== undefined) {
    result.meta.status = data.status
  }
  if (data.name !== undefined) {
    result.meta.name = data.name
  }
  if (data.type !== undefined) {
    result.meta.type = data.type
  }
  if (data.country !== undefined) {
    result.meta.country = data.country
  }

  // Add notices and remarks.
  if (data.notices !== undefined) {
    result.meta.notices = data.notices.map(parseRemark)
  }
  if (data.remarks !== undefined) {
    result.meta.remarks = data.remarks.map(parseRemark)
  }

  // Add more complicated metadata.
  if (data.links !== undefined) {
    result.meta.links = data.links
  }
  if (data.events !== undefined) {
    result.meta.events = data.events
  }

  // Add the entities, which are hierarchical.
  // They're also very poorly designed, and need
  // to be extensively parsed to be usable.
  if (data.entities !== undefined) {
    result.meta.entities = data.entities.map(parseEntity)
  }

  return result
}

/**
 *  Attempt to query local cache for WHOIS data.
 *  If the data has expired, return nothing.
 */
const queryCache = async (address, cache, time) => {
  let record
  if (cache !== undefined) {
    try {
      // Request record, and keep if the record is still valid.
      record = await cache.get(address)
      if (time >= record.expiration) {
        record = undefined
      }
    } catch (_) {}
  }

  return record
}

/**
 *  Store record in the cache for future WHOIS queries.
 */
const storeCache = async (address, cache, record) => {
  if (cache !== undefined) {
    await cache.put(address, record)
  }
}

/**
 *  Lookup WHOIS data from IPv4 or IPv6 address.
 *
 *  @param {String} address - IPv4 or Ipv6 address to lookup WHOIS data for.
 *  @param {Object} options - Options to control RDAP/HTTP behavior.
 *    @field {String} rir - (Optional) Query this RIR before redirects (default 'ripe').
 *    @field {Boolean} useHttps - (Optional) Use HTTPS for requests (default True).
 *    @field {Object} cache - (Optional) Cache WHOIS results.
 *    @field {Number} timeout - (Optional) Timeout in milliseconds for HTTP(s) request.
 *
 *  Valid RIRs:
 *  ===========
 *
 *  Valid RIRs include:
 *    - afrinic
 *    - apnic
 *    - arin
 *    - lacnic
 *    - ripe
 *
 *  It is only recommended to query RIPE or ARIN by default,
 *  due to their fast responses and lack of rate-limiting.
 */
export const lookup = async (address, options) => {
  // Get the basic options.
  let opts = options || {}
  let time = util.time.current()
  let ttl = opts.ttl || DEFAULT_TTL

  // Query cache for data
  let record = await queryCache(address, opts.cache, time)
  if (record !== undefined) {
    return record
  }

  // Get the URL options.
  let rir = opts.rir || DEFAULT_RIR
  let useHttps = 'useHttps' in opts ? opts.useHttps : true
  let baseUrl = `${protocol(useHttps)}://${RIRS[rir]}`

  // Get axios config.
  let config = { verifyStatus }
  if (opts.timeout !== undefined) {
    config.timeout = opts.timeout
  }

  // Fetch data, parse, and cache them.
  let url = `${baseUrl}/ip/${address}`
  let response = await axios.get(url, config)
  record = parse(response.status, response.data, time, ttl)
  await storeCache(address, opts.cache, record)

  return record
}

/**
 *  Maximum number of simultaneous WHOIS requests.
 *
 *  Setting too low may cause performance issues.
 *  Setting too high may lead to dropped requests.
 */
const WHOIS_POOL_SIZE = 8

/**
 *  Non-throwing lookup function that queries the cache
 *  if applicable, returns if the item is found, otherwise
 *  queries the DNS servers for the data.
 */
const lookupNoThrow = async (address, options) => {
  // Get the basic options.
  let time = util.time.current()
  let ttl = options.ttl || DEFAULT_TTL

  // Query cache for data
  let record = await queryCache(address, options.cache, time)
  if (record !== undefined) {
    return record
  }

  // Get the URL options.
  let rir = options.rir || DEFAULT_RIR
  let useHttps = 'useHttps' in options ? options.useHttps : true
  let baseUrl = `${protocol(useHttps)}://${RIRS[rir]}`

  // Get axios config.
  let config = { verifyStatus }
  if (options.timeout !== undefined) {
    config.timeout = options.timeout
  }

  // Fetch data, parse, and cache them.
  try {
    let url = `${baseUrl}/ip/${address}`
    let response = await axios.get(url, config)
    record = parse(response.status, response.data, time, ttl)
    await storeCache(address, options.cache, record)
  } catch (_) {
    record = undefined
  }

  return record
}

/**
 *  Lookup WHOIS data from list of IPv4 or IPv6 addresses.
 *
 *  Returns a map mapping each IP address to the record
 *  returned for that IP address.
 *
 *  @param {String} addresses - Array of IPv4 or Ipv6 addresses to lookup WHOIS data for.
 *  @param {Object} options - Options to control RDAP/HTTP behavior.
 *    @field {String} rir - (Optional) Query this RIR before redirects (default 'ripe').
 *    @field {Boolean} useHttps - (Optional) Use HTTPS for requests (default True).
 *    @field {Object} cache - (Optional) Cache WHOIS results.
 *    @field {Number} timeout - (Optional) Timeout in milliseconds for HTTP(s) request.
 *
 *  Valid RIRs:
 *  ===========
 *
 *  Valid RIRs include:
 *    - afrinic
 *    - apnic
 *    - arin
 *    - lacnic
 *    - ripe
 *
 *  It is only recommended to query RIPE or ARIN by default,
 *  due to their fast responses and lack of rate-limiting.
 */
export const lookupList = async (addresses, options) => {
  let opts = options || {}

  // Pool callback:
  //  Create a list of {address: record} objects.
  const callback = async address => {
    let result = await lookupNoThrow(address, opts)
    if (result !== undefined) {
      return { [address]: result }
    }
  }

  // Get only unique addresses to avoid redunantly
  // querying data. This also means we avoid
  // requesting data from a server for the same
  // key multiple times in all conditions.
  let uniqueAddresses = util.array.unique(addresses)
  let records = await asyncPool(WHOIS_POOL_SIZE, uniqueAddresses, callback)

  // Remove all records that failed to get any data.
  let filtered = records.filter(x => x !== undefined)

  // Map to a single object.
  return Object.assign({}, ...filtered)
}