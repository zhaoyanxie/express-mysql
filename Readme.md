# Introduction

This API provides endpoints for teachers to perform administrative functions for their students. Teachers and students are identified by their email addresses.

Teachers' emails will be pre-loaded into the database, only the following teachers are loaded:

```
[
    {
        "id": 1,
        "email": "teacherjim@email.com"
    },
    {
        "id": 2,
        "email": "teacherjoe@email.com"
    },
    {
        "id": 3,
        "email": "teacherken@email.com"
    }
]
```

# Getting Started

Git clone from this repo and run `npm install` or `yarn`.

## To run in development mode

1. Import the database `testdb.sql`.
2. Run `npm run dev` or `yarn dev`. Test database `testdb` will have to be connected.

## To run in production mode

1. Import the database `school.sql`.
2. Run `npm start` or `yarn start`. Database `school` will have to be connected.

# Endpoints

## POST /api/register

- Headers: Content-Type: application/json
- Success response status: HTTP 204
- Request body example:

```
{
  "teacher": "teacherken@email.com"
  "students":
    [
      "studentjon@email.com",
      "studenthon@email.com"
    ]
}
```

One more example for Teacher Joe:

```
{
	"teacher": "teacherjoe@email.com",
	"students":
	    [
	      "commonstudent1@email.com",
	      "commonstudent2@email.com"
	    ]
}
```

## GET /api/commonstudents

- Success response status: HTTP 200
- Request body example 1: GET /api/commonstudents?teacher=teacherken%40example.com

```
{
  "students":
	    [
	      "commonstudent1@email.com",
	      "commonstudent2@email.com",
    	  "student_only_under_teacher_ken@email.com"
	    ]
}
```

- Request body example 2: GET /api/commonstudents?teacherken%40example.com&teacher=teacherjoe%40example.com

```
{
  "students":
	    [
	      "commonstudent1@email.com",
	      "commonstudent2@email.com",
	    ]
}
```

## POST /api/suspend

- Headers: Content-Type: application/json
- Success response status: HTTP 204
- Request body example:

```
{
  "student" : "student_only_under_teacher_ken@email.com"
}
```

## POST /api/retrievefornotifications

Sending notifications to students who satisfy the following criteria:

1. MUST NOT be suspended,
2. AND MUST fulfill AT LEAST ONE of the following:

- is registered with `teacherken@email.com`
- has been @mentioned in the notification

- Headers: Content-Type: application/json
- Success response status: HTTP 204
- Request body example:

```
{
  "teacher":  "teacherken@email.com",
  "notification": "Hello students! @studentagnes@example.com @studentmiche@example.com"
}
```

Response body:

```
{
    "recipients": [
        "commonstudent2@email.com",
        "commonstudent1@email.com",
        "student_only_under_teacher_ken@email.com",
        "studentagnes@example.com",
        "studentmiche@example.com"
    ]
}
```

# Error Handling:

If a teacher's email entered in as the request body for any endpoint does not exist, the following error will be shown:

- Failure response status: HTTP 400
- Response body:

```
{
    "message": "Teacher doesnotexist@email.com does not exist."
}
```

If a student's email entered in as the request body for any endpoint `/api/suspend` does not exist, the following error will be shown:

- Failure response status: HTTP 400
- Response body:

```
{
    "message": "Student doesnotexist@email.com does not exist."
}
```
