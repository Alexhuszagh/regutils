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
import jcard from '../../src/jcard'

const VCARD_ARRAY = ["vcard",
  [
    ["version", {}, "text", "4.0"],
    ["fn", {}, "text", "Redpill Linpro RIPE hostmaster"],
    ["kind", {}, "text", "group"],
    ["adr",
      {
        "label" : "Managed Services team 0\nPostbox 4 Nydalen\n0409 Oslo\nNorway"
      },
      "text",
      ["", "", "", "", "", "", ""]
    ],
    ["tel", { "type" : "voice" }, "text", "+47 08192"],
    ["source", {}, "uri", "ldap://ldap.example.com/cn=babs%20jensen"],
    ["x-date-local", {}, "date", "1985-04-12"],
    ["x-time-local", {}, "time", "12:30:00"],
    ["anniversary", {}, "date-time", "2013-02-14T12:30:00"],
    ["bday", {}, "date-and-or-time", "2013-02-14T12:30:00"],
    ["rev", {}, "timestamp", "2013-02-14T12:30:00"],
    ["x-non-smoking", {}, "boolean", true],
    ["x-karma-points", {}, "integer", 42],
    ["x-grade", {}, "float", 1.3],
    ["tz", {}, "utc-offset", "-05:00"],
    ["lang", {}, "language-tag", "en"],
    ["email", { "type" : "email" }, "text", "noc@redpill-linpro.com"],
    ["email", { "type" : "abuse" }, "text", "abuse@redpill-linpro.com"],
    ["org", {}, "text", "ORG-LA61-RIPE"]
  ]
]

describe('jcard', () => {
  require('./card'),
  require('./types')

  it('should parse complex vcards', () => {
    expect(jcard(VCARD_ARRAY)).to.eql([
      {
        version: '4.0',
        fn: 'Redpill Linpro RIPE hostmaster',
        kind: 'group',
        adr: {
          label: 'Managed Services team 0\nPostbox 4 Nydalen\n0409 Oslo\nNorway'
        },
        tel: {
          voice: '+47 08192'
        },
        source: {
          type: 'uri',
          value: 'ldap://ldap.example.com/cn=babs%20jensen'
        },
        'x-date-local': {
          type: 'date',
          value: {
            day: 12,
            month: 4,
            year: 1985
          }
        },
        'x-time-local': {
          type: 'time',
          value: {
            hours: 12,
            minutes: 30,
            seconds: 0
          }
        },
        anniversary: {
          type: 'date-time',
          value: {
            date: {
              day: 14,
              month: 2,
              year: 2013
            },
            time: {
              hours: 12,
              minutes: 30,
              seconds: 0
            }
          }
        },
        bday: {
          type: 'date-and-or-time',
          value: {
            date: {
              day: 14,
              month: 2,
              year: 2013
            },
            time: {
              hours: 12,
              minutes: 30,
              seconds: 0
            }
          }
        },
        rev: {
          type: 'timestamp',
          value: {
            date: {
              day: 14,
              month: 2,
              year: 2013
            },
            time: {
              hours: 12,
              minutes: 30,
              seconds: 0
            }
          }
        },
        'x-non-smoking': true,
        'x-karma-points': 42,
        'x-grade': 1.3,
        tz: {
          type: 'utc-offset',
          value: {
            direction: '-',
            hours: 5,
            minutes: 0
          }
        },
        lang: {
          type: 'language-tag',
          value: 'en'
        },
        email: {
          email: 'noc@redpill-linpro.com',
          abuse: 'abuse@redpill-linpro.com'
        },
        org: 'ORG-LA61-RIPE'
      }
    ])
  })
})
