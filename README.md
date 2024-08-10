# temp-code

Set and get a temporary code.

## Environment Variables

- `SECRET`: String to authenticate requests.

## PUT

Saves a code that expires in 60 seconds.

### Body Parameters

- `auth`: Must match `SECRET` or request will fail.
- `code`: String to store.

## GET

Responds with the stored code if it exists.

### Search Parameters

- `auth`: Must match `SECRET` or request will fail.
