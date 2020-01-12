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
 *  Find contiguous subarrays matching a given condition.
 */
const windows = (array, condition) => {
  let result = []
  let window
  for (let i = 0; i < array.length; i++) {
    let value = array[i]
    if (condition(value) && window !== undefined) {
      window.array.push(value)
    } else if (condition(value)) {
      window = {
        index: i,
        array: [value]
      }
    } else if (window !== undefined) {
      result.push(window)
      window = undefined
    }
  }
  if (window !== undefined) {
    result.push(window)
  }

  return result
}

/**
 *  Find the maximum element of an array, using key as
 *  the comparison function if provided.
 */
const max = (array, key) => {
  let keyfunc = key || (x => x)
  let max
  for (let i = 0; i < array.length; ++i) {
    let value = array[i]
    if (max === undefined || keyfunc(value) > keyfunc(max)) {
      max = value
    }
  }
  return max
}

/**
 *  Find the minimum element of an array, using key as
 *  the comparison function if provided.
 */
const min = (array, key) => {
  let keyfunc = key || (x => x)
  let min
  for (let i = 0; i < array.length; ++i) {
    let value = array[i]
    if (min === undefined || keyfunc(value) < keyfunc(min)) {
      min = value
    }
  }
  return min
}

/**
 *  Remove duplicates from the array, keeping the original order.
 */
const unique = (array, key) => {
  let keyfunc = key || (x => x)
  let unique = []
  let memo = new Set()
  for (let value of array) {
    if (!memo.has(keyfunc(value))) {
      memo.add(keyfunc(value))
      unique.push(value)
    }
  }

  return unique
}

export default {
  windows,
  max,
  min,
  unique
}
