declare interface String {
    let: <T, R>(block: (self: string) => R) => R;
}

declare interface Number {
    let: <T, R>(block: (self: number) => R) => R;
}
