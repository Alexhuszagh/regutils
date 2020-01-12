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
 *  Filesystem utilities.
 */

import fs from 'fs'
import path from 'path'
import util from 'util'

// INTERNAL

const readdir = util.promisify(fs.readdir)
const rmdir = util.promisify(fs.rmdir)
const unlink = util.promisify(fs.unlink)

/**
 *  Recursively remove directory from filesystem.
 *  Removes directory and entire subtree.
 */
const rmtree = async directory => {
  // Get all the subfolders and files.
  // Recursively remove those items.
  // Then, remove the empty directory.
  let nodes = await readdir(directory)
  await Promise.all(nodes.map(node => {
    let nodePath = path.join(directory, node)
    let stat = fs.lstatSync(nodePath)
    return stat.isDirectory() ? rmtree(nodePath) : unlink(nodePath)
  }))
  await rmdir(directory)
}

// EXPORTED

/**
 *  Remove file from filesystem.
 */
const removeFile = unlink

const removeDirectory = async (directory, options) => {
  if (options && options.recursive) {
    return rmtree(directory)
  } else {
    return rmdir(directory)
  }
}

/**
 *  Scan directory, returning all file types in directory.
 */
const scanDirectory = readdir

/**
 *  Get information about a file.
 */
const stat = util.promisify(fs.stat)

/**
 *  Get information about a file without following symlinks.
 */
const lstat = util.promisify(fs.lstat)

/**
 *  Get information about a file descriptor.
 */
const fstat = util.promisify(fs.fstat)

/**
 *  Determine if a file or directory exists.
 */
const exists = async path => {
  try {
    await stat(path)
    return true
  } catch (_) {
    return false
  }
}

/**
 *  Make a new directory.
 *
 *  If `recursive` is passed to options, make all
 *  parent directories if they do not exist.
 */
const makeDirectory = util.promisify(fs.mkdir)

/**
 *  Open file and return file descriptor.
 */
const open = util.promisify(fs.open)

/**
 *  Close open file descriptor.
 */
const close = util.promisify(fs.close)

export default {
  removeFile,
  removeDirectory,
  scanDirectory,
  stat,
  lstat,
  fstat,
  exists,
  makeDirectory,
  open,
  close
}