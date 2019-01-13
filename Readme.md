# Before all:
Run `npm install` or `yarn`.

# To run in development mode:
1. Import the database `testdb.sql`.
2. Run `npm run dev` or `yarn dev`. Test database `testdb` will have to be connected.
## `testdb` tables
### `tbl_teachers`:
|id |email               |
|---|--------------------|
|1  |teacherken@email.com|
|2  |teacherjim@email.com|
|3  |teacherjoe@email.com|

### `tbl_students`:
|id |email                   |teachers_id|isSuspended|
|---|------------------------|-----------|------------|
|1  |student@email.com       |3          |0           |
|2  |studentjon@email.com    |(null)     |0           |
|3  |studenthon@email.com    |(null)     |0           |
|4  |studentonlyken@email.com|2          |0           |
|5  |studentmary@email.com   |1          |0           |
# To run in production mode:
1. Import the database `school.sql`.
2. Run `npm start` or `yarn start`. Database `school` will have to be connected.



