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

/**
 *  Wrapper around a local file-based cache to
 *  provide a software-level cache for DNS requests.
 */

import codec from './codec'
import util from '../util'

/**
 *  Map RR types to codec tyes.
 */
const CODEC_MAP = {
  A: codec.ipv4,
  AAAA: codec.ipv6
}

/**
 *  Global database get/put/del options.
 */
const OPTIONS = {
  keyEncoding: 'ascii',
  valueEncoding: 'binary'
}

export default class Cache extends util.level {
  constructor(path) {
    super(OPTIONS, path)
  }

  /**
   *  Get a unique DB key from the hostname and RR type.
   *
   *  Since `+` is not a valid domain-name character, this
   *  will always be unique for any valid domain name.
   */
  encodeKey(key) {
    return `${key.hostname}+${key.rrtype}`
  }

  encodeValue(key, value) {
    let codec = CODEC_MAP[key.rrtype]
    let array = codec.encodeList(value)
    return util.codec.toBuffer(array)
  }

  decodeKey(encodedKey) {
    let [hostname, rrtype] = encodedKey.split('+')
    return { hostname, rrtype }
  }

  decodeValue(key, encodedValue) {
    let codec = CODEC_MAP[key.rrtype]
    let array = util.codec.fromBuffer(encodedValue)
    return codec.decodeList(array)
  }
}