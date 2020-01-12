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

import types from './types'
import util from '../util'

const NATIVE_TYPES = new Set([
  'boolean',
  'float',
  'integer',
  'text'
])

/**
 *  Determine if the jCard type is a native type.
 */
const isNativeType = type => {
  return NATIVE_TYPES.has(type)
}

/**
 *  Parse a jCard structure.
 *
 *  The jCard has the following format.
 *
 *    [
 *      ["version", {}, "text", "4.0"],
 *      ["fn", {}, "text", "John Doe"],
 *      ["gender", {}, "text", "M"],
 *      ["categories", {}, "text", "computers", "cameras"],
 *      ...
 *    ]
 */
export default array => {
  // Go over an initial pass to generate the contact.
  let contact = {}
  for (let row of array) {
    // Each row has at least 4 values, using an XML-like dialect.
    const [key, params, type, rawValue] = row

    // Create array to simplify processing of data.
    let values
    if (Array.isArray(rawValue)) {
      values = rawValue
    } else {
      values = [rawValue]
    }

    // Map each type to the native JS type.
    // Also, we need to filter redundant data.
    values = values
      .map(types[type])
      .filter(x => x !== undefined)

    // Format the value to the represented format.
    let value
    if (values.length === 0) {
      // No-op, have no value.
    } else if (values.length === 1) {
      value = values[0]
    } else {
      value = values
    }

    // Remove the parameter type from the object,
    // for the next step.
    let parameterType = util.object.pop(params, 'type')

    // Need to consider key/value representation
    // of the object. If we have no type parameter,
    // assume it's a solitary key. If we have no parameters
    // and a JSON-native object, just report it using
    // key/value(s). Otherwise, if we have a type parameter,
    // then for each type, need to provide that as a subkey,
    // and then the data inside as a type.
    let data
    if (util.object.isEmpty(params) && isNativeType(type)) {
      data = value
    } else {
      data = { ...params }
      if (value !== undefined) {
        data.type = type
        data.value = value
      }
    }

    // Store the data in the contact object.
    if (data !== undefined) {
      if (parameterType === undefined) {
        // No parameter type, just a solitary key.
        contact[key] = data
      } else if (typeof parameterType === 'string') {
        // Single parameter type
        contact[key] = contact[key] || {}
        contact[key][parameterType] = data
      } else {
        // Multiple parameter keys.
        contact[key] = contact[key] || {}
        for (let paramType of parameterType) {
          contact[key][paramType] = data
        }
      }
    }
  }

  return contact
}