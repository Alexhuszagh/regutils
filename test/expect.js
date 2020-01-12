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

import expect from 'expect.js'

/**
 *  Add method to check if an async method throws an exception.
 */
expect.Assertion.prototype.throwAsyncException = async function() {
  expect(this.obj).to.be.a('function')

  let thrown = false
  try {
    await this.obj()
  } catch (e) {
    thrown = true
  }

  let name = this.obj.name || 'fn'
  this.assert(
    thrown,
    () => 'expected ' + name + ' to throw an exception',
    () => 'expected ' + name + ' not to throw an exception'
  )
}

export default expect