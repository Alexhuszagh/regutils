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
import format from '../../src/util/format'

describe('format', () => {
  describe('address', () => {
    it('should serialize ipv4', () => {
      let data = [192, 168, 0, 1]
      expect(format.address(data, '.')).to.equal('192.168.0.1')
    })

    it('should serialize ipv6', () => {
      let data = [8193, 3512, 0, 1, 1, 1, 1, 1]
      expect(format.address(data, ':', 16)).to.equal('2001:db8:0:1:1:1:1:1')
    })
  })
})
