# billboard-top-100-lyrics

Lyrics/associated Natural Language Processing (NLP) data for Billboard"s Top 100, 1950-2015.

###Data

Each song is represented by a JSON object with the following properties:

```python
{
    "title": [string],              # Title of the song.       
    "artist": [string],             # Artist of the song.
    "year": [int],                  # Release year of the song.
    "pos": [int],                   # Position of Billboard's Top 100 for year [year].
    "lyrics": [string],             # Lyrics of the song.
    "tags": [string array],         # Genre tags associated with artist of the song.
    "sentiment": {
        "neg": [float],             # Negativity assoc. w/ lyrics. (between 0-1 inclusive, 1 being 100% negative).
        "neu": [float],             # Neutrality assoc. w/ lyrics. (between 0-1 inclusive, 1 being 100% neutral).
        "pos": [float],             # Positivity assoc. w/ lyrics. (between 0-1 inclusive, 1 being 100% positive).
        "compound": [float]
    },
    "f_k_grade": [float],           # Flesch–Kincaid grade level of lyrics.
    "flesch_index": [float],        # Flesch reading ease score.
    "fog_index": [float],           # Gunning-Fog readability index.
    "difficult_words": [int],       # Number of words not on the Dale–Chall "easy" word list.
    "num_syllables": [int],         # Number of syllables in lyrics.
    "num_words": [int],             # Number of words in lyrics.
    "num_lines": [int],             # Number of lines in lyrics.
    "num_dupes": [int]              # Number of duplicate (repetitive) lines in lyrics.
}
```
