export enum Tariff {
    TRIP = 'trip',
    TOUR = 'tour',
    TRAVEL = 'travel',
}

export const price = {
    [Tariff.TRIP]: 270,
    [Tariff.TOUR]: 330,
    [Tariff.TRAVEL]: 390,
}

export const kilometrage = {
    [Tariff.TRIP]: 200,
    [Tariff.TOUR]: 350,
    [Tariff.TRAVEL]: 500,
}

export function discount(days) {
    if (days >= 3 && days <= 5) {
        return 5;
    }

    if (days >= 6 && days <= 14) {
        return 10;
    }

    if (days >= 15 && days <= 30) {
        return 15;
    }

    return 0;
}

export function calculateAmount(days: number, tariff: Tariff): number {
    return this.price[tariff] * days * ((100 - discount(days)) / 100);
}

export function calculateKilometrage(days: number, tariff: Tariff): number {
    return this.kilometrage[tariff] * days;
}