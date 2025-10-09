#!/bin/bash
pnpx typeorm-ts-node-commonjs migration:create "src/database/migrations/$1"