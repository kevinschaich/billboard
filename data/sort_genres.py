#!/usr/bin/env python

import urllib2, json, csv, os, re, sys
from pprint import pprint

genres = {}

# Iterate through years
for year in range(1950, 2016):
    with open('years/' + str(year) + '.json') as data_file:
        data = json.load(data_file)
        for song in data:
            for tag in song['tags']:
                if tag not in genres:
                    genres[tag] = 1
                else:
                    genres[tag] += 1

from operator import itemgetter
genres_sorted = sorted(genres.items(), key=itemgetter(1))

pprint(genres_sorted)