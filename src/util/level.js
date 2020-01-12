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
 *  Wrappers for leveldb-like databases.
 */

import encode from 'encoding-down'
import levelup from 'levelup'
import memdown from 'memdown'
import rocksdb from 'rocksdb'
import fs from './fs'

/**
 *  High-level wrapper around a leveldb-like store.
 *
 *  Uses RocksDB for the on-disk store, and
 *  a red/black-tree for the in-memory store.
 */
export default class Level {
  constructor(options, path) {
    this.options = options
    this.path = path
    if (path === undefined) {
      this.db = levelup(encode(memdown(), this.options))
    } else {
      this.db = levelup(encode(rocksdb(path), this.options))
    }
  }

  /**
   *  Custom callback to encode the key. Defaults to identity.
   */
  encodeKey(key) {
    return key
  }

  /**
   *  Custom callback to encode the value. Defaults to identity.
   */
  encodeValue(key, value) {
    return value
  }

  /**
   *  Custom callback to decode the key. Defaults to identity.
   */
  decodeKey(encodedKey) {
    return encodedKey
  }

  /**
   *  Custom callback to decode the value. Defaults to identity.
   */
  decodeValue(key, encodedValue) {
    return encodedValue
  }

  /**
   *  Get value from cache by key.
   */
  async get(key) {
    let encodedKey = this.encodeKey(key)
    let encodedValue = await this.db.get(encodedKey)
    return this.decodeValue(key, encodedValue)
  }

  /**
   *  Put value into cache at key.
   */
  async put(key, value) {
    let encodedKey = this.encodeKey(key)
    let encodedValue = this.encodeValue(key, value)
    await this.db.put(encodedKey, encodedValue)
  }

  /**
   *  Delete value from cache by key.
   */
  async del(key) {
    let encodedKey = this.encodeKey(key)
    await this.db.del(encodedKey)
  }

  /**
   *  Clear the database.
   */
  async clear() {
    await this.db.clear()
  }

  /**
   *  Close the database.
   */
  async close() {
    await this.db.close()
  }

  /**
   *  Close the database and remove the backing store.
   */
  async closeAndRemove() {
    await this.close()
    if (this.path !== undefined) {
      // Set path after removing the directory
      // to avoid repeated calls.
      await fs.removeDirectory(this.path, {
        recursive: true
      })
      this.path = undefined
    }
  }

  /**
   *  Get if the database connection is open.
   */
  get isOpen() {
    return this.db.isOpen()
  }

  /**
   *  Get if the database connection is closed.
   */
  get isClosed() {
    return this.db.isClosed()
  }
}