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

import codec from './codec'
import errors from '../errors'
import util from '../util'

/**
 *  Global database get/put/del options.
 */
const OPTIONS = {
  keyEncoding: 'binary',
  valueEncoding: 'binary'
}

/**
 *  Check if the range contains a value.
 */
const contains = (compare, value, start, stop) => {
  let isAboveStart = compare(value, start) >= 0
  let isBelowStop = compare(value, stop) <= 0
  return isAboveStart && isBelowStop
}

class Cache extends util.level {
  constructor(codec, path) {
    super(OPTIONS, path)
    this.codec = codec
  }

  encodeKey(key) {
    let array = this.codec.encodeKey(key)
    return util.codec.toBuffer(array)
  }

  encodeValue(key, value) {
    let array = this.codec.encodeValue(value)
    return util.codec.toBuffer(array)
  }

  decodeKey(encodedKey) {
    let array = util.codec.fromBuffer(encodedKey)
    return this.codec.decodeKey(array)
  }

  decodeValue(key, encodedValue) {
    let array = util.codec.fromBuffer(encodedValue)
    return this.codec.decodeValue(array)
  }

  /**
   *  Check if range contains value.
   */
  static contains(value, start, stop) {
    throw new errors.AbstractMethod(value, start, stop)
  }

  /**
   *  Find item within the range of a value.
   *
   *  First, we find the largest key below
   *  the provided key, and extract the value.
   *  If this value is in the given range,
   *  then we have a match.
   */
  async find(searchKey) {
    // Create our iterator.
    // Use reverse so we can seek the lower-bound.
    let iterator = this.db.iterator({
      keyAsBuffer: true,
      valueAsBuffer: true,
      reverse: true
    })

    // Seek our lower bound.
    let encodedKey = this.encodeKey(searchKey)
    iterator.seek(encodedKey)

    // Return a promise to the next item.
    return new Promise((resolve, reject) => {
      iterator.next((err, encodedKey, encodedValue) => {
        if (err) {
          // Error occured in finding element.
          return reject(err)
        } else if (encodedKey === undefined) {
          // No suitable item found.
          return resolve(null)
        } else {
          // Candidate found: check range.
          // Decode key and values.
          let key = this.decodeKey(encodedKey)
          let value = this.decodeValue(key, encodedValue)

          // Check if item is within valid range.
          if (this.constructor.contains(searchKey, key, value.stop)) {
            return resolve({ key, value })
          } else {
            return resolve(null)
          }
        }
      })
    })
  }
}

class Asn extends Cache {
  constructor(path) {
    super(codec.asn, path)
  }

  static contains(value, start, stop) {
    const compare = (x, y) => x - y
    return contains(compare, value, start, stop)
  }
}

class Ipv4 extends Cache {
  constructor(path) {
    super(codec.ipv4, path)
  }

  static contains(value, start, stop) {
    const compare = (x, y) => x - y
    return contains(compare, value, start, stop)
  }
}

class Ipv6 extends Cache {
  constructor(path) {
    super(codec.ipv6, path)
  }

  static contains(value, start, stop) {
    const compare = (x, y) => {
      let result = x.subtract(y)
      if (result.greater(0)) {
        return 1
      } else if (result.lesser(0)) {
        return -1
      }
      return 0
    }
    return contains(compare, value, start, stop)
  }
}

export default {
  Asn,
  Ipv4,
  Ipv6
}