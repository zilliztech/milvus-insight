const collectionTrans = {
  noLoadData: 'No Loaded Collection',
  noData: 'No Collection',

  rowCount: 'Approx Count',
  count: 'Entity Count',

  create: 'Collection',
  newColName: 'New Collection Name',
  alias: 'Alias',
  aliasTooltip: 'Please select one collection to create alias',
  collection: 'Collection',
  entities: 'entities',

  // table
  id: 'ID',
  name: 'Name',
  features: 'Features',
  nameTip: 'Collection Name',
  status: 'Status',
  desc: 'Description',
  createdTime: 'Created Time',
  maxLength: 'Max Length',
  dynamicSchema: 'Dynamic Schema',

  // table tooltip
  aliasInfo: 'Alias can be used as collection name in vector search.',
  consistencyLevelInfo:
    'Consistency refers to the property that ensures every node or replica has the same view of data when writing or reading data at a given time.',
  entityCountInfo:
    'This count is an approximation and may be slightly delayed due to the unique mechanisms of Milvus. The actual count may vary and is updated periodically. Please note that this number should be used as a reference and not as an exact count.',
  replicaTooltip: 'The number of replicas for the collection, it can not exceed the number of query nodes.',
  modifyReplicaTooltip: 'Modify Replica Number',

  // create dialog
  createTitle: 'Create Collection',
  general: 'General information',
  schema: 'Schema',
  consistency: 'Consistency',
  consistencyLevel: 'Consistency Level',
  description: 'Description',
  fieldType: 'Type',
  elementType: 'Array Type',
  vectorFieldType: 'Vector Field Type',
  fieldName: 'Field',
  idFieldName: 'Primary Key Field',
  vectorFieldName: 'Vector Field',
  autoId: 'Auto ID',
  autoIdToggleTip:
    'Whether the primary key is automatically generated by Milvus, only support INT64.',
  vectorType: 'Type',
  idType: 'Type',
  dimension: 'Dimension',
  dimensionTooltip: 'Only vector type has dimension',
  dimensionMultipleWarning: 'Dimension should be 8 multiple',
  dimensionPositiveWarning: 'Positive number only',
  newBtn: 'add new field',
  nameLengthWarning: 'Name length should be less than 256',
  nameContentWarning: 'Only numbers, letters, and underscores are allowed.',
  nameFirstLetterWarning:
    'Name first character must be underscore or character(a~z, A~Z)',
  partitionKey: 'Partition Key',
  partitionKeyTooltip:
    ' Milvus will store entities in a partition according to the values in the partition key field. Only one Int64 or VarChar field is supported.',
  enableDynamicSchema: 'Dynamic Schema',
  analyzer: 'Analyzer',
  enableMatch: 'Enable Match',
  textMatchTooltip: 'Text match in Milvus enables precise document retrieval based on specific terms.',

  // load dialog
  loadTitle: 'Load Collection',
  loadContent:
    'All search and query operations within Milvus are executed in memory, only loaded collection can be searched.',
  loadConfirmLabel: 'Load',
  replica: 'Replica',
  replicaNum: 'Replica number',
  replicaDes: `With in-memory replicas, Milvus can load the same segment on multiple query nodes. The replica number can not exceed query node count.`,
  enableRepica: `Enable in-memory replica`,

  // release dialog
  releaseTitle: 'Release Collection',
  releaseContent:
    'You are trying to release a collection with data. Please be aware that the data will no longer be available for search.',
  releaseConfirmLabel: 'Release',

  // delete dialog
  deleteWarning: `You are trying to delete a collection with data. This action cannot be undone.`,
  deleteDataWarning: `You are trying to delete entities. This action cannot be undone.`,
  deleteAliasWarning: `You are trying to drop an alias. This action cannot be undone.`,

  // collection tabs
  partitionTab: 'Partitions',
  overviewTab: 'Overview',
  schemaTab: 'Schema',
  searchTab: 'Vector Search',
  dataTab: 'Data',
  previewTab: 'Data Preview',
  segmentsTab: 'Segments',
  propertiesTab: 'Properties',
  startTip: 'Start Your Data Query',
  exprPlaceHolder: 'Please enter your query expression, eg: id > 0',
  queryExpression: 'Query Expression',

  // alias dialog
  aliasCreatePlaceholder: 'Alias Name',

  // rename dialog
  newColNamePlaceholder: 'New Collection Name',
  newNameInfo: 'Only numbers, letters, and underscores are allowed.',

  // duplicate dialog
  duplicateNameExist: 'A collection with this name already exists.',

  // segment
  segments: 'Segments',
  segPState: 'Persistent Segment State',
  partitionID: 'Partition ID',
  segmentID: 'Segment ID',
  num_rows: 'Row Count',
  q_nodeIds: 'Query Node IDs',
  q_index_name: 'Index Name',
  q_indexID: 'Index ID',
  q_state: 'Query Segment State',
  q_mem_size: 'Memory Size',
  compact: 'Compact',
  compactDialogInfo: `Compaction is a process that optimizes storage and query performance by organizing segments.  <a href='https://milvus.io/blog/2022-2-21-compact.md' target="_blank">Learn more</a><br /><br />  Please note that this operation may take some time to complete, especially for large datasets. We recommend running compaction during periods of lower system activity or during scheduled maintenance to minimize disruption.
    `,

  // column tooltip
  autoIDTooltip: `The values of the primary key column are automatically generated by Milvus.`,
  dynamicSchemaTooltip: `Dynamic schema enables users to insert entities with new fields into a Milvus collection without modifying the existing schema.`,
  consistencyLevelTooltip: `Consistency in a distributed database specifically refers to the property that ensures every node or replica has the same view of data when writing or reading data at a given time.`,
  consistencyBoundedTooltip: `It allows data inconsistency during a certain period of time`,
  consistencyStrongTooltip: `It ensures that users can read the latest version of data.`,
  consistencySessionTooltip: `It ensures that all data writes can be immediately perceived in reads during the same session.`,
  consistencyEventuallyTooltip: `There is no guaranteed order of reads and writes, and replicas eventually converge to the same state given that no further write operations are done.`,
  releaseCollectionFirst: `Please release your collection first.`,
  noVectorIndexTooltip: `Please make sure all vector fields have index.`,

  clickToLoad: 'Click to load the collection.',
  clickToRelease: 'Click to release the collection.',
  clickToSearch: 'Click to execute vector search.',
  clickToCreateVectorIndex: 'Click to create the vector index.',
  collectionIsLoading: 'The collection is loading...',
};

export default collectionTrans;
