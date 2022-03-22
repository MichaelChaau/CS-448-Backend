#!/usr/bin/env sh

cp -R /usr/src/app/lib/openapi.yaml /tmp/openapi.yaml
echo "servers:" >> /tmp/openapi.yaml
echo "  - url: '${SUT_BASE_URL}'" >> /tmp/openapi.yaml

node ./node_modules/mocha/bin/mocha -C