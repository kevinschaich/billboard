#!/usr/bin/env python

import urllib2, json, csv, os, re, HTMLParser, sys
from django.utils.encoding import smart_str, smart_unicode

import nltk
import nltk.sentiment.vader
import musicbrainzngs as mb
from textstat.textstat import textstat as ts

h = HTMLParser.HTMLParser()
mb.set_useragent("billboard-top-100-lyrics", "1.0", "schaich.kevin@gmail.com")

################################################################################
# Tag/Genre Analysis
################################################################################


def get_tags(artist):
    artist_id = mb.search_artists(artist)['artist-list'][0]['id']
    tags = mb.get_artist_by_id(artist_id, includes=["tags"])['artist']["tag-list"]

    return [tag['name'] for tag in tags]


################################################################################
# Sentiment Analysis
################################################################################


sent_analyzer = nltk.sentiment.vader.SentimentIntensityAnalyzer()


################################################################################
# Repetitiveness
################################################################################


def count_dupes(lyrics):
    list = lyrics.split("\n")
    count = 0
    seen = set()
    for item in list:
        if item in seen:
            count += 1
        else:
            seen.add(item)
    return count


################################################################################
# Analysis/Scraping
################################################################################


# Iterate through years
for year in range(int(sys.argv[1]), int(sys.argv[2])):
    dataset = []

    missed = 0

    print "Finding lyrics for year: " + str(year) + "\n\n"

    file = "billboard/" + str(year) + ".csv"

    # Get songs
    with open(file, 'rU') as f:
        reader = csv.reader(f)
        next(reader, None)
        songs = []

        for line in reader:
            songs.append(line)

        # Iterate through songs
        for song in songs:
            pos = -1
            try:
                pos = int(song[0])
            except Exception, e:
                print e
            artist = song[1].strip().replace("Weeknd", "The Weeknd")

            # clean up
            artist = re.sub(r' feat\..*', r'', artist)
            artist = re.sub(r' ft\..*', r'', artist)

            title = song[2]

            # clean up
            title = re.sub(" \(.*\)", "", title).strip()

            # Get Lyrics
            try:
                data = json.load(urllib2.urlopen('http://lyric-api.herokuapp.com/api/find/' + urllib2.quote(artist) + '/' + urllib2.quote(title)))

                if not data['lyric']:

                    artist = re.sub(r' and.*', r'', artist)
                    data = json.load(urllib2.urlopen('http://lyric-api.herokuapp.com/api/find/' + urllib2.quote(artist) + '/' + urllib2.quote(title)))

                    if not data['lyric']:
                        print "Could not find lyrics for " + artist + ' - ' + title
                        missed += 1

                # Save lyrics
                if data['lyric']:
                    writename = 'lyrics/' + str(year) + '/' + artist.replace(' ', '_') + '-' + title.replace(' ', '_') + ".txt"

                    lyrics = smart_str(h.unescape(data['lyric']))
                    lyrics_repl = lyrics.replace("\n", ". ")

                    dir = os.path.dirname(writename)
                    if not os.path.exists(dir):
                        os.makedirs(dir)

                    target = open(writename, 'w')
                    target.truncate()
                    target.write(lyrics)
                    target.close()

                    # Build Dataset
                    try:
                        cur = {
                            "title": title,
                            "artist": artist,
                            "year": year,
                            "pos": pos,
                            "lyrics": lyrics,
                            "tags": get_tags(artist),
                            "sentiment": sent_analyzer.polarity_scores(lyrics_repl),
                            "f_k_grade": ts.flesch_kincaid_grade(lyrics_repl),
                            "flesch_index": ts.flesch_reading_ease(lyrics_repl),
                            "fog_index": ts.gunning_fog(lyrics_repl),
                            "difficult_words": ts.difficult_words(lyrics_repl),
                            "num_syllables": ts.syllable_count(lyrics_repl),
                            "num_words": ts.lexicon_count(lyrics_repl, True),
                            "num_lines": ts.sentence_count(lyrics_repl),
                            "num_dupes": count_dupes(lyrics)
                        }
                        # print cur
                        dataset.append(cur)
                    except Exception, e:
                        print e

            except Exception, e:
                print "Exception occurred for " + artist + ' - ' + title
                print e

    outfile = "years/" + str(year) + '.txt'
    dir = os.path.dirname(outfile)
    if not os.path.exists(dir):
        os.makedirs(dir)
    with open(outfile, 'w') as f:
        f.truncate()
        json.dump(dataset, f)

    print "Could not find " + str(missed) + " lyrics for year: " + str(year) + "\n\n"
