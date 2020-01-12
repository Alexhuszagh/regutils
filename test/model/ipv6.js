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
import expect from '../expect'
import ipv6 from '../../src/model/ipv6'

const INVALID = [
  '2001:db8::2::',
  '2001:db8:',
  '2001:db8:FFFF1::'
]

describe('ipv6', () => {
  describe('parseList', () => {
    it('should work with valid IPv6 data', () => {
      expect(ipv6.parseList('2001:db8:0:1:1:1:1:1')).to.eql([8193, 3512, 0, 1, 1, 1, 1, 1])
      expect(ipv6.parseList('2001:db8:abcd:12::')).to.eql([8193, 3512, 43981, 18, 0, 0, 0, 0])
      expect(ipv6.parseList('2001:db8::2:1')).to.eql([8193, 3512, 0, 0, 0, 0, 2, 1])
    })

    it('should error with invalid IPv6 data', () => {
      for (let value of INVALID) {
        expect(() => ipv6.parseList(value)).to.throwException()
      }
    })
  })

  describe('parse', () => {
    it('should work with valid IPv6 data', () => {
      expect(ipv6.parse('2001:db8:0:1:1:1:1:1').toString()).to.equal('42540766411282592875351010504635121665')
      expect(ipv6.parse('2001:db8:abcd:12::').toString()).to.equal('42540766464452359661416384011178082304')
      expect(ipv6.parse('2001:db8::2:1').toString()).to.equal('42540766411282592856903984951653957633')
    })

    it('should error with invalid IPv6 data', () => {
      for (let value of INVALID) {
        expect(() => ipv6.parse(value)).to.throwException()
      }
    })
  })

  describe('formatList', () => {
    it('should format valid addresses', () => {
      expect(ipv6.formatList([8193, 3512, 0, 1, 1, 1, 1, 1])).to.equal('2001:db8:0:1:1:1:1:1')
      expect(ipv6.formatList([8193, 3512, 43981, 18, 0, 0, 0, 0])).to.equal('2001:db8:abcd:12::')
      expect(ipv6.formatList([8193, 3512, 0, 0, 0, 0, 2, 1])).to.equal('2001:db8::2:1')
    })
  })

  describe('format', () => {
    it('should format valid addresses', () => {
      let x = BigInteger('42540766411282592875351010504635121665')
      let y = BigInteger('42540766464452359661416384011178082304')
      let z = BigInteger('42540766411282592856903984951653957633')
      expect(ipv6.format(x)).to.equal('2001:db8:0:1:1:1:1:1')
      expect(ipv6.format(x, true)).to.equal('2001:db8:0:1:1:1:1:1')
      expect(ipv6.format(y)).to.equal('2001:db8:abcd:12::')
      expect(ipv6.format(y, true)).to.equal('2001:db8:abcd:12:0:0:0:0')
      expect(ipv6.format(z)).to.equal('2001:db8::2:1')
      expect(ipv6.format(z, true)).to.equal('2001:db8:0:0:0:0:2:1')
    })
  })
})
