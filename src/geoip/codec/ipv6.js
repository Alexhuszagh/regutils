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
import util from '../../util'

// Store big-endian so MSB is stored at lowest address.
const LITTLE_ENDIAN = false
const KEY_SIZE = 16
const VALUE_SIZE = 42

/**
 *  Encode key (IPv6 address) to binary.
 */
const encodeKey = key => {
  // Create integral representations of our key.
  let address = [
    key.shiftRight(96).and(0xFFFFFFFF).toJSNumber(),
    key.shiftRight(64).and(0xFFFFFFFF).toJSNumber(),
    key.shiftRight(32).and(0xFFFFFFFF).toJSNumber(),
    key.and(0xFFFFFFFF).toJSNumber()
  ]

  // Serialize data to buffer.
  let array = new Uint8Array(KEY_SIZE)
  let view = new DataView(array.buffer)
  view.setUint32(0, address[0], LITTLE_ENDIAN)
  view.setUint32(4, address[1], LITTLE_ENDIAN)
  view.setUint32(8, address[2], LITTLE_ENDIAN)
  view.setUint32(12, address[3], LITTLE_ENDIAN)

  return array
}

/**
 *  Encode value to binary.
 *
 *  The value has the following format:
 *    1). STOP value (128-bit)
 *    2). Country-code (16-bit, ISO 3166-1 alpha-2).
 *    3). Date (YYYYMMDD) (64-bit)
 *    4). Identifier (128-bit)
 */
const encodeValue = value => {
  if (value.country.length !== 2) {
    throw new Error(`invalid country code length ${value.country.length}`)
  }
  if (value.date.length !== 8) {
    throw new Error(`invalid date length ${value.date.length}`)
  }
  if (value.identifier.length > 32) {
    throw new Error(`invalid identifier length ${value.identifier.length}`)
  }

  // Create integral/binary representations of our value.
  // Pad identifier to 128-bits, since some identifiers
  // are significantly shorter (like, AfriNIC, at 16-bits).
  let stop = [
    value.stop.shiftRight(96).and(0xFFFFFFFF).toJSNumber(),
    value.stop.shiftRight(64).and(0xFFFFFFFF).toJSNumber(),
    value.stop.shiftRight(32).and(0xFFFFFFFF).toJSNumber(),
    value.stop.and(0xFFFFFFFF).toJSNumber()
  ]
  let country = util.codec.ascii.encode(value.country)
  let date = util.codec.ascii.encode(value.date)
  let identifier = util.codec.hex.encode(value.identifier.padStart(32, '0'))

  // Serialize data to buffer.
  let array = new Uint8Array(VALUE_SIZE)
  let view = new DataView(array.buffer)
  view.setUint32(0, stop[0], LITTLE_ENDIAN)
  view.setUint32(4, stop[1], LITTLE_ENDIAN)
  view.setUint32(8, stop[2], LITTLE_ENDIAN)
  view.setUint32(12, stop[3], LITTLE_ENDIAN)
  array.set(country, 16)
  array.set(date, 18)
  array.set(identifier, 26)

  return array
}

/**
 *  Decode key (IPv6 address) from binary.
 */
const decodeKey = array => {
  if (array.length !== KEY_SIZE) {
    throw new Error('invalid buffer length')
  }

  // Decode key to integral representation.
  let view = new DataView(array.buffer)
  let address = [
    view.getUint32(0, LITTLE_ENDIAN),
    view.getUint32(4, LITTLE_ENDIAN),
    view.getUint32(8, LITTLE_ENDIAN),
    view.getUint32(12, LITTLE_ENDIAN)
  ]

  // Create BigInteger from native integers.
  return BigInteger(address[0]).shiftLeft(96)
    .or(BigInteger(address[1]).shiftLeft(64))
    .or(BigInteger(address[2]).shiftLeft(32))
    .or(BigInteger(address[3]))
}

/**
 *  Decode value to object.
 *
 *  The value has the following format:
 *    1). STOP value (128-bit)
 *    2). Country-code (16-bit, ISO 3166-1 alpha-2).
 *    3). Date (YYYYMMDD) (64-bit)
 *    4). Identifier (128-bit)
 */
const decodeValue = array => {
  if (array.length !== VALUE_SIZE) {
    throw new Error('invalid buffer length')
  }

  // Decode value to integral/text representations.
  let view = new DataView(array.buffer)
  let address = [
    view.getUint32(0, LITTLE_ENDIAN),
    view.getUint32(4, LITTLE_ENDIAN),
    view.getUint32(8, LITTLE_ENDIAN),
    view.getUint32(12, LITTLE_ENDIAN)
  ]
  let stop = BigInteger(address[0]).shiftLeft(96)
    .or(BigInteger(address[1]).shiftLeft(64))
    .or(BigInteger(address[2]).shiftLeft(32))
    .or(BigInteger(address[3]))
  let country = util.codec.ascii.decode(array.slice(16, 18))
  let date = util.codec.ascii.decode(array.slice(18, 26))
  let identifier = util.codec.hex.decode(array.slice(26, 42))

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