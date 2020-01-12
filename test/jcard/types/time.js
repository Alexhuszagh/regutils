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

import expect from '../../expect'
import time from '../../../src/jcard/types/time'

describe('time', () => {
  it('should return objects', () => {
    expect(time('23:20:50')).to.eql({ hours: 23, minutes: 20, seconds: 50 })
    expect(time('23:20')).to.eql({ hours: 23, minutes: 20 })
    expect(time('23')).to.eql({ hours: 23 })
    expect(time('-20:50')).to.eql({ minutes: 20, seconds: 50 })
    expect(time('-20')).to.eql({ minutes: 20 })
    expect(time('--50')).to.eql({ seconds: 50 })
  })
})
