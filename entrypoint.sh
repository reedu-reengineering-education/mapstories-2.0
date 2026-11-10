#!/bin/sh

find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_PUBLIC_MAPBOX_TOKEN#$NEXT_PUBLIC_MAPBOX_TOKEN#g"
find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_PUBLIC_BFDW_DOMAIN#$NEXT_PUBLIC_BFDW_DOMAIN#g"

if [ "$MIGRATE_DATABASE" = true ]
then
  echo "Running database migrations"
  npx --yes prisma@6.10.1 migrate deploy
  npx --yes prisma@6.10.1 db seed
else
  echo 'No Database migrations will be applied.'
  echo 'If there are missing Database migrations set environment variable MIGRATE_DATABASE to true'
fi

echo "Starting MAPSTORIES App"
exec "$@"