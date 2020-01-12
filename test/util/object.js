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
import object from '../../src/util/object'

describe('object', () => {
  describe('pop', () => {
    it('should remove values from an object', () => {
      let obj = { a: 'b', c: 'd' }
      expect(obj).to.eql({ a: 'b', c: 'd' })

      // Test removing a present key.
      expect(object.pop(obj, 'a')).to.equal('b')
      expect(obj).to.eql({ c: 'd' })

      // Test with a missing key, no default.
      expect(object.pop(obj, 'a')).to.equal(undefined)
      expect(obj).to.eql({ c: 'd' })

      // Test with a missing key with a default.
      expect(object.pop(obj, 'a', 'f')).to.equal('f')
      expect(obj).to.eql({ c: 'd' })

      // Test removing a present key with a default.
      expect(object.pop(obj, 'c', 'f')).to.equal('d')
      expect(obj).to.eql({})

      // Test with undefined/null keys.
      obj.a = undefined
      obj.b = null
      expect(obj).to.eql({ a: undefined, b: null })

      // Test undefined key
      expect(object.pop(obj, 'a', 'f')).to.equal(undefined)
      expect(obj).to.eql({ b: null })

      // Test null key
      expect(object.pop(obj, 'b', 'f')).to.equal(null)
      expect(obj).to.eql({})
    })
  })

  describe('isEmpty', () => {
    it('should work with empty objects', () => {
      expect(object.isEmpty({})).to.equal(true)
      expect(object.isEmpty({ a: 'b' })).to.equal(false)
      expect(object.isEmpty([])).to.equal(false)
    })

    it('should not work with dates', () => {
      expect(object.isEmpty(new Date())).to.equal(false)
    })
  })
})
