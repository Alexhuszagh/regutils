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
import codec from '../../src/util/codec'

describe('codec', () => {
  describe('ascii', () => {
    const TEXT = 'abc'
    const INVALID_TEXT = 'abç'
    const BUFFER = new Uint8Array([97, 98, 99])
    const INVALID_BUFFER = new Uint8Array([97, 98, 255])

    it('should encode ascii', () => {
      expect(codec.ascii.encode(TEXT)).to.eql(BUFFER)
    })

    it('should decode ascii', () => {
      expect(codec.ascii.decode(BUFFER)).to.equal(TEXT)
    })

    it('should fail with invalid data', () => {
      expect(() => codec.ascii.decode(INVALID_BUFFER)).to.throwException()
      expect(() => codec.ascii.encode(INVALID_TEXT)).to.throwException()
    })
  })

  describe('base64', () => {
    const TEXT = 'YWJj'
    const INVALID_TEXT = 'YWJĵ'
    const BUFFER = new Uint8Array([97, 98, 99])

    it('should encode base64', () => {
      expect(codec.base64.encode(TEXT)).to.eql(BUFFER)
    })

    it('should decode base64', () => {
      expect(codec.base64.decode(BUFFER)).to.equal(TEXT)
    })

    it('should fail with invalid data', () => {
      expect(() => codec.base64.encode(INVALID_TEXT)).to.throwException()
    })
  })

  describe('hex', () => {
    const TEXT = '616263'
    const INVALID_TEXT = '61626'
    const BUFFER = new Uint8Array([97, 98, 99])

    it('should encode hex', () => {
      expect(codec.hex.encode(TEXT)).to.eql(BUFFER)
    })

    it('should decode hex', () => {
      expect(codec.hex.decode(BUFFER)).to.equal(TEXT)
    })

    it('should fail with invalid data', () => {
      expect(() => codec.hex.encode(INVALID_TEXT)).to.throwException()
    })
  })

  describe('utf8', () => {
    const TEXT = '\uD83D\uDD25'
    const INVALID_TEXT = '\uD83D'
    const BUFFER = new Uint8Array([240, 159, 148, 165])
    const INVALID_BUFFER = new Uint8Array([159, 148, 165])

    it('should encode utf8', () => {
      expect(codec.utf8.encode(TEXT)).to.eql(BUFFER)
    })

    it('should decode utf8', () => {
      expect(codec.utf8.decode(BUFFER)).to.equal(TEXT)
    })

    it('should fail with invalid data', () => {
      expect(() => codec.utf8.decode(INVALID_BUFFER)).to.throwException()
      expect(() => codec.utf8.encode(INVALID_TEXT)).to.throwException()
    })
  })
})