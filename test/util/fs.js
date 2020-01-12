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

import expect from '../expect'
import tmp from '../tmp'
import fs from '../../src/util/fs'

describe('fs', () => {
  describe('exists', () => {
    it('should detect if the file exists', async () => {
      let name = await tmp.tmpName()
      expect(await fs.exists(name)).to.equal(false)

      // Create empty file at path.
      await fs.close(await fs.open(name, 'w+'))
      expect(await fs.exists(name)).to.equal(true)

      // Remove file at path.
      await fs.removeFile(name)
      expect(await fs.exists(name)).to.equal(false)
    })

    it('should detect if the folder exists', async () => {
      let name = await tmp.tmpName()
      expect(await fs.exists(name)).to.equal(false)

      // Create empty directory at path.
      await fs.makeDirectory(name)
      expect(await fs.exists(name)).to.equal(true)

      // Remove directory at path.
      await fs.removeDirectory(name)
      expect(await fs.exists(name)).to.equal(false)
    })
  })
})