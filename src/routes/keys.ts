import type { Point } from './draw'

const keyMapEnglish = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
  [' '],
]
const keyMapHebrew = [
  ['/', '\'', 'ק', 'ר', 'א', 'ט', 'ו', 'ן', 'ם', 'פ'],
  ['ש', 'ד', 'ג', 'כ', 'ע', 'י', 'ח', 'ל', 'ך', 'ף'],
  ['ז', 'ס', 'ב', 'ה', 'נ', 'מ', 'צ', 'ת', 'ץ', '.'],
  [' '],
]

const keyLinesOffset = [0, 0.25, 0.75, 5]

const keysToPosition = {}

let keySize = 10
const paddingKeys = 2


function mapKeys(keys: string[][]) {
  for (let i = 0; i < keys.length; i++) {
    const row = keys[i]
    for (let j = 0; j < row.length; j++) {
      if (row[j]) {
        keysToPosition[row[j]] = {
          y: i * keySize + (paddingKeys / 2 * keySize),
          x: (j * keySize) + (keyLinesOffset[i] * keySize) + (paddingKeys / 2 * keySize),
        }
      }

    }
  }
}

export function init(width: number, height: number) {
  keySize = Math.min(width, height) / (10 + paddingKeys)
  mapKeys(keyMapEnglish)
  mapKeys(keyMapHebrew)
}

export function getKeyPosition(key: string): Point {
  return keysToPosition[key]
}

