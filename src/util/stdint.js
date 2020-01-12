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
 *  Min and max values for twos-complement signed
 *  integers, and unsigned integers.
 */

// Use `>>> 0` to ensure the results are unsigned.
// Then, use multiplication because bitshifts are
// treated as 32-bit integers, so we want to ensure
// we get the proper values idiomatically.
const L7 = (1 << 7) >>> 0
const L8 = (1 << 8) >>> 0
const L15 = L7 * L8
const L16 = L8 * L8
const L31 = L15 * L16
const L32 = L16 * L16

export default {
  INT8_MIN: -L7,
  INT8_MAX: L7 - 1,
  UINT8_MIN: 0,
  UINT8_MAX: L8 - 1,
  INT16_MIN: -L15,
  INT16_MAX: L15 - 1,
  UINT16_MIN: 0,
  UINT16_MAX: L16 - 1,
  INT32_MIN: -L31,
  INT32_MAX: L31 - 1,
  UINT32_MIN: 0,
  UINT32_MAX: L32 - 1
}
