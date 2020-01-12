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
import dateTime from './dateTime'
import time from './time'

/**
 *  Parse jCard date-and-or-time to JS object.
 *
 *  Examples:
 *    2013-02-14T12:30:00
 *    ---22T14:00
 *    1985
 *    T12:30
 *
 *  https://tools.ietf.org/html/rfc7095#section-3.5.6
 */
export default dateAndOrTime => {
  if (dateAndOrTime.startsWith('T')) {
    return time(dateAndOrTime.slice(1))
  } else if (dateAndOrTime.includes('T')) {
    return dateTime(dateAndOrTime)
  } else {
    return date(dateAndOrTime)
  }
}