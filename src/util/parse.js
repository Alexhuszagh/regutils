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

import stdint from './stdint'

/**
 *  Utilities for parsing primitive values.
 */

/**
 *  Parse integer with non-finite range.
 */
const int = (number, min, max, radix) => {
  let value = parseInt(number, radix)
  if (value < min || value > max || Number.isNaN(value)) {
    throw new Error(`invalid integer for range [${min}, ${max}] with value ${number}`)
  }

  return value
}

/**
 *  Parse float with non-finite range.
 */
const float = (number, min, max) => {
  let value = parseFloat(number)
  if (value < min || value > max || Number.isNaN(value)) {
    throw new Error(`invalid float for range [${min}, ${max}] with value ${number}`)
  }

  return value
}

/**
 *  Parse separator-delimited numerical address.
 */
const address = (string, delimiter, min, max, radix) => {
  return string
    .split(delimiter)
    .map(x => int(x, min, max, radix))
}

export default {
  int,
  float,
  address,
  int8: (number, radix) => int(number, stdint.INT8_MIN, stdint.INT8_MAX, radix),
  uint8: (number, radix) => int(number, stdint.UINT8_MIN, stdint.UINT8_MAX, radix),
  int16: (number, radix) => int(number, stdint.INT16_MIN, stdint.INT16_MAX, radix),
  uint16: (number, radix) => int(number, stdint.UINT16_MIN, stdint.UINT16_MAX, radix),
  int32: (number, radix) => int(number, stdint.INT32_MIN, stdint.INT32_MAX, radix),
  uint32: (number, radix) => int(number, stdint.UINT32_MIN, stdint.UINT32_MAX, radix)
}