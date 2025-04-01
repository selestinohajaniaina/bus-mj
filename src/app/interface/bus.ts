export interface Bus {
    label: string,
    color: string,
    band: string[],
    board: string | null
}

export interface Stop {
    key: string,
    value: string
}