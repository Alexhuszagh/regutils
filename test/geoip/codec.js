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

import expect from '../expect'
import model from '../../src/model'
import codec from '../../src/geoip/codec'

describe('codec', () => {
  describe('asn', () => {
    const KEY = 1228
    const VALUE = {
      stop: 1228,
      country: 'ZA',
      date: '19910301',
      identifier: 'f36b9f4b'
    }
    const KEY_BUFFER = new Uint8Array([0, 0, 4, 204])
    const VALUE_BUFFER = new Uint8Array([0, 0, 4, 204, 90, 65, 49, 57, 57, 49, 48, 51, 48, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 243, 107, 159, 75])

    it('should encode asn keys', () => {
      expect(codec.asn.encodeKey(KEY)).to.eql(KEY_BUFFER)
    })

    it('should encode asn values', () => {
      expect(codec.asn.encodeValue(VALUE)).to.eql(VALUE_BUFFER)
    })

    it('should decode asn keys', () => {
      expect(codec.asn.decodeKey(KEY_BUFFER)).to.eql(KEY)
    })

    it('should decode asn values', () => {
      expect(codec.asn.decodeValue(VALUE_BUFFER)).to.eql(VALUE)
    })
  })

  describe('ipv4', () => {
    const KEY = model.ipv4.parse('41.252.0.0')
    const VALUE = {
      stop: model.ipv4.parse('41.255.255.255'),
      country: 'LY',
      date: '20070612',
      identifier: 'f36f8f4f'
    }
    const KEY_BUFFER = new Uint8Array([41, 252, 0, 0])
    const VALUE_BUFFER = new Uint8Array([41, 255, 255, 255, 76, 89, 50, 48, 48, 55, 48, 54, 49, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 243, 111, 143, 79])

    it('should encode ipv4 keys', () => {
      expect(codec.ipv4.encodeKey(KEY)).to.eql(KEY_BUFFER)
    })

    it('should encode ipv4 values', () => {
      expect(codec.ipv4.encodeValue(VALUE)).to.eql(VALUE_BUFFER)
    })

    it('should decode ipv4 keys', () => {
      expect(codec.ipv4.decodeKey(KEY_BUFFER)).to.eql(KEY)
    })

    it('should decode ipv4 values', () => {
      expect(codec.ipv4.decodeValue(VALUE_BUFFER)).to.eql(VALUE)
    })

  })

  describe('ipv6', () => {
    const KEY = model.ipv6.parse('2001:4200::')
    const VALUE = {
      stop: model.ipv6.parse('2001:4200:ffff:ffff:ffff:ffff:ffff:ffff'),
      country: 'ZA',
      date: '20051021',
      identifier: 'f36b9f4b'
    }

    const KEY_BUFFER = new Uint8Array([32, 1, 66, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    const VALUE_BUFFER = new Uint8Array([32, 1, 66, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 90, 65, 50, 48, 48, 53, 49, 48, 50, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 243, 107, 159, 75])

    it('should encode ipv6 keys', () => {
      expect(codec.ipv6.encodeKey(KEY)).to.eql(KEY_BUFFER)
    })

    it('should encode ipv6 values', () => {
      expect(codec.ipv6.encodeValue(VALUE)).to.eql(VALUE_BUFFER)
    })

    it('should decode ipv6 keys', () => {
      expect(codec.ipv6.decodeKey(KEY_BUFFER)).to.eql(KEY)
    })

    it('should decode ipv6 values', () => {
      expect(codec.ipv6.decodeValue(VALUE_BUFFER)).to.eql(VALUE)
    })
  })
})