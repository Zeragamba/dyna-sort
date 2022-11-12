set -e

yarn test --all
yarn build
cp ../../README.md ./dist
