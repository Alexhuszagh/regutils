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
const RECORD_SIZE = 12

/**
 *  Encode IPv4 record to binary.
 */
const encode = record => {
  // Create integral representations of our values.
  let address = model.ipv4.parseList(record.address)
  let expirationLow = (record.expiration & 0xFFFFFFFF) >>> 0
  let expirationHigh = (record.expiration / 0x100000000) >>> 0

  // Serialize data to buffer.
  let array = new Uint8Array(RECORD_SIZE)
  let view = new DataView(array.buffer)
  view.setUint8(0, address[0])
  view.setUint8(1, address[1])
  view.setUint8(2, address[2])
  view.setUint8(3, address[3])
  view.setUint32(4, expirationLow, LITTLE_ENDIAN)
  view.setUint32(8, expirationHigh, LITTLE_ENDIAN)

  return array
}

/**
 *  Encode list of IPv4 records to binary.
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
 *  Decode IPv4 record from binary.
 */
const decode = array => {
  if (array.length !== RECORD_SIZE) {
    throw new Error('invalid buffer length')
  }

  // Get integral values from buffer.
  let view = new DataView(array.buffer)
  let address = [
    view.getUint8(0),
    view.getUint8(1),
    view.getUint8(2),
    view.getUint8(3)
  ]
  let expirationLow = view.getUint32(4, LITTLE_ENDIAN)
  let expirationHigh = view.getUint32(8, LITTLE_ENDIAN)

  // Deserialize to models.
  return {
    address: model.ipv4.formatList(address),
    expiration: (expirationHigh * 0x100000000) + expirationLow
  }
}

/**
 *  Decode list of IPv4 records from binary.
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