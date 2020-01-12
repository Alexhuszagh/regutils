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

import errors from '../errors'
import util from '../util'

const parseAddress = string => {
  return util.parse.address(string, '.', 0, 255)
}

const formatAddress = address => {
  return util.format.address(address, '.')
}

/**
 *  Format list of 4 8-byte unsigned integers to record.
 */
const formatList = address => {
  return formatAddress(address)
}

/**
 *  Format numerical IPv4 address to record.
 */
const format = address => {
  // Convert 32-bit unsigned integer to 4 8-bit unsigned integers.
  let data = [
    (address >> 24) & 0xFF,
    (address >> 16) & 0xFF,
    (address >> 8) & 0xFF,
    address & 0xFF
  ]

  // Format address to string format.
  return formatList(data)
}

/**
 *  Parse IPv4 record to list of 4 8-byte unsigned integers.
 */
const parseList = string => {
  const data = parseAddress(string)
  if (data.length !== 4) {
    throw new errors.Ipv4(string)
  }
  return data
}

/**
 *  Parse IPv4 record to numerical address.
 */
const parse = string => {
  const data = parseList(string)
  // Convert to 32-bit unsigned integer.
  // Left-shifts and other operators produce
  // signed variables, need to ensure the result
  // is unsigned.
  let signed = (data[0] << 24) |
    (data[1] << 16) |
    (data[2] << 8) |
    data[3]
  return signed >>> 0
}

export default {
  format,
  formatList,
  parse,
  parseList
}