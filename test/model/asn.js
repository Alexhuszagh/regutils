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
import asn from '../../src/model/asn'

const INVALID = [
  '17a',
  'a',
  '17 ',
  '-1',
  '4294967296'
]

describe('asn', () => {
  describe('parse', () => {
    it('should work with valid ASN data', () => {
      expect(asn.parse('17')).to.equal(17)
      expect(asn.parse('22750')).to.equal(22750)
    })

    it('should error with invalid ASN data', () => {
      for (let value of INVALID) {
        expect(() => asn.parse(value)).to.throwException()
      }
    })
  })

  describe('format', () => {
    it('should format valid addresses', () => {
      expect(asn.format(17)).to.equal('17')
      expect(asn.format(22750)).to.equal('22750')
    })
  })
})