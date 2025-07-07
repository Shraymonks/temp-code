# temp-code

Set and get a temporary code.

## Environment Variables

- `SECRET`: String to authenticate requests.

## Headers

- `Authorization`: Must match `SECRET` or request will fail.

## PUT

Saves a code that expires in 60 seconds.

### Body Parameters

- `code`: String to store.

## GET

Responds with the stored code if it exists.
