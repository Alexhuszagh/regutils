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

import model from '../../model'

// Store big-endian so MSB is stored at lowest address.
const LITTLE_ENDIAN = false
const RECORD_SIZE = 24

/**
 *  Encode IPv6 record to binary.
 */
const encode = record => {
  // Create integral representations of our values.
  let address = model.ipv6.parseList(record.address)
  let expirationLow = (record.expiration & 0xFFFFFFFF) >>> 0
  let expirationHigh = (record.expiration / 0x100000000) >>> 0

  // Serialize data to buffer.
  let array = new Uint8Array(RECORD_SIZE)
  let view = new DataView(array.buffer)
  view.setUint16(0, address[0], LITTLE_ENDIAN)
  view.setUint16(2, address[1], LITTLE_ENDIAN)
  view.setUint16(4, address[2], LITTLE_ENDIAN)
  view.setUint16(6, address[3], LITTLE_ENDIAN)
  view.setUint16(8, address[4], LITTLE_ENDIAN)
  view.setUint16(10, address[5], LITTLE_ENDIAN)
  view.setUint16(12, address[6], LITTLE_ENDIAN)
  view.setUint16(14, address[7], LITTLE_ENDIAN)
  view.setUint32(16, expirationLow, LITTLE_ENDIAN)
  view.setUint32(20, expirationHigh, LITTLE_ENDIAN)

  return array
}

/**
 *  Encode list of IPv6 records to binary.
 */
const encodeList = records => {
  let array = new Uint8Array(RECORD_SIZE * records.length)
  for (let index = 0; index < records.length; index += 1) {
    let offset = RECORD_SIZE * index
    let encoded = encode(records[index])
    array.set(encoded, offset)
  }
  return array
}

/**
 *  Decode IPv6 record from binary.
 */
const decode = array => {
  if (array.length !== RECORD_SIZE) {
    throw new Error('invalid buffer length')
  }

  // Get integral values from buffer.
  let view = new DataView(array.buffer)
  let address = [
    view.getUint16(0, LITTLE_ENDIAN),
    view.getUint16(2, LITTLE_ENDIAN),
    view.getUint16(4, LITTLE_ENDIAN),
    view.getUint16(6, LITTLE_ENDIAN),
    view.getUint16(8, LITTLE_ENDIAN),
    view.getUint16(10, LITTLE_ENDIAN),
    view.getUint16(12, LITTLE_ENDIAN),
    view.getUint16(14, LITTLE_ENDIAN)
  ]
  let expirationLow = view.getUint32(16, LITTLE_ENDIAN)
  let expirationHigh = view.getUint32(20, LITTLE_ENDIAN)

  // Deserialize to models.
  return {
    address: model.ipv6.formatList(address),
    expiration: (expirationHigh * 0x100000000) + expirationLow
  }
}

/**
 *  Decode list of IPv6 records from binary.
 */
const decodeList = array => {
  if ((array.length % RECORD_SIZE) !== 0) {
    throw new Error('invalid buffer length')
  }

  let records = []
  for (let index = 0; index < array.length; index += RECORD_SIZE) {
    let record = decode(array.slice(index, index + RECORD_SIZE))
    records.push(record)
  }
  return records
}

export default {
  encode,
  encodeList,
  decode,
  decodeList
}