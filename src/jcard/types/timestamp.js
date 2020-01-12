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

import utcOffset from './utcOffset'

/**
 *  Parse jCard timestamp to JS object.
 *
 *  Examples:
 *    2013-02-14T12:30:00
 *    2013-02-14T12:30:00Z
 *    2013-02-14T12:30:00-05
 *    2013-02-14T12:30:00-05:00
 *
 *  https://tools.ietf.org/html/rfc7095#section-3.5.7
 */
export default timestamp => {
  // Matches the date, time, then the UTC offset.
  //  Format:
  //    YYYY-MM-DDThh:mm:ss
  //    YYYY-MM-DDThh:mm:ssZ
  //    YYYY-MM-DDThh:mm:ss±hh
  //    YYYY-MM-DDThh:mm:ss±hh:mm
  let regex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(.*)$/
  let match = timestamp.match(regex)

  // Parse the known fields.
  let result = {
    date: {
      year: parseInt(match[1]),
      month: parseInt(match[2]),
      day: parseInt(match[3])
    },
    time: {
      hours: parseInt(match[4]),
      minutes: parseInt(match[5]),
      seconds: parseInt(match[6])
    }
  }

  // Parse the UTC offset.
  if (match[7] === '' || match[7] === 'Z') {
    // No-op, UTC time zone.
  } else {
    result.utcOffset = utcOffset(match[7])
  }

  return result
}