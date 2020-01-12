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
import ipv4 from '../../src/model/ipv4'

const INVALID = [
  '192.168.0',
  '256.1.0.0',
  '192.168.0.',
  '192.168.',
  '192.168..',
  '192.168.256.0',
  '192.168.-1.0'
]

describe('ipv4', () => {
  describe('parseList', () => {
    it('should work with valid IPv4 data', () => {
      expect(ipv4.parseList('1.1.0.0')).to.eql([1, 1, 0, 0])
      expect(ipv4.parseList('192.168.0.1')).to.eql([192, 168, 0, 1])
    })

    it('should error with invalid IPv4 data', () => {
      for (let value of INVALID) {
        expect(() => ipv4.parseList(value)).to.throwException()
      }
    })
  })

  describe('parse', () => {
    it('should work with valid IPv4 data', () => {
      expect(ipv4.parse('1.1.0.0')).to.equal(16842752)
      expect(ipv4.parse('192.168.0.1')).to.equal(3232235521)
    })

    it('should error with invalid IPv4 data', () => {
      for (let value of INVALID) {
        expect(() => ipv4.parse(value)).to.throwException()
      }
    })
  })

  describe('formatList', () => {
    it('should format valid addresses', () => {
      expect(ipv4.formatList([1, 1, 0, 0])).to.equal('1.1.0.0')
      expect(ipv4.formatList([192, 168, 0, 1])).to.equal('192.168.0.1')
    })
  })

  describe('format', () => {
    it('should format valid addresses', () => {
      expect(ipv4.format(16842752)).to.equal('1.1.0.0')
      expect(ipv4.format(3232235521)).to.equal('192.168.0.1')
    })
  })
})
