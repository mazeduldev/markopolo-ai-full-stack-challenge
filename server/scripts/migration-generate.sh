#!/bin/bash
pnpx typeorm-ts-node-commonjs migration:generate -d src/database/data-source.ts "src/database/migrations/$1"