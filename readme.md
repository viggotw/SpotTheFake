# Spot the fake
## Description
"Spot the fake" is a game where you try to distinguish real from fakery. The player is presented with a series of media content pairs, one of which is real and the other is fake. The player must choose which one is fake, and the game will tell them if they are correct or not.

Player stats are loged as individual files and stored in the `logs` folder.

## How to run
1. Clone the repository
2. Start the server by running `node server.js`
3. Open the game in your browser by going to `localhost:3000`

## Changing the game

### Changing number of levels per media type
In the file `public/script.js`, you can change the number of levels per media type by modifying the following constants:
```javascript
// Constants to define the number of tasks per media type
const image_levels = 2;
const text_levels = 2;
const audio_levels = 1;
const video_levels = 2;
```

### Adding new content
To add new content, simply add it to the suitable folder in the `public/media` folder. You must then create pairs manually by adding them to the `public/media/game_assets/pairs.json` file. The format of the file is as follows:
```json
{
    "images": [
        {
            "real": "path/to/real_image.jpg",
            "fake": "path/to/fake_image.jpg",
            "info": "Clue as to how to spot the fake"
        },
        ...
    ],
    "text": [
        {
            "real": "path/to/real_text.txt",
            "fake": "path/to/fake_text.txt",
            "info": "Clue as to how to spot the fake"
        },
        ...
    ],
    "audio": [
        {
            "real": "path/to/real_audio.mp3",
            "fake": "path/to/fake_audio.mp3",
            "info": "Clue as to how to spot the fake"
        },
        ...
    ],
    "videos": [
        {
            "real": "path/to/real_video.mp4",
            "fake": "path/to/fake_video.mp4",
            "info": "Clue as to how to spot the fake"
        },
        ...
    ]
}
```