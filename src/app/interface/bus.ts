export interface Bus {
  type: string,
  id: number,
  members: Stop[],
  tags: {
    color: string,
    band: string[],
    board: string |null,
    fee: string,
    from: string,
    name: string,
    network: string,
    opening_hours: string,
    operator: string,
    "public_transport:version": string,
    ref: string,
    route: string,
    to: string,
    type: string
  }
};

export interface Stop {
  type: string,
  id: number,
  lat: number,
  lon: number,
  label: string | null,
}