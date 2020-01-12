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
import parse from '../../src/util/parse'

describe('parse', () => {
  describe('int', () => {
    it('should parse integers', () => {
      expect(parse.int('15', 0, 100)).to.equal(15)
      expect(parse.int('15', 0, 100, 16)).to.equal(21)
    })

    it('should fail out of range', () => {
      let invalid = ['-1', '256']
      for (let value of invalid) {
        expect(() => parse.int(value, 0, 100)).to.throwException()
      }
    })

    it('should parse uint8 integers', () => {
      expect(parse.uint8('0')).to.equal(0)
      expect(parse.uint8('255')).to.equal(255)
      expect(() => parse.uint8('-1')).to.throwException()
      expect(() => parse.uint8('256')).to.throwException()
    })

    it('should parse int8 integers', () => {
      expect(parse.int8('-128')).to.equal(-128)
      expect(parse.int8('127')).to.equal(127)
      expect(() => parse.int8('-129')).to.throwException()
      expect(() => parse.int8('128')).to.throwException()
    })

    it('should parse uint16 integers', () => {
      expect(parse.uint16('0')).to.equal(0)
      expect(parse.uint16('65535')).to.equal(65535)
      expect(() => parse.uint16('-1')).to.throwException()
      expect(() => parse.uint16('65536')).to.throwException()
    })

    it('should parse int16 integers', () => {
      expect(parse.int16('-32768')).to.equal(-32768)
      expect(parse.int16('32767')).to.equal(32767)
      expect(() => parse.int16('-32769')).to.throwException()
      expect(() => parse.int16('32768')).to.throwException()
    })

    it('should parse uint32 integers', () => {
      expect(parse.uint32('0')).to.equal(0)
      expect(parse.uint32('4294967295')).to.equal(4294967295)
      expect(() => parse.uint32('-1')).to.throwException()
      expect(() => parse.uint32('4294967296')).to.throwException()
    })

    it('should parse int32 integers', () => {
      expect(parse.int32('-2147483648')).to.equal(-2147483648)
      expect(parse.int32('2147483647')).to.equal(2147483647)
      expect(() => parse.int32('-2147483649')).to.throwException()
      expect(() => parse.int32('2147483648')).to.throwException()
    })
  })

  describe('float', () => {
    it('should parse floats', () => {
      expect(parse.float('1.3', 0, 10)).to.equal(1.3)
    })

    it('should fail out of range', () => {
      let invalid = ['-1', '256']
      for (let value of invalid) {
        expect(() => parse.float(value, 0, 5.5)).to.throwException()
      }
    })
  })

  describe('address', () => {
    it('should parse ipv4', () => {
      expect(parse.address('192.168.0.1', '.', 0, 255)).to.eql([192, 168, 0, 1])
    })

    it('should parse ipv6', () => {
      expect(parse.address('2001:db8:0:1:1:1:1:1', ':', 0, 65535, 16)).to.eql([8193, 3512, 0, 1, 1, 1, 1, 1])
    })

    it('should fail out of range', () => {
      expect(() => parse.address('192.168.0.256', '.', 0, 255)).to.throwException()
    })
  })
})
