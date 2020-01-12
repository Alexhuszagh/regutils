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

import util from '../../util'

// Store big-endian so MSB is stored at lowest address.
const LITTLE_ENDIAN = false
const KEY_SIZE = 4
const VALUE_SIZE = 30

/**
 *  Encode key (32-bit IPv4 address) to binary.
 */
const encodeKey = key => {
  // Serialize data to buffer.
  let array = new Uint8Array(KEY_SIZE)
  let view = new DataView(array.buffer)
  view.setUint32(0, key, LITTLE_ENDIAN)

  return array
}

/**
 *  Encode value to binary.
 *
 *  The value has the following format:
 *    1). STOP value (32-bit)
 *    2). Country-code (16-bit, ISO 3166-1 alpha-2).
 *    3). Date (YYYYMMDD) (64-bit)
 *    4). Identifier (128-bit)
 */
const encodeValue = value => {
  if (value.country.length !== 2) {
    throw new Error('invalid country code length')
  }
  if (value.date.length !== 8) {
    throw new Error('invalid date length')
  }
  if (value.identifier.length > 32) {
    throw new Error('invalid identifier length')
  }

  // Create integral/binary representations of our value.
  // Pad identifier to 128-bits, since some identifiers
  // are significantly shorter (like, AfriNIC, at 16-bits).
  let stop = value.stop
  let country = util.codec.ascii.encode(value.country)
  let date = util.codec.ascii.encode(value.date)
  let identifier = util.codec.hex.encode(value.identifier.padStart(32, '0'))

  // Serialize data to buffer.
  let array = new Uint8Array(VALUE_SIZE)
  let view = new DataView(array.buffer)
  view.setUint32(0, stop, LITTLE_ENDIAN)
  array.set(country, 4)
  array.set(date, 6)
  array.set(identifier, 14)

  return array
}

/**
 *  Decode key (32-bit IPv4 address) from binary.
 */
const decodeKey = array => {
  if (array.length !== KEY_SIZE) {
    throw new Error('invalid buffer length')
  }

  // Decode key to integral representation.
  let view = new DataView(array.buffer)
  let address = view.getUint32(0, LITTLE_ENDIAN)

  return address
}

/**
 *  Decode value to object.
 *
 *  The value has the following format:
 *    1). STOP value (32-bit)
 *    2). Country-code (16-bit, ISO 3166-1 alpha-2).
 *    3). Date (YYYYMMDD) (128-bit)
 *    4). Identifier (128-bit)
 */
const decodeValue = array => {
  if (array.length !== VALUE_SIZE) {
    throw new Error('invalid buffer length')
  }

  // Decode value to integral/text representations.
  let view = new DataView(array.buffer)
  let stop = view.getUint32(0, LITTLE_ENDIAN)
  let country = util.codec.ascii.decode(array.slice(4, 6))
  let date = util.codec.ascii.decode(array.slice(6, 14))
  let identifier = util.codec.hex.decode(array.slice(14, 30))

  // Since we padded the start with 0s, we need to remove
  // those padded values. All identifiers should be a multiple
  // of 16, 32, or 64, or 128 bits, so just remove 16 bits at a time.
  while (identifier.startsWith('00000000')) {
    identifier = identifier.slice(8)
  }

  return {
    stop,
    country,
    date,
    identifier
  }
}

export default {
  encodeKey,
  encodeValue,
  decodeKey,
  decodeValue
}