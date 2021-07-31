export enum Tariff {
    FIRST = 270,
    SECOND = 330,
    THIRD = 390,
}

let dailyPrice = [
  first: 270,

]
export function get
export function getTariff($distance) {
   if (0 < $distance && $distance <= 350) {
       return Tariff.FIRST
   }

    if (350 < $distance && $distance <= 500) {
        return Tariff.SECOND
    }

    if (500 < $distance) {
        return Tariff.THIRD
    }
}