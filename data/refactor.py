import json
from aggregate_genres import aggregate_genres
years = range(1950, 2016)

output = []

def fix_attrs(song):
    obj_new = {}

    for attr in song:
        # Discard irrelevant tags
        if attr == "tags":
            tags_new = []
            for tag in song["tags"]:
                for aggregate_genre in aggregate_genres:
                    for genres in aggregate_genre:
                        if tag in genres:
                            tags_new.append(aggregate_genre.keys()[0])
                            # print aggregate_genre.keys()[0]
                            continue
            obj_new[attr] = tags_new
        # Discard Lyrics
        elif not attr == "lyrics":
            obj_new[attr] = song[attr]

    return obj_new

for year in years:

    # Add all songs to this year's data
    with open('years/' + str(year) + '.json') as data_file:
        year_data = {"year": year, "songs": []}
        data = json.load(data_file)
        for song in data:
            year_data['songs'].append(fix_attrs(song))

        # Filter by genre
        # for genre in genres:
        #     genre_data = {"genre": genre, "songs": []}
        #     for song in data:
        #         if genre in song["tags"]:
        #             genre_data['songs'].append(song)
        #     year_data['genres'].append(genre_data)

        output.append(year_data)

with open('../src/data.json', 'w') as f:
    f.truncate()
    json.dump(output, f)
