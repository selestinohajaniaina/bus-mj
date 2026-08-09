import { Injectable } from '@angular/core';
import { OSMResult, OSMResultStored } from '../interface/Map';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly MY_PLACES_KEY = 'OSMResultStored';

  constructor() {}

  /**
   * Retourne tous les lieux enregistrés.
   */
  getAllMyPlaces(): OSMResultStored[] {
    const data = localStorage.getItem(this.MY_PLACES_KEY);
    return data ? (JSON.parse(data) as OSMResultStored[]) : [];
  }

  /**
   * Recherche des lieux par nom ou nom complet.
   */
  getMyPlacesByName(search: string): OSMResultStored[] {
    const keyword = search.trim().toLowerCase();

    return this.getAllMyPlaces().filter(
      (place) =>
        place.name?.toLowerCase().includes(keyword) ||
        place.display_name?.toLowerCase().includes(keyword)
    );
  }

  /**
   * Enregistre toute la liste.
   */
  saveMyPlaces(places: OSMResultStored[]): void {
    localStorage.setItem(this.MY_PLACES_KEY, JSON.stringify(places));
  }

  /**
   * Ajoute un nouveau lieu.
   */
  addMyPlace(place: OSMResult): void {
    const places = this.getAllMyPlaces();

    const exists = places.some((p) => p.osm_id === place.osm_id);

    if (!exists) {
      const _place = { ...place, saved_at: new Date().toISOString() };
      places.push(_place);
      this.saveMyPlaces(places);
    }
  }

  /**
   * Supprime un lieu à partir de son place_id.
   */
  removeMyPlace(placeId: number): void {
    const places = this.getAllMyPlaces().filter(
      (place) => place.osm_id !== placeId
    );

    this.saveMyPlaces(places);
  }

  /**
   * Supprime tous les lieux enregistrés.
   */
  clearMyPlaces(): void {
    localStorage.removeItem(this.MY_PLACES_KEY);
  }

  /**
   * Vérifie si aucun lieu n'est enregistré.
   */
  isEmpty(): boolean {
    return this.getAllMyPlaces().length === 0;
  }
}