import { Stop } from "./bus"

export interface Coordinates {
    longitude: number,
    latitude: number
}

export interface MapMarker extends Coordinates {
  label: string
}

export interface OSMResult {
  place_id: number,
  display_name: string,
  name: string,
  lon: string | number,
  lat: string | number,
  type: string,
  distance: number,
  display_distance: string,
  nearStop: Stop[],
  nearStopLength: number
}

export interface OSMResultStored extends OSMResult {
  saved_at: string
}