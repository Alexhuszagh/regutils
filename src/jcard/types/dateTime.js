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

import date from './date'
import time from './time'
import utcOffset from './utcOffset'

/**
 *  Parse jCard date-time to JS object.
 *
 *  Examples:
 *    1985-04-12T23:20:50
 *    1985-04-12T23:20:50Z
 *    1985-04-12T23:20:50+04:00
 *    1985-04-12T23:20:50+04
 *    1985-04-12T23:20
 *    1985-04-12T23
 *    --04-12T23:20
 *    --04T23:20
 *    ---12T23:20
 *    --04T23
 *
 *  https://tools.ietf.org/html/rfc7095#section-3.5.5
 */
export default dateTime => {
  let regex = /^([0-9-]+)T([0-9:]+)([Z+-].*)?$/
  let match = dateTime.match(regex)

  // Parse the known fields.
  let result = {
    date: date(match[1]),
    time: time(match[2])
  }

  // Parse the UTC offset.
  if (match[3] === undefined || match[3] === 'Z') {
    // No-op, UTC time zone.
  } else {
    result.utcOffset = utcOffset(match[3])
  }

  return result
}
