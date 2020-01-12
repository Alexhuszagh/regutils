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

/**
 *  Parser for all the jCard types.
 *
 *  Since most jCard objects don't map well to
 *  JS (incomplete dates, etc.)
 */

import boolean from './boolean'
import date from './date'
import dateAndOrTime from './dateAndOrTime'
import dateTime from './dateTime'
import float from './float'
import integer from './integer'
import languageTag from './languageTag'
import text from './text'
import time from './time'
import timestamp from './timestamp'
import uri from './uri'
import utcOffset from './utcOffset'

export default {
  boolean,
  date,
  'date-and-or-time': dateAndOrTime,
  'date-time': dateTime,
  float,
  integer,
  'language-tag': languageTag,
  text,
  time,
  timestamp,
  uri,
  'utc-offset': utcOffset
}