export interface Coordinates {
    longitude: number,
    latitude: number
}

export interface MapMarker extends Coordinates {
  label: string;
}