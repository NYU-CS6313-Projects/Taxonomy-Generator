#!/bin/sh
# @author Joschi <josua.krause@gmail.com>
# created 2015-02-16 15:35

if [ -z `git branch | grep "* master"` ]; then
  echo "not on master"
  exit 1
fi

git checkout gh-pages && git merge --ff-only master && git push origin gh-pages && git checkout master
