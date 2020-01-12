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

import util from './util'

/**
 *  Safely update variable or class at interval.
 *
 *  @param {Number} timeout - Timeout to refresh data.
 *  @param {Function} callback - Asynchronous function to generate data from scratch.
 *  @param {Function} cleanup - Asynchronous function to
 *  @returns {Function} Async function that returns currently stored data.
 *
 *  The cleanup function should accept data that is valid and complete.
 *  If an error is thrown, is it the responsibility of the caller
 *  to clean it up.
 */
export default (timeout, callback, cleanup) => {
  // Store state in the parent body, and then modify
  // them in the parent scope.
  let data
  let time = util.time.current()
  let result = async () => {
    // Fetch data if data is expired or undefined.
    // Do not handle any errors, let them propagate.
    let current = util.time.current()
    if (data === undefined || (current - time) > timeout) {
      // Acquire new data, keep reference to old data, and assign new data in data.
      let result = await callback()
      let old = data
      data = result
      time = current

      // Cleanup old data.
      if (cleanup !== undefined && old !== undefined) {
        await cleanup(old)
      }
    }
    return data
  }

  return result
}