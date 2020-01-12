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
import timestamp from '../../../src/jcard/types/timestamp'

describe('timestamp', () => {
  it('should return objects', () => {
    expect(timestamp('2013-02-14T12:30:00')).to.eql({
      date: {
        year: 2013,
        month: 2,
        day: 14
      },
      time: {
        hours: 12,
        minutes: 30,
        seconds: 0
      }
    })
    expect(timestamp('2013-02-14T12:30:00Z')).to.eql({
      date: {
        year: 2013,
        month: 2,
        day: 14
      },
      time: {
        hours: 12,
        minutes: 30,
        seconds: 0
      }
    })
    expect(timestamp('2013-02-14T12:30:00-05')).to.eql({
      date: {
        year: 2013,
        month: 2,
        day: 14
      },
      time: {
        hours: 12,
        minutes: 30,
        seconds: 0
      },
      utcOffset: {
        direction: '-',
        hours: 5
      }
    })
    expect(timestamp('2013-02-14T12:30:00-05:30')).to.eql({
      date: {
        year: 2013,
        month: 2,
        day: 14
      },
      time: {
        hours: 12,
        minutes: 30,
        seconds: 0
      },
      utcOffset: {
        direction: '-',
        hours: 5,
        minutes: 30
      }
    })
  })
})
