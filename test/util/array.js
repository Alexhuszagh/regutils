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
import array from '../../src/util/array'

describe('array', () => {
  describe('windows', () => {
    it('windows should return empty', () => {
      let windows = array.windows([1, 2, 3, 4, 5, 6, 7, 8], x => x === 0)
      expect(windows).to.eql([])
    })

    it('windows should return one', () => {
      let windows = array.windows([1, 2, 3, 0, 5, 6, 7, 8], x => x === 0)
      expect(windows).to.eql([{ index: 3, array: [0] }])
    })

    it('windows should return leading & trailing', () => {
      let windows = array.windows([0, 2, 3, 4, 5, 6, 7, 0], x => x === 0)
      expect(windows).to.eql([
        { index: 0, array: [0] },
        { index: 7, array: [0] }
      ])
    })

    it('windows should return multiple', () => {
      let windows = array.windows([1, 0, 0, 4, 0, 0, 0, 8], x => x === 0)
      expect(windows).to.eql([
        { index: 1, array: [0, 0] },
        { index: 4, array: [0, 0, 0] }
      ])
    })
  })

  describe('max', () => {
    it('max is a function', () => {
      expect(array.max).to.be.a('function')
    })

    it('max should return max numeric value', () => {
      let data = [1, 7, 3, 8, 5, 2, 6, 4]
      let max = array.max(data)
      expect(max).to.equal(8)

      max = array.max(data, x => x)
      expect(max).to.equal(8)
    })

    it('max should return max key-value', () => {
      let data = [
        { value: 1 },
        { value: 7 },
        { value: 3 },
        { value: 8 },
        { value: 5 },
        { value: 2 },
        { value: 6 },
        { value: 4 }
      ]
      let max = array.max(data, x => x.value)
      expect(max).to.eql({ value: 8 })
    })
  })

  describe('min', () => {
    it('min is a function', () => {
      expect(array.min).to.be.a('function')
    })

    it('min should return min numeric value', () => {
      let data = [1, 7, 3, 8, 5, 2, 6, 4]
      let min = array.min(data)
      expect(min).to.equal(1)

      min = array.min(data, x => x)
      expect(min).to.equal(1)
    })

    it('min should return min key-value', () => {
      let data = [
        { value: 1 },
        { value: 7 },
        { value: 3 },
        { value: 8 },
        { value: 5 },
        { value: 2 },
        { value: 6 },
        { value: 4 }
      ]
      let min = array.min(data, x => x.value)
      expect(min).to.eql({ value: 1 })
    })
  })

  describe('unique', () => {
    it('should remove duplicates with the default key', () => {
      let data = [1, 7, 7, 8, 5, 2, 6, 7]
      let unique = array.unique(data)
      expect(unique).to.eql([1, 7, 8, 5, 2, 6])
    })

    it('should remove duplicates with a custom key', () => {
      let data = [
        { value: 1 },
        { value: 7 },
        { value: 7 },
        { value: 8 },
        { value: 5 },
        { value: 2 },
        { value: 6 },
        { value: 7 }
      ]
      let unique = array.unique(data, x => x.value)
      expect(unique).to.eql([
        { value: 1 },
        { value: 7 },
        { value: 8 },
        { value: 5 },
        { value: 2 },
        { value: 6 }
      ])
    })
  })
})