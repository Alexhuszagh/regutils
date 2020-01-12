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

import tmp from 'tmp'
import util from 'util'

const file = util.promisify(tmp.file)
const dir = util.promisify(tmp.dir)
const tmpName = util.promisify(tmp.tmpName)

/**
 *  Use a unique prefix to unambiguously identify tmpfiles
 *  created by regutils.
 */
const OPTIONS = {
  prefix: 'regutils-'
}

export default {
  file: async () => file(OPTIONS),
  dir: async () => dir(OPTIONS),
  tmpName: async () => tmpName(OPTIONS)
}