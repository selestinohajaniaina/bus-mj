import { Injectable } from '@angular/core';
import { OSMResult, OSMResultStored } from '../interface/Map';
import { SearchHistory } from '../interface/bus';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly MY_PLACES_KEY = 'OSMResultStored';
  private readonly HISTORY_KEY = 'HistoryStored';

  constructor() {}

  /**
   * Retourne tous les lieux enregistrés.
   * @returns {OSMResultStored[]} La liste de tous les lieux enregistrés.
   */
  getAllMyPlaces(): OSMResultStored[] {
    const data = localStorage.getItem(this.MY_PLACES_KEY);
    return data ? (JSON.parse(data) as OSMResultStored[]) : [];
  }

  /**
   * Recherche des lieux par nom ou nom complet.
   * @param {string} search - Le mot-clé de recherche.
   * @returns {OSMResultStored[]} La liste des lieux correspondants à la recherche.
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
   * @param {OSMResultStored[]} places - La liste des lieux à enregistrer.
   */
  saveMyPlaces(places: OSMResultStored[]): void {
    localStorage.setItem(this.MY_PLACES_KEY, JSON.stringify(places));
  }

  /**
   * Ajoute un nouveau lieu.
   * @param {OSMResult} place - Le lieu à ajouter.
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
   * @param {number} placeId - L'identifiant du lieu à supprimer.
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
   * @returns {boolean} true si aucun lieu n'est enregistré, sinon false.
   */
  isEmpty(): boolean {
    return this.getAllMyPlaces().length === 0;
  }

  /**
   * Compter le nombre de lieux enregistrés.
   * @returns {number} Le nombre de lieux enregistrés.
   */
  countPlaces(): number {
    return this.getAllMyPlaces().length;
  }

  /**
   * Generer un nouvel identifiant pour l'historique des recherches.
   * @returns {number} Le nouvel identifiant pour l'historique.
   */
  getHistoryId(): number {
    const data = localStorage.getItem(this.HISTORY_KEY);
    return data?.length ? data.length + 1 : 1;
  }

  /**
   * Retourne l'historique des recherches.
   * @returns {string[]} La liste des recherches précédentes.
   */
  getHistory(): SearchHistory[] {
    const data = localStorage.getItem(this.HISTORY_KEY);
    return data ? (JSON.parse(data) as SearchHistory[]) : [];
  }

    /**
   * Recherche des historique par nom.
   * @param {string} search - Le mot-clé de recherche.
   * @returns {SearchHistory[]} La liste des historiques correspondants à la recherche.
   */
  getHistoryByName(search: string): SearchHistory[] {
    const keyword = search.trim().toLowerCase();

    return this.getHistory().filter(
      (history) =>
        history.display_name?.toLowerCase().includes(keyword)
    );
  }

  /**
   * Enregistre toute la liste.
   * @param {OSMResultStored[]} places - La liste des historiques à enregistrer.
   */
  saveMyHitories(history: SearchHistory[]): void {
    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
  }

  /**
   * Ajout un nouveau hitorique de recherche
   * @param {string} search - Le mot-clé de recherche.
   */
  addHistory(history: SearchHistory): void {
    const _history = this.getHistory();
    _history.push(history);
    this.saveMyHitories(_history);
  }

  /**
   * Compter le nombre de lieux enregistrés.
   * @returns {number} Le nombre de lieux enregistrés.
   */
  countHistory(): number {
    return this.getHistory().length;
  }

    /**
   * Supprime tous les historiques enregistrés.
   */
  clearHistory(): void {
    localStorage.removeItem(this.HISTORY_KEY);
  }
  
}