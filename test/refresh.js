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

import expect from './expect'
import refresh from '../src/refresh'

const sleep = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout))
}

describe('refresh', () => {
  it('should correctly update data', async () => {
    let x = 1
    const callback = async () => {
      return x++
    }
    let context = refresh(10, callback)

    // Try one loop
    expect(await context()).to.equal(1)
    expect(await context()).to.equal(1)

    // Wait till time expires
    await sleep(11)
    expect(await context()).to.equal(2)
    expect(await context()).to.equal(2)
  })
})