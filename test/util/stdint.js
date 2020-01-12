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
import stdint from '../../src/util/stdint'

describe('stdint', () => {
  it('should define *_MIN and *_MAX values', () => {
    // Signed
    expect(stdint.INT8_MIN).to.equal(-128)
    expect(stdint.INT8_MAX).to.equal(127)
    expect(stdint.INT16_MIN).to.equal(-32768)
    expect(stdint.INT16_MAX).to.equal(32767)
    expect(stdint.INT32_MIN).to.equal(-2147483648)
    expect(stdint.INT32_MAX).to.equal(2147483647)

    // Unsigned
    expect(stdint.UINT8_MIN).to.equal(0)
    expect(stdint.UINT8_MAX).to.equal(255)
    expect(stdint.UINT16_MIN).to.equal(0)
    expect(stdint.UINT16_MAX).to.equal(65535)
    expect(stdint.UINT32_MIN).to.equal(0)
    expect(stdint.UINT32_MAX).to.equal(4294967295)
  })
})
