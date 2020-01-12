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
import BigInteger from 'big-integer'
import errors from '../errors'
import model from '../model'
import util from '../util'

/**
 *  Mapping of each RIR to the list of their delegated
 *  IP ranges.
 */
const RIRS = {
  afrinic: 'ftp.afrinic.net/stats/afrinic/delegated-afrinic-extended-latest',
  apnic: 'ftp.apnic.net/stats/apnic/delegated-apnic-extended-latest',
  arin: 'ftp.arin.net/pub/stats/arin/delegated-arin-extended-latest',
  lacnic: 'ftp.lacnic.net/pub/stats/lacnic/delegated-lacnic-extended-latest',
  ripe: 'ftp.ripe.net/ripe/stats/delegated-ripencc-extended-latest',
}

/**
 *  Determine the network protocol string.
 */
const protocol = useHttps => {
  return useHttps ? 'https' : 'http'
}

/**
 *  Determine if we should skip parsing the line.
 */
const skipLine = line => {
  // Comment in APNIC data.
  return line.startsWith('#') ||
    // Empty lines are permitted anywhere.
    line.length === 0 ||
    // Version line of the file.
    /^\d/.test(line) ||
    // Summary line, denotes metadata, not useful.
    line.endsWith('summary')
}

/**
 *  Parse the range from the record type, start, and length.
 */
const parseRange = (type, first, length) => {
  if (type === 'asn') {
    // ASN
    let start = model.asn.parse(first)
    let count = util.parse.uint32(length)
    let stop = start + count - 1
    if (stop > util.stdint.UINT32_MAX) {
      throw new errors.Asn(`${start}|${length}`)
    }
    return { start, stop }
  } else if (type === 'ipv4') {
    // IPv4
    let start = model.ipv4.parse(first)
    let count = util.parse.uint32(length)
    let stop = start + count - 1
    if (stop > util.stdint.UINT32_MAX) {
      throw new errors.Ipv4(`${start}|${length}`)
    }
    return { start, stop }
  } else if (type === 'ipv6') {
    // IPv6
    let start = model.ipv6.parse(first)
    let prefix = util.parse.int(length, 0, 128)
    let mask = BigInteger(1).shiftLeft(128 - prefix).subtract(1)
    let stop = start.or(mask)
    return { start, stop }
  } else {
    throw new errors.GeoIp('unknown record type')
  }
}

/**
 *  Parse record from line.
 */
const parseLine = line => {
  // Format:
  //    registry|cc|type|start|value|date|status|opaque-id|extensions
  //  Some weird quirks:
  //    RIPENCC has '-' in the opaque-id identifiers.
  //    RIPENCC won't include trailing '|' when the rest of the line is empty.
  let array = line.split('|')
  let registry = array[0]
  let country = array[1]
  let type = array[2]
  let date = array[5]
  let status = array[6]
  let identifier = (array[7] || '').replace(/-/g, '')
  let extensions = array.slice(8)
  let { start, stop } = parseRange(type, array[3], array[4])

  return {
    registry,
    country,
    type,
    start,
    stop,
    date,
    status,
    identifier,
    extensions
  }
}

/**
 *  Fetch, parse, and cache data from a single RIR.
 */
const fetch = async (cache, config, useHttps, rir) => {
  let url = `${protocol(useHttps)}://${RIRS[rir]}`
  let response = await axios.get(url, config)
  let lines = response.data.split(/\r?\n/)
  for (let line of lines) {
    if (!skipLine(line)) {
      // Parse record and store allocated records with the appropriate cache.
      let record = parseLine(line)
      if (cache[record.type] !== undefined && record.status === 'allocated') {
        await cache[record.type].put(record.start, record)
      }
    }
  }
}

/**
 *  Maximum number of simultaneous GEOIP requests.
 *
 *  Setting too low may cause performance issues.
 *  Setting too high may lead to dropped requests.
 */
const GEOIP_POOL_SIZE = 4

/**
 *  Fetch results from regional RIRs and compile them into
 *  the provided cache.
 *
 *  @param {Object} cache -Cache for geoip data.
 *    @field {Object} asn - (Optional) Cache to store ASN records.
 *    @field {Object} ipv4 - (Optional) Cache to store IPv4 records.
 *    @field {Object} ipv6 - (Optional) Cache to store IPv6 records.
 *  @param {Object} options - Options to configure fetched results.
 *    @field {Boolean} useHttps - (Optional) Use HTTPS for requests (default True).
 *    @field {Number} timeout - (Optional) Timeout in milliseconds for each HTTP(s) request.
 *    @field {Array} rirs - (Optional) List of RIRs to query.
 */
export default async (cache, options) => {
  // Get the basic options.
  let opts = options || {}
  let rirs = opts.rirs || Object.keys(RIRS)
  let useHttps = 'useHttps' in opts ? opts.useHttps : true

  // Get axios config.
  let config = {}
  if (opts.timeout !== undefined) {
    config.timeout = opts.timeout
  }

  // Iteratively fetch, process, and cache the records.
  const callback = rir => fetch(cache, config, useHttps, rir)
  await asyncPool(GEOIP_POOL_SIZE, rirs, callback)
}