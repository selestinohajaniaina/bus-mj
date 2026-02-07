export interface Relation {
  type: string,
  id: number,
  members: Members[],
  tags: {
    colour: string,
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
}

export interface Members {
    type: string,
    ref: number,
    role: string,
    label: string
}

export interface Node {
  type: string,
  id: number,
  lat: number,
  lon: number,
  label: string
}