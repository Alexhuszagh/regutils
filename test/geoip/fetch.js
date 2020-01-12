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
import model from '../../src/model'
import cache from '../../src/geoip/cache'
import fetch from '../../src/geoip/fetch'

describe('fetch', () => {
  it('should fetch all records', async () => {
    let cache_ = {
      asn: new cache.Asn(),
      ipv4: new cache.Ipv4(),
      ipv6: new cache.Ipv6()
    }
    let options = { rirs: ['ripe'] }
    await fetch(cache_, options)

    // Need to test actual data.
    let find = async (address, type) => {
      let result = await cache_[type].find(model[type].parse(address))
      return result !== null ? result.value.country : null
    }
    expect(await find('2.0.0.0', 'ipv4')).to.equal('FR')
    expect(await find('2.4.0.0', 'ipv4')).to.equal('FR')
    expect(await find('2.7.0.0', 'ipv4')).to.equal('FR')
    expect(await find('2.16.0.0', 'ipv4')).to.equal('EU')
    expect(await find('2.17.0.0', 'ipv4')).to.equal('EU')
    expect(await find('2.56.168.0', 'ipv4')).to.equal(null)
  }).timeout(100000)
})