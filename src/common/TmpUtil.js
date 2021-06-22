import defaultDataSources from './DefaultDataSources';

/**
 * 临时工具类
 * TODO 暂时不知道放哪的工具方法先放这边，需要逐步重构掉
 */

function sourceToName(source) {
  try {
    return defaultDataSources[source].dataName;
  } catch (e) {
  }
  return "";
}

function sourceNameToIcon(sourceName) {
  try {
    for (let source of defaultDataSources) {
      if (source.dataName === sourceName) {
        return source.icon;
      }
    }
  } catch (e) {
  }
  return "fail";
}
export {sourceToName, sourceNameToIcon};
