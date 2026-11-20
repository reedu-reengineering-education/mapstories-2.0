/**
 * Very coarse continent / region lookup for map coordinates, without any
 * external data. Only used to decide which gallery stories may be grouped
 * into one stack at low zoom levels, so the borders are approximations
 * (straight lines through seas, mountain ranges) and never shown to users.
 */

export type Continent =
  | 'europe'
  | 'africa'
  | 'asia'
  | 'north-america'
  | 'south-america'
  | 'oceania'
  | 'antarctica'

type Ring = [number, number][] // [lng, lat]

// Europe: Atlantic incl. Iceland/Azores, Mediterranean, Bosporus, Black Sea,
// Caucasus, Ural river / mountains
const EUROPE: Ring = [
  [-32, 36],
  [-5.6, 35.95],
  [8, 37.6],
  [11.5, 37.5],
  [12, 36.5],
  [14, 35.6],
  [20, 35],
  [24, 34.5],
  [28.2, 36.2],
  [26.8, 37.5],
  [26.2, 39.5],
  [26, 40],
  [29, 41],
  [29.1, 41.3],
  [33, 43],
  [37, 44],
  [40, 43.5],
  [47.5, 42],
  [50, 46],
  [52, 47.5],
  [55, 51],
  [59, 52],
  [59, 58],
  [60, 62],
  [65, 69],
  [68, 77],
  [68, 85],
  [-10, 85],
  [-18, 72],
  [-26, 67.5],
  [-32, 62],
]

// Africa: everything south of Europe, west of Sinai / Red Sea / Gulf of Aden
const AFRICA: Ring = [
  [-30, -40],
  [-30, 36],
  [34.2, 36],
  [34.2, 31.3],
  [34.9, 29.5],
  [36, 26],
  [38.5, 21],
  [41, 16],
  [43.3, 12.6],
  [52, 12],
  [60, 10],
  [60, -40],
]

// Oceania, split at the date line: Australia, New Guinea (east of the
// Indonesian border), Micronesia ...
const OCEANIA_WEST: Ring = [
  [110, -50],
  [110, -12],
  [125, -11],
  [130, -10.8],
  [141, -9.5],
  [141, -2.5],
  [131, 2],
  [133, 20],
  [143, 21],
  [150, 30],
  [180, 30],
  [180, -50],
]
// ... and Polynesia incl. Hawaii and Easter Island
const OCEANIA_EAST: Ring = [
  [-180, -50],
  [-180, 30],
  [-150, 30],
  [-130, 10],
  [-130, -10],
  [-105, -25],
  [-105, -50],
]

// North America incl. Greenland, Central America and the Caribbean
const NORTH_AMERICA: Ring = [
  [-169, 85],
  [-10, 85],
  [-26, 67.5],
  [-32, 62],
  [-32, 20],
  [-58, 12],
  [-61.5, 10.9],
  [-66, 11.2],
  [-70, 12.3],
  [-72.5, 13],
  [-76, 10],
  [-77.4, 8.6],
  [-77.9, 7.2],
  [-82, 5],
  [-120, 5],
  [-180, 50],
  [-180, 58],
  [-172, 62],
  [-169, 66],
]

const SOUTH_AMERICA: Ring = [
  [-92, -60],
  [-92, 3],
  [-82, 5],
  [-77.9, 7.2],
  [-77.4, 8.6],
  [-76, 10],
  [-72.5, 13],
  [-70, 12.3],
  [-66, 11.2],
  [-61.5, 10.9],
  [-58, 12],
  [-28, 5],
  [-25, -60],
]

// checked in this order, the first match wins; everything else is Asia
const CONTINENTS: [Continent, Ring][] = [
  ['europe', EUROPE],
  ['africa', AFRICA],
  ['oceania', OCEANIA_WEST],
  ['oceania', OCEANIA_EAST],
  ['north-america', NORTH_AMERICA],
  ['south-america', SOUTH_AMERICA],
]

function normalizeLng(lng: number) {
  return ((((lng + 180) % 360) + 360) % 360) - 180
}

function inRing(lng: number, lat: number, ring: Ring) {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]
    const [xj, yj] = ring[j]
    if (yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      inside = !inside
    }
  }
  return inside
}

export function getContinent(lng: number, lat: number): Continent {
  if (lat < -60) {
    return 'antarctica'
  }
  const x = normalizeLng(lng)
  for (const [continent, ring] of CONTINENTS) {
    if (inRing(x, lat, ring)) {
      return continent
    }
  }
  return 'asia'
}

/** Sub-continental region, e.g. "europe-north". */
export function getRegion(lng: number, lat: number): string {
  const x = normalizeLng(lng)
  const continent = getContinent(x, lat)
  const part = (() => {
    switch (continent) {
      case 'europe':
        if (lat >= 55 || (x < 2 && lat >= 50)) {return 'north'}
        if (lat < 44.5) {return 'south'}
        return x >= 15 ? 'east' : 'west'
      case 'africa':
        if (lat >= 15) {return 'north'}
        if (lat < -12) {return 'south'}
        return x < 12 ? 'west' : 'east'
      case 'asia':
        if (x >= 0 && x < 60) {return 'west'}
        if (x >= 0 && x < 87 && lat >= 35) {return 'central'}
        if (lat >= 50 || x < 0) {return 'north'}
        if (x < 92 && lat < 35) {return 'south'}
        if (lat < 21 || (x < 102 && lat < 28)) {return 'southeast'}
        return 'east'
      case 'north-america':
        if (lat >= 50) {return 'north'}
        return lat >= 24.5 ? 'mid' : 'central'
      case 'south-america':
        return lat >= -15 ? 'north' : 'south'
      case 'oceania':
        if (x > 0 && x < 155 && lat < -9.5) {return 'australia'}
        if (x > 160 && lat < -30) {return 'new-zealand'}
        return 'pacific'
      default:
        return 'all'
    }
  })()
  return `${continent}-${part}`
}
