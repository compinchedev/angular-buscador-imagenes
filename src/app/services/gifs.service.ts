import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../gifs/interfaces/gifs.interface';

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  private _tagHistory: string[] = [];
  public gifList: Gif[] = [];
  private apiKey: string = '6SDItxdlKGBbLE8oVPoBcJKOJ5s35VSU';
  private url: string = 'http://api.giphy.com/v1/gifs';
  constructor(private http: HttpClient) {
    this.getLocalStorage();
  }

  get tagHistory() {
    return [...this._tagHistory];
  }

  searchTag(tag: string): void {
    if (tag.length === 0) return;
    this.organizeHistory(tag);
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '20')
      .set('q', tag);
    this.http
      .get<SearchResponse>(`${this.url}/search`, { params })
      .subscribe((response) => {
        this.gifList = response.data;
        console.log(this.gifList);
      });
  }

  organizeHistory(tag: string) {
    tag = tag.toLocaleLowerCase();

    if (this._tagHistory.includes(tag)) {
      this._tagHistory = this._tagHistory.filter((oldTag) => oldTag !== tag);
    }
    this._tagHistory.unshift(tag);
    this._tagHistory = this._tagHistory.splice(0, 10);
    this.saveLocalStorage();
  }

  saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagHistory));
  }
  private getLocalStorage() {
    if (!localStorage.getItem('history')) return;
    this._tagHistory = JSON.parse(localStorage.getItem('history')!);

    if (this._tagHistory.length === 0) return;
    this.searchTag(this._tagHistory[0]);
  }
}
