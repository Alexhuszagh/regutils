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
import errors from '../errors'
import util from '../util'

const parseAddress = string => {
  return util.parse.address(string, ':', 0, 65535, 16)
}

const formatAddress = address => {
  return util.format.address(address, ':', 16)
}

const formatCompressed = address => {
  // Find all subarrays with IPv6 elements that are 0,
  // filter for those with more than 1 element (only compress
  // more than 1 0-element), and then find the longest run.
  let windows = util.array.windows(address, x => x === 0)
  let filtered = windows.filter(item => item.array.length > 1)
  let longest = util.array.max(filtered, item => item.array.length)
  if (longest === undefined) {
    return formatDecompressed(address)
  }

  // Use compressed notation.
  let firstIndex = longest.index
  let lastIndex = firstIndex + longest.array.length
  let leading = formatAddress(address.slice(0, longest.index))
  let trailing = formatAddress(address.slice(lastIndex))
  return `${leading}::${trailing}`
}

const formatDecompressed = address => {
  return formatAddress(address)
}

/**
 *  Format list of 8 16-byte unsigned integers to record.
 */
const formatList = (address, decompressed) => {
  // Need to format the address depending on
  // whether we want a compressed or decompressed
  // IPv6 address. Assume we want compressed by
  // default.
  if (decompressed) {
    return formatDecompressed(address)
  }
  return formatCompressed(address)
}

/**
 *  Format numerical IPv6 address to record.
 */
const format = (address, decompressed) => {
  // Convert 128-bit unsigned integer to 8 16-bit unsigned integers.
  let data = [
    address.shiftRight(112).and(0xFFFF).toJSNumber(),
    address.shiftRight(96).and(0xFFFF).toJSNumber(),
    address.shiftRight(80).and(0xFFFF).toJSNumber(),
    address.shiftRight(64).and(0xFFFF).toJSNumber(),
    address.shiftRight(48).and(0xFFFF).toJSNumber(),
    address.shiftRight(32).and(0xFFFF).toJSNumber(),
    address.shiftRight(16).and(0xFFFF).toJSNumber(),
    address.and(0xFFFF).toJSNumber()
  ]

  // Format address to string format.
  return formatList(data, decompressed)
}

const parseCompressed = (leading, trailing) => {
  let data = [0, 0, 0, 0, 0, 0, 0, 0]
  let leadingData = []
  if (leading.length > 0) {
    leadingData = parseAddress(leading)
  }
  let trailingData = []
  if (trailing.length > 0) {
    trailingData = parseAddress(trailing)
  }
  if (leadingData.length + trailingData.length > 6) {
    // Need at least 2 records ellipsed for compressed notation.
    throw new errors.Ipv6(`${leading}::${trailing}`)
  }
  data.splice(0, leadingData.length, ...leadingData)
  data.splice(data.length - trailingData.length, trailingData.length, ...trailingData)
  return data
}

const parseDecompressed = string => {
  let data = parseAddress(string)
  if (data.length !== 8) {
    throw new errors.Ipv6(string)
  }
  return data
}

/**
 *  Parse IPv6 record to list of 8 16-byte unsigned integers.
 */
const parseList = string => {
  // Find if the IPv6 address has a compacted group,
  // and parse the IPv6 address to 8 groups of 16-bit
  // unsigned integers.
  let groups = string.split('::')
  if (groups.length === 2) {
    return parseCompressed(groups[0], groups[1])
  } else if (groups.length === 1) {
    return parseDecompressed(groups[0])
  } else {
    throw new errors.Ipv6(string)
  }
}

/**
 *  Parse IPv6 record to numerical address.
 */
const parse = string => {
  let data = parseList(string)
  // Convert the 8 groups of 16-bit integers to a 128-bit unsigned integer.
  return BigInteger(data[0]).shiftLeft(112)
    .or(BigInteger(data[1]).shiftLeft(96))
    .or(BigInteger(data[2]).shiftLeft(80))
    .or(BigInteger(data[3]).shiftLeft(64))
    .or(BigInteger(data[4]).shiftLeft(48))
    .or(BigInteger(data[5]).shiftLeft(32))
    .or(BigInteger(data[6]).shiftLeft(16))
    .or(BigInteger(data[7]))
}

export default {
  format,
  formatList,
  parse,
  parseList
}