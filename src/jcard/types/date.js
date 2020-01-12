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
 *  Parse jCard date to JS object.
 *
 *  Examples:
 *    1985-04-12
 *    1985-04
 *    1985
 *    --04-12
 *    --04
 *    ---12
 *
 *  https://tools.ietf.org/html/rfc7095#section-3.5.3
 */
export default date => {
  // Extract groups.
  let groups
  if (date.startsWith('-')) {
    // Parsing a truncated version.
    groups = date.slice(1).split('-')
  } else {
    // Parsing the complete representation.
    groups = date.split('-')
  }

  // Parse fields.
  let year = groups[0]
  let month = groups[1]
  let day = groups[2]

  // Convert to object.
  let result = {}
  if (year) {
    result.year = parseInt(year)
  }
  if (month) {
    result.month = parseInt(month)
  }
  if (day) {
    result.day = parseInt(day)
  }

  return result
}
