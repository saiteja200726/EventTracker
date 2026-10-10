# EventTracker backend — DynamoDB migration

## DynamoDB tables (create in the same AWS region as the backend)

1. `Users`: partition key `userId` (String). Add a Global Secondary Index named `email-index`, partition key `email` (String), projection `ALL`.
2. `Events`: partition key `eventId` (String).

No `Registrations` table is used in this version; registrations are stored in each event's `registeredUsers` list to preserve the current API behavior.

## Environment variables

Set these in your local `.env` (do not commit it):

```env
PORT=5000
JWT_SECRET=replace_with_a_long_random_secret
AWS_REGION=ap-south-1
USERS_TABLE=Users
USERS_EMAIL_INDEX=email-index
EVENTS_TABLE=Events
```

For EC2, use an attached IAM instance role rather than hard-coded AWS access keys. Grant least-privilege access to the `Users` and `Events` tables and the `email-index` index. Required actions include `dynamodb:GetItem`, `PutItem`, `Query`, `Scan`, `UpdateItem`, and `DeleteItem` as needed by these routes.

## Install and run

```bash
npm install
npm run dev
```

## Important limitations to address before production

- `GET /api/events` currently uses a DynamoDB Scan for parity with the old MongoDB `find()`. This is acceptable for a small demo, but should be replaced with a query-oriented key/index design as data grows.
- Uploaded event images remain on the server's local disk. EC2 instance storage is not durable deployment storage; use S3 for persistent images before production.
- Existing MongoDB records are not automatically migrated. Export and transform them separately if you need to preserve users/events. Old MongoDB ObjectIds need mapping to new string UUIDs, including `createdBy` and `registeredUsers` references.
- Email uniqueness is checked by querying the GSI but is not transactionally enforced under simultaneous duplicate registrations. For a production system, use a transactional/conditional design to enforce uniqueness.
- Check category values and date formats against your frontend. DynamoDB does not enforce the Mongoose schema validations.
