# billboard-top-100-lyrics

Lyrics/associated Natural Language Processing (NLP) data for Billboard"s Top 100, 1950-2015.

###Data

```python
{
    "title": [string],              //Title of the song.       
    "artist": [string],
    "year": [int],
    "pos": [int],
    "lyrics": [string],
    "tags": [string array],
    "sentiment": {
        "neg": [float],
        "neu": [float],
        "pos": [float],
        "compound": [float]
    },
    "f_k_grade": [float],
    "flesch_index": [float],
    "fog_index": [float],
    "difficult_words": [int],
    "num_syllables": [int],
    "num_words": [int],
    "num_lines": [int],
    "num_dupes": [int]
}
```
