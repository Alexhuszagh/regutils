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
 *  Parse jCard time to JS object.
 *
 *  Examples:
 *    23:20:50
 *    23:20
 *    23
 *    -20:50
 *    -20
 *    --50
 *
 *  https://tools.ietf.org/html/rfc7095#section-3.5.4
 */
export default time => {
  // Extract groups, splitting on ':' or '-', since '-'
  // will elipse missing starting groups.
  let groups = time.split(/[-:]/)
  let hours = groups[0]
  let minutes = groups[1]
  let seconds = groups[2]

  // Convert to object.
  let result = {}
  if (hours) {
    result.hours = parseInt(hours)
  }
  if (minutes) {
    result.minutes = parseInt(minutes)
  }
  if (seconds) {
    result.seconds = parseInt(seconds)
  }

  return result
}
