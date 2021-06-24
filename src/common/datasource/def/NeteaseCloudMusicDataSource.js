import {DataSource} from '../DataSource';
import TimeUtil from '../../util/TimeUtil';

/**
 * 网易云音乐数据源。
 * <p>
 */
export class NeteaseCloudMusicDataSource extends DataSource {

  constructor(icon, dataName, title, dataUrl, source) {
    super(icon, 'music.163.com', dataName, title, dataUrl, source);
  }

  processData(opt) {
    let list = [];
    let data = JSON.parse(opt.responseText);
    if (data && data.hotAlbums && data.hotAlbums.length > 0) {
      data.hotAlbums.forEach(x => {
        list.push({
          timestamp: TimeUtil.format(new Date(x.publishTime), 'yyyy-MM-dd'),
          id: x.id,
          judgment: x.id,
          dynamicInfo: `塞壬唱片发布新专辑《${x.name}》，共${x.size}首歌曲`,
          dataSourceType: opt.dataSourceType,
          image: x.picUrl + '?param=130y130',
          source: opt.source,
          icon: opt.icon,
          url: `https://music.163.com/#/album?id=${x.id}`,
          size: x.size,
          name: x.name
        });
      });
      return list.sort((x, y) => y.judgment - x.judgment);
    }
  }
}
