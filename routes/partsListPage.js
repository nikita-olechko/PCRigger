var {
    database
  } = include('databaseConnection');
  
  const partsCollections = database.db(mongodb_database).collection('BOB');