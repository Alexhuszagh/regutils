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
 *  Utilities to parse the jCard format to JSON.
 *
 *  jCard is a JSON version of the vCard data type,
 *  however, it really isn't a JSON format.
 *  It's XML-like in a JSON syntax, and it will destroy
 *  your soul.
 */

import errors from '../errors'
import card from './card'

/**
 *  Parse a vCardArray, which contains the internal jCards.
 *
 *  The vCardArray has the following format:
 *
 *    ["vcard",
 *      [
 *        ...
 *      ]
 *    ]
 */
export default array => {
  if (array.length === 0 || array[0] !== 'vcard') {
    throw new errors.Vcard(array)
  }

  return array.slice(1).map(card)
}