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
 *  Pop key from object, returning the value (or default if not found).
 *
 *  Get value from key in object, and then delete that key
 *  from the object, returning the default value if the
 *  key is not present.
 */
const pop = (object, key, default_) => {
  // Key not found, return default.
  if (!object.hasOwnProperty(key)) {
    return default_
  }

  // Value present, access and remove it.
  let value = object[key]
  delete object[key]

  return value
}

/**
 *  Determine if the object is the empty object.
 */
const isEmpty = object => {
  return Object.keys(object).length === 0 && object.constructor === Object
}

export default {
  isEmpty,
  pop
}