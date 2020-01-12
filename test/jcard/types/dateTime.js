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
import dateTime from '../../../src/jcard/types/dateTime'

describe('dateTime', () => {
  it('should return objects', () => {
    expect(dateTime('1985-04-12T23:20:50')).to.eql({
      date: {
        year: 1985,
        month: 4,
        day: 12
      },
      time: {
        hours: 23,
        minutes: 20,
        seconds: 50
      }
    })
    expect(dateTime('1985-04-12T23:20:50Z')).to.eql({
      date: {
        year: 1985,
        month: 4,
        day: 12
      },
      time: {
        hours: 23,
        minutes: 20,
        seconds: 50
      }
    })
    expect(dateTime('1985-04-12T23:20:50+04:00')).to.eql({
      date: {
        year: 1985,
        month: 4,
        day: 12
      },
      time: {
        hours: 23,
        minutes: 20,
        seconds: 50
      },
      utcOffset: {
        direction: '+',
        hours: 4,
        minutes: 0
      }
    })
    expect(dateTime('1985-04-12T23:20:50+04')).to.eql({
      date: {
        year: 1985,
        month: 4,
        day: 12
      },
      time: {
        hours: 23,
        minutes: 20,
        seconds: 50
      },
      utcOffset: {
        direction: '+',
        hours: 4
      }
    })
    expect(dateTime('1985-04-12T23:20')).to.eql({
      date: {
        year: 1985,
        month: 4,
        day: 12
      },
      time: {
        hours: 23,
        minutes: 20
      }
    })
    expect(dateTime('1985-04-12T23')).to.eql({
      date: {
        year: 1985,
        month: 4,
        day: 12
      },
      time: {
        hours: 23
      }
    })
    expect(dateTime('--04-12T23:20')).to.eql({
      date: {
        month: 4,
        day: 12
      },
      time: {
        hours: 23,
        minutes: 20
      }
    })
    expect(dateTime('--04T23:20')).to.eql({
      date: {
        month: 4
      },
      time: {
        hours: 23,
        minutes: 20
      }
    })
    expect(dateTime('---12T23:20')).to.eql({
      date: {
        day: 12
      },
      time: {
        hours: 23,
        minutes: 20
      }
    })
    expect(dateTime('--04T23')).to.eql({
      date: {
        month: 4
      },
      time: {
        hours: 23
      }
    })
  })
})
