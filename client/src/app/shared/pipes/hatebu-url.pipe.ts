import { Pipe, PipeTransform } from '@angular/core';

/** 記事の URL をはてブの URL に変換する */
@Pipe({ name: 'hatebuUrl' })
export class HatebuUrlPipe implements PipeTransform {
  /**
   * 記事の URL をはてブの URL に変換する
   * 
   * @param url 記事の URL
   * @return はてブの URL
   */
  public transform(url: string): string {
    const encodedUrl = window.encodeURIComponent(url.replace((/^https?:\/\//), ''));
    // HTTPS の場合は `entry/s/` とする
    return `http://b.hatena.ne.jp/entry/${url.startsWith('https') ? 's/' : ''}${encodedUrl}`;
  }
}
