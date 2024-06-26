import { group } from "console";

const searchTrans = {
  firstTip: '2. 输入搜索向量 {{dimensionTip}}',
  secondTip: '1. 选择Collection和字段',
  thirdTip: '搜索参数 {{metricType}}',
  vectorPlaceholder: '请在此输入您的向量值，例如 [1, 2, 3, 4]',
  collection: '已加载的Collection',
  noCollection: '没有已加载的Collection',
  field: '向量字段',
  startTip: '开始您的向量搜索',
  empty: '无结果',
  result: '搜索结果',
  topK: 'TopK {{number}}',
  filter: '高级过滤',
  vectorValueWarning: '向量值应为长度为{{dimension}}的数组',
  timeTravel: '时间旅行',
  timeTravelPrefix: '之前的数据',
  dynamicFields: '动态字段',
  collectionNotLoaded: 'Collection 没有加载',
  advancedFilter: '高级过滤',
  addCondition: '添加条件',
  filterExpr: '过滤表达式',
  exprHelper: '表达式助手',
  loadCollectionFirst: '请先加载Collection.',
  noVectorToSearch: '没有用于搜索的向量数据.',
  noSelectedVectorField: '至少选择一个向量字段进行搜索.',
  rerank: '排序器',
  groupBy: '分组',
};

export default searchTrans;
